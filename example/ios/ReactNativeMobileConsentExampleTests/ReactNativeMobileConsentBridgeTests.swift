import XCTest
import React
@_spi(SPCrossPlatform) import SPMobileConsent
@testable import ReactNativeMobileConsent

/// Covers the same ground as the Android bridge's `ReactNativeMobileConsentModuleOperationTest`:
/// per-method validation-error and before-init behaviour for every method
/// `ReactNativeMobileConsentImpl` exposes to JS.
///
/// Two things are structurally different from Android here, both confirmed while writing this:
///
/// 1. **No wiring-completeness test is needed.** `operation(method:payload:)` switches over
///    `SPPlatformMethod`, a Swift enum — the compiler enforces exhaustiveness, so the bug class
///    this file's Android counterpart exists to catch (a method dispatched but never given a
///    `case` in the switch) cannot compile in the first place. If a new `SPPlatformMethod` case
///    is ever added without a matching `case` here, the build breaks before any test runs.
///
/// 2. **No mocked-engine success-path tests.** `SPConsentEngine`'s protocol methods return
///    `SPDataMessage<T>` (`sdk/native/ios/.../SPCore/Data/DTO/DTO.swift`), and every one of that
///    type's initialisers is `internal` to the `SPMobileConsent` module — there is no public (or
///    `@_spi`) way to construct one from outside it, so no conforming fake can be written from a
///    test target. `EngineStore.shared` therefore can never hold a non-nil engine in this suite,
///    which makes every branch gated on "no engine yet" reliably reachable, but makes every
///    "with an initialised engine" branch reliably *unreachable* — success paths need a real
///    instrumented test against a live backend, not this suite.
///
/// That same constraint is also why some cases below call `SPPlatformHandler` directly instead of
/// through `ReactNativeMobileConsentImpl`: `getCollectedConsentInfo` and `getBuildVersion` have no
/// `@objc` wrapper on either platform (dead code, not reachable from JS — confirmed against the
/// TS spec), and `addListener`/`removeListener`'s wrappers are fire-and-forget (`Void`, no
/// resolve/reject), so their result isn't observable except by calling the handler that backs them.
final class ReactNativeMobileConsentBridgeTests: XCTestCase {

    private final class FakeEmitter: NSObject, SPConsentEventEmitter {
        func emitOnSPEvent(msg: String) {}
    }

    private var emitter: FakeEmitter!
    private var module: ReactNativeMobileConsentImpl!

    override func setUp() {
        super.setUp()
        // ReactNativeMobileConsentImpl stores its emitter `unowned`, not `weak` — it assumes
        // whoever constructs it keeps the emitter alive independently. A bare `FakeEmitter()`
        // temporary has nothing else retaining it and gets deallocated before `initialiseSDK`
        // reads `self.emitter` inside `getOrCreateEventHandler()`, crashing the whole test
        // process with "Attempted to read an unowned reference but the object was already
        // deallocated" (confirmed — this is what happened before `emitter` was hoisted to a
        // property here). Real RN usage is presumably safe because whatever supplies the
        // emitter there also holds a strong reference elsewhere in the module registry, but nothing
        // enforces that at the call site — this is a fragility worth flagging up separately.
        emitter = FakeEmitter()
        module = ReactNativeMobileConsentImpl(emitter: emitter)
    }

    // ---------------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------------

    /// Drives one of `module`'s `@objc` resolve/reject-style methods and waits for whichever
    /// block fires, returning the parsed JSON body either way.
    private func invoke(
        _ call: (@escaping RCTPromiseResolveBlock, @escaping RCTPromiseRejectBlock) -> Void
    ) -> [String: Any] {
        let expectation = expectation(description: "promise settled")
        var response: [String: Any] = [:]

        call({ value in
            if let jsonString = value as? String,
               let data = jsonString.data(using: .utf8),
               let dict = try? JSONSerialization.jsonObject(with: data) as? [String: Any] {
                response = dict
            }
            expectation.fulfill()
        }, { code, message, _ in
            response = ["code": -1, "msg": message ?? "", "error": code ?? ""]
            expectation.fulfill()
        })

        wait(for: [expectation], timeout: 5)
        return response
    }

