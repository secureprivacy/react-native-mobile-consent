import Foundation
@_spi(SPCrossPlatform) import SPMobileConsent
import React

class SPPlatformResultImpl : SPPlatformResult {

  private let resolve: RCTPromiseResolveBlock
  private let reject: RCTPromiseRejectBlock

  init(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    self.resolve = resolve
    self.reject = reject
  }

  func success(_ result: Any) {
    resolve(result)
  }

  func error(errorCode: String, errorMessage: String, errorDetails: Any?) {
    reject(errorCode, errorMessage, errorDetails as? NSError)
  }

  func notImplemented() {
    reject(
      SPPlatformError.invalidPlatformMethod.rawValue,
      SPPlatformStrings.invalidArgs(
        errorCode: SPPlatformError.invalidPlatformMethod
      ),
      nil,
    )
  }
}
