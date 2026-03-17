import Foundation
import React
@_spi(SPCrossPlatform) import SPMobileConsent

@objc public class ReactNativeMobileConsentImpl: NSObject {
  
  private let notImplementedResponse = "{ \"code\" : 501, \"msg\": \"Method not implemented!\" }"
  
  private unowned let emitter: SPConsentEventEmitter
  
  @objc public init(emitter: SPConsentEventEmitter) {
    self.emitter = emitter
    super.init()
  }
  
  
  private var eventHandler: SPPlatformEventHandler?
  
  private func getOrCreateEventHandler() -> SPPlatformEventHandler {
    guard let eventHandler else {
      let eventHandler = ReactNativePlatformEventHandler(emitter: emitter)
      self.eventHandler = eventHandler
      return eventHandler
    }
    return eventHandler
  }
  
  private func platformResult(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> SPPlatformResult {
    return SPPlatformResultImpl(resolve: resolve, reject: reject)
  }
  
  @objc(setLogConfigs:resolve:reject:)
  public func setLogConfigs(
    _ payload: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      await SPPlatformExecutor.dispatch(
        method: SPPlatformMethod.logConfig,
        payload: payload,
        result: self.platformResult(resolve: resolve, reject: reject),
        operation: self.operation(method:payload:)
      )
    }
  }
  