    private func assertError(_ expected: SPPlatformError, _ response: [String: Any], file: StaticString = #filePath, line: UInt = #line) {
        XCTAssertEqual(
            expected.rawValue,
            response["error"] as? String,
            "expected error \(expected) (\(expected.rawValue)) but response was: \(response)",
            file: file,
            line: line
        )
    }

    private func jsonPayload(_ dict: [String: Any]) -> String {
        let data = try! JSONSerialization.data(withJSONObject: dict)
        return String(data: data, encoding: .utf8)!
    }

    private func appIdPayload(_ id: String = "app-1") -> String {
        jsonPayload(["applicationId": id])
    }

    // ---------------------------------------------------------------------
    // LogConfig (setLogConfigs)
    // ---------------------------------------------------------------------

    func testSetLogConfigsWithMissingConfigsReturnsMalformedError() {
        let response = invoke { resolve, reject in
            module.setLogConfigs(jsonPayload([:]), resolve: resolve, reject: reject)
        }
        assertError(.malformedLogConfigJson, response)
    }

    func testSetLogConfigsWithValidConfigSucceeds() {
        let payload = jsonPayload(["configs": [["type": "debug", "enabled": "true"]]])
        let response = invoke { resolve, reject in
            module.setLogConfigs(payload, resolve: resolve, reject: reject)
        }
        XCTAssertEqual(200, response["code"] as? Int)
    }

    // ---------------------------------------------------------------------
    // Initialise — iOS collapses "nil payload" and "malformed payload" into a
    // single `malformedAuthKeyJson` error (`nilAuthKeyArgs` is declared in
    // SPPlatformError but never returned by initialiseSDK — Android instead
    // distinguishes the two; a real but low-stakes cross-platform asymmetry).
    // ---------------------------------------------------------------------

    func testInitialiseSDKWithMissingApplicationIdReturnsMalformedAuthKeyError() {
        let response = invoke { resolve, reject in
            module.initialiseSDK(jsonPayload([:]), resolve: resolve, reject: reject)
        }
        assertError(.malformedAuthKeyJson, response)
    }

    // ---------------------------------------------------------------------
    // GetLocale
    // ---------------------------------------------------------------------

    func testGetLocaleWithMalformedAppIdReturnsError() {
        let response = invoke { resolve, reject in
            module.getLocale(jsonPayload([:]), resolve: resolve, reject: reject)
        }
        assertError(.getLocaleWithMalformedAppId, response)
    }

    // ---------------------------------------------------------------------
    // GetClientId
    // ---------------------------------------------------------------------

    func testGetClientIdWithMalformedAppIdReturnsError() {
        let response = invoke { resolve, reject in
            module.getClientId(jsonPayload([:]), resolve: resolve, reject: reject)
        }
        assertError(.getClientIdWithMalformedAppId, response)
    }

    func testGetClientIdBeforeInitReturnsError() {
        let response = invoke { resolve, reject in
            module.getClientId(appIdPayload(), resolve: resolve, reject: reject)
        }
        assertError(.getClientIdBeforeInit, response)
    }

    // ---------------------------------------------------------------------
    // GetConsentStatus — SPPlatformHandler.getConsentStatus (native SDK, not
    // this bridge) returns the WRONG SPPlatformError cases for both its
    // guards: `.getCollectedConsentInfoWithMalformedAppId` /
    // `.getCollectedConsentInfoBeforeInit` instead of its own
    // `.consentStatusRequestWithMalformedAppId` / `.consentStatusRequestBeforeInit`
    // (both of which exist and are otherwise unused). These two tests assert
    // the correct codes and are expected to fail until
    // sdk/native/ios/.../CrossPlatform/Platform/SPPlatformHandler.swift is fixed.
    // ---------------------------------------------------------------------

