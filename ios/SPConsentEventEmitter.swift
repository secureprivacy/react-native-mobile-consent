import Foundation
import React

@objc public protocol SPConsentEventEmitter: AnyObject {
  func emitOnSPEvent(msg: String)
}