  @objc(getLocale:resolve:reject:)
  public func getLocale(
    _ payload: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      await SPPlatformExecutor.dispatch(
        method: SPPlatformMethod.getLocale,
        payload: payload,
        result: self.platformResult(resolve: resolve, reject: reject),
        operation: self.operation(method:payload:)
      )
    }
  }
  
  @objc(initialiseSDK:resolve:reject:)
  public func initialiseSDK(
    _ payload: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      await SPPlatformExecutor.dispatch(
        method: SPPlatformMethod.initialise,
        payload: payload,
        result: self.platformResult(resolve: resolve, reject: reject),
        operation: self.operation(method:payload:)
      )
    }
  }
  
  @objc(getClientId:resolve:reject:)
  public func getClientId(
    _ payload: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      await SPPlatformExecutor.dispatch(
        method: SPPlatformMethod.getClientId,
        payload: payload,
        result: self.platformResult(resolve: resolve, reject: reject),
        operation: self.operation(method:payload:)
      )
    }
  }
  
  @objc(showConsentBanner:reject:)
  public func showConsentBanner(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      await SPPlatformExecutor.dispatch(
        method: SPPlatformMethod.showConsentBanner,
        payload: nil,
        result: self.platformResult(resolve: resolve, reject: reject),
        operation: self.operation(method:payload:)
      )
    }
  }
  
  @objc(showPreferenceCenter:resolve:reject:)
  public func showPreferenceCenter(
    _ payload: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      await SPPlatformExecutor.dispatch(
        method: SPPlatformMethod.showPreferenceCenter,
        payload: payload,
        result: self.platformResult(resolve: resolve, reject: reject),
        operation: self.operation(method:payload:)
      )
    }
  }
  
  @objc(showSecondaryBanner:reject:)
  public func showSecondaryBanner(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      await SPPlatformExecutor.dispatch(
        method: SPPlatformMethod.showSecondaryConsentBanner,
        payload: nil,
        result: self.platformResult(resolve: resolve, reject: reject),
        operation: self.operation(method:payload:)
      )
    }
    
  }
  
  @objc(getConsentStatus:resolve:reject:)
  public func getConsentStatus(
    _ payload: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      await SPPlatformExecutor.dispatch(
        method: SPPlatformMethod.getConsentStatus,
        payload: payload,
        result: self.platformResult(resolve: resolve, reject: reject),
        operation: self.operation(method:payload:)
      )
    }
  }
  
  @objc(getLastConsentedAt:resolve:reject:)
  public func getLastConsentedAt(
    _ payload: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      await SPPlatformExecutor.dispatch(
        method: SPPlatformMethod.getLastConsentedAt,
        payload: payload,
        result: self.platformResult(resolve: resolve, reject: reject),
        operation: self.operation(method:payload:)
      )
    }
  }
  
  @objc(getConsentRecollectionReason:resolve:reject:)
  public func getConsentRecollectionReason(
    _ payload: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      await SPPlatformExecutor.dispatch(
        method: SPPlatformMethod.getConsentRecollectionReason,
        payload: payload,
        result: self.platformResult(resolve: resolve, reject: reject),
        operation: self.operation(method:payload:)
      )
    }
  }
  
  @objc(getPackage:resolve:reject:)
  public func getPackage(
    _ payload: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      await SPPlatformExecutor.dispatch(
        method: SPPlatformMethod.getPackage,
        payload: payload,
        result: self.platformResult(resolve: resolve, reject: reject),
        operation: self.operation(method:payload:)
      )
    }
  }
  
  @objc(addConsentEventListener:)
  public func addConsentEventListener(_ payload: String) {
    Task {
      await SPPlatformExecutor.perform(
        method: SPPlatformMethod.addListener,
        payload: payload,
        operation: { method, payload in _ = await self.operation(method: method, payload: payload) }
      )
    }
  }
  
  @objc(removeConsentEventListener:)
  public func removeConsentEventListener(_ payload: String) {
    Task {
      await SPPlatformExecutor.perform(
        method: SPPlatformMethod.removeListener,
        payload: payload,
        operation: { method, payload in _ = await self.operation(method: method, payload: payload) }
      )
    }
  }
  
  @objc(clearSession:reject:)
  public func clearSession(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      await self.eventHandler?.deInit()
      self.eventHandler = nil
      await SPPlatformExecutor.dispatch(
        method: SPPlatformMethod.clearSession,
        payload: nil,
        result: self.platformResult(resolve: resolve, reject: reject),
        operation: self.operation(method:payload:)
      )
    }
  }
  
  private func operation(method: SPPlatformMethod, payload: [String: Any]?) async -> [String: Any?] {
    switch method {
    case .getBuildVersion:
      return SPPlatformDataMessage(data: SPPlatformConfig.buildVersion).toJson()
    case .logConfig:
      return await SPPlatformHandler.setLogsConfig(payload).toJson()
    case .initialise:
      return await SPPlatformHandler.initialiseSDK(payload, eventHandler: getOrCreateEventHandler()).toJson()
    case .getLocale:
      return await SPPlatformHandler.getLocale(args: payload).toJson()
    case .getConsentStatus:
      return await SPPlatformHandler.getConsentStatus(args: payload).toJson()
    case .getLastConsentedAt:
      return await SPPlatformHandler.getLastConsentedAt(args: payload).toJson()
    case .getConsentRecollectionReason:
      return await SPPlatformHandler.getConsentRecollectionReason(args: payload).toJson()
    case .showConsentBanner:
      return await SPPlatformHandler.showConsentBanner(args: payload).toJson()
    case .showSecondaryConsentBanner:
      return await SPPlatformHandler.showSecondaryConsentBanner(args: payload).toJson()
    case .showPreferenceCenter:
      return await SPPlatformHandler.showPreferenceCenter(args: payload).toJson()
    case .getClientId:
      return await SPPlatformHandler.getClientId(args: payload).toJson()
    case .getPackage:
      return await SPPlatformHandler.getPackage(args: payload).toJson()
    case .getCollectedConsentInfo:
      return await SPPlatformHandler.getCollectedConsentInfo(args: payload).toJson()
    case .addListener:
      return await SPPlatformHandler.addDelegate(args: payload).toJson()
    case .removeListener:
      return await SPPlatformHandler.removeDelegate(args: payload).toJson()
    case .clearSession:
      return await SPPlatformHandler.clearSession(args: payload).toJson()
    }
  }
  
}