    func testGetConsentStatusWithMalformedAppIdReturnsConsentStatusError() {
        let response = invoke { resolve, reject in
            module.getConsentStatus(jsonPayload([:]), resolve: resolve, reject: reject)
        }
        assertError(.consentStatusRequestWithMalformedAppId, response)
    }

    func testGetConsentStatusBeforeInitReturnsConsentStatusError() {
        let response = invoke { resolve, reject in
            module.getConsentStatus(appIdPayload(), resolve: resolve, reject: reject)
        }
        assertError(.consentStatusRequestBeforeInit, response)
    }

    // ---------------------------------------------------------------------
    // GetLastConsentedAt
    // ---------------------------------------------------------------------

    func testGetLastConsentedAtWithMalformedAppIdReturnsError() {
        let response = invoke { resolve, reject in
            module.getLastConsentedAt(jsonPayload([:]), resolve: resolve, reject: reject)
        }
        assertError(.getLastConsentedAtWithMalformedAppId, response)
    }

    func testGetLastConsentedAtBeforeInitReturnsError() {
        let response = invoke { resolve, reject in
            module.getLastConsentedAt(appIdPayload(), resolve: resolve, reject: reject)
        }
        assertError(.getLastConsentedAtBeforeInit, response)
    }

    // ---------------------------------------------------------------------
    // GetConsentRecollectionReason — correctly wired on iOS (unlike Android).
    // ---------------------------------------------------------------------

    func testGetConsentRecollectionReasonWithMalformedAppIdReturnsError() {
        let response = invoke { resolve, reject in
            module.getConsentRecollectionReason(jsonPayload([:]), resolve: resolve, reject: reject)
        }
        assertError(.getConsentRecollectionReaseonWithMalformedAppId, response)
    }

    func testGetConsentRecollectionReasonBeforeInitReturnsError() {
        let response = invoke { resolve, reject in
            module.getConsentRecollectionReason(appIdPayload(), resolve: resolve, reject: reject)
        }
        assertError(.getConsentRecollectionReaseonBeforeInit, response)
    }

    // ---------------------------------------------------------------------
    // ShowConsentBanner / ShowSecondaryConsentBanner — before-init only.
    // The "no view controller" branch sits behind the engine check in
    // SPPlatformHandler, so it cannot be reached without a real engine (see
    // the class doc) and isn't covered here. Code review found it anyway:
    // showSecondaryConsentBanner's no-VC guard returns
    // `.secondaryBannerCalledBeforeInit.noViewControllerErrorMsg()` instead of
    // the dedicated `.secondaryBannerCalledWithNoVC` that
    // showConsentBanner/showPreferenceCenter use for the same situation —
    // SPPlatformHandler.swift, showSecondaryConsentBanner, the `guard let vc =
    // ...` branch.
    // ---------------------------------------------------------------------

    func testShowConsentBannerBeforeInitReturnsError() {
        let response = invoke { resolve, reject in
            module.showConsentBanner(resolve: resolve, reject: reject)
        }
        assertError(.consentBannerCalledBeforeInit, response)
    }

    func testShowSecondaryBannerBeforeInitReturnsError() {
        let response = invoke { resolve, reject in
            module.showSecondaryBanner(resolve: resolve, reject: reject)
        }
        assertError(.secondaryBannerCalledBeforeInit, response)
    }

    // ---------------------------------------------------------------------
    // ShowPreferenceCenter
    // ---------------------------------------------------------------------

    func testShowPreferenceCenterWithMalformedAppIdReturnsError() {
        let response = invoke { resolve, reject in
            module.showPreferenceCenter(jsonPayload([:]), resolve: resolve, reject: reject)
        }
        assertError(.preferenceCenterCalledWithMalformedAppId, response)
    }

    func testShowPreferenceCenterBeforeInitReturnsError() {
        let response = invoke { resolve, reject in
            module.showPreferenceCenter(appIdPayload(), resolve: resolve, reject: reject)
        }
        assertError(.preferenceCenterCalledBeforeInit, response)
    }

    // ---------------------------------------------------------------------
    // GetPackage
    // ---------------------------------------------------------------------

