import Foundation
@_spi(SPCrossPlatform) import SPMobileConsent

internal final class ReactNativePlatformEventHandler: BasePlatformEventHandler {

  init(emitter: SPConsentEventEmitter) {
    super.init{ msg in await MainActor.run {
      SPLogger.d(tag: "RN_EVENT", msg: "Sending event to RN: \(msg)")
      emitter.emitOnSPEvent(msg: msg)
    }}
  }
  
}