    func testGetPackageWithMalformedAppIdReturnsError() {
        let response = invoke { resolve, reject in
            module.getPackage(jsonPayload([:]), resolve: resolve, reject: reject)
        }
        assertError(.getPackageWithMalformedAppId, response)
    }

    func testGetPackageWithMalformedPackageIdReturnsError() {
        let response = invoke { resolve, reject in
            module.getPackage(appIdPayload(), resolve: resolve, reject: reject)
        }
        assertError(.getPackageWithMalformedPackageId, response)
    }

    func testGetPackageBeforeInitReturnsError() {
        let payload = jsonPayload(["applicationId": "app-1", "packageId": "pkg-1"])
        let response = invoke { resolve, reject in
            module.getPackage(payload, resolve: resolve, reject: reject)
        }
        assertError(.getPackageBeforeInit, response)
    }

    // ---------------------------------------------------------------------
    // ClearSession
    // ---------------------------------------------------------------------

    func testClearSessionSucceeds() {
        let response = invoke { resolve, reject in
            module.clearSession(resolve: resolve, reject: reject)
        }
        XCTAssertEqual(200, response["code"] as? Int)
    }

    // ---------------------------------------------------------------------
    // GetCollectedConsentInfo — no @objc wrapper on either platform (dead
    // code from JS's point of view), so called via SPPlatformHandler
    // directly. Same wrong-error-code bug as GetConsentStatus: both guards
    // return `.getPackageWithMalformedAppId` / `.getPackageBeforeInit`
    // instead of its own `.getCollectedConsentInfoWithMalformedAppId` /
    // `.getCollectedConsentInfoBeforeInit` — expected to fail until fixed.
    // ---------------------------------------------------------------------

    func testGetCollectedConsentInfoWithMalformedAppIdReturnsOwnError() async {
        let result = await SPPlatformHandler.getCollectedConsentInfo(args: [:])
        XCTAssertEqual(SPPlatformError.getCollectedConsentInfoWithMalformedAppId.rawValue, result.error)
    }

    func testGetCollectedConsentInfoBeforeInitReturnsOwnError() async {
        let result = await SPPlatformHandler.getCollectedConsentInfo(args: ["applicationId": "app-1"])
        XCTAssertEqual(SPPlatformError.getCollectedConsentInfoBeforeInit.rawValue, result.error)
    }

    // ---------------------------------------------------------------------
    // AddListener / RemoveListener — fire-and-forget wrappers (no
    // resolve/reject), so exercised via SPPlatformHandler.addDelegate /
    // removeDelegate directly, which is what they call into.
    // ---------------------------------------------------------------------

    func testAddDelegateWithMalformedAppIdReturnsError() async {
        let result = await SPPlatformHandler.addDelegate(args: [:])
        XCTAssertEqual(SPPlatformError.addDelegateWithMalformedAppId.rawValue, result.error)
    }

    func testAddDelegateWithMalformedEventCodeReturnsError() async {
        let result = await SPPlatformHandler.addDelegate(args: ["applicationId": "app-1"])
        XCTAssertEqual(SPPlatformError.addDelegateWithMalformedEventCode.rawValue, result.error)
    }

    func testAddDelegateBeforeInitReturnsError() async {
        let result = await SPPlatformHandler.addDelegate(args: ["applicationId": "app-1", "eventCode": 1])
        XCTAssertEqual(SPPlatformError.addDelegateCalledBeforeInit.rawValue, result.error)
    }

    func testRemoveDelegateWithMalformedEventCodeReturnsError() async {
        let result = await SPPlatformHandler.removeDelegate(args: [:])
        XCTAssertEqual(SPPlatformError.removeDelegateWithMalformedEventCode.rawValue, result.error)
    }

    func testRemoveDelegateBeforeInitReturnsError() async {
        let result = await SPPlatformHandler.removeDelegate(args: ["eventCode": 1])
        XCTAssertEqual(SPPlatformError.removeDelegateCalledBeforeInit.rawValue, result.error)
    }
}
