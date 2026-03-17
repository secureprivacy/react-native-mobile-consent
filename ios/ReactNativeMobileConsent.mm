#import "ReactNativeMobileConsent.h"
#import "ReactNativeMobileConsent-Swift.h"

@implementation ReactNativeMobileConsent {
  ReactNativeMobileConsentImpl *_impl;
}

#pragma mark - Init

- (instancetype)init {
  if (self = [super init]) {
    _impl = [[ReactNativeMobileConsentImpl alloc] initWithEmitter:self];
  }
  return self;
}

#pragma mark - SPConsentEventEmitterDelegate

- (void)emitOnSPEventWithMsg:(NSString *)message {
  [self emitOnSPEvent:message];
}

#pragma mark - TurboModule

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<
    facebook::react::NativeReactNativeMobileConsentSpecJSI
  >(params);
}

+ (NSString *)moduleName {
  return @"ReactNativeMobileConsent";
}

#pragma mark - Forward To Swift

- (void)setLogConfigs:(NSString *)payload
              resolve:(RCTPromiseResolveBlock)resolve
               reject:(RCTPromiseRejectBlock)reject{
  [_impl setLogConfigs:payload resolve:resolve reject:reject];
}

- (void)getLocale:(NSString *)payload
          resolve:(RCTPromiseResolveBlock)resolve
           reject:(RCTPromiseRejectBlock)reject{
  [_impl getLocale:payload resolve:resolve reject:reject];
}

- (void)initialiseSDK:(nonnull NSString *)payload
              resolve:(nonnull RCTPromiseResolveBlock)resolve
               reject:(nonnull RCTPromiseRejectBlock)reject{
  [_impl initialiseSDK:payload resolve:resolve reject:reject];
}

- (void)getClientId:(NSString *)payload
          resolve:(RCTPromiseResolveBlock)resolve
           reject:(RCTPromiseRejectBlock)reject{
  [_impl getClientId:payload resolve:resolve reject:reject];
}
- (void)showConsentBanner:(nonnull RCTPromiseResolveBlock)resolve
                   reject:(nonnull RCTPromiseRejectBlock)reject {
  [_impl showConsentBanner:resolve reject:reject];
}

- (void)showPreferenceCenter:(nonnull NSString *)payload
                     resolve:(nonnull RCTPromiseResolveBlock)resolve
                      reject:(nonnull RCTPromiseRejectBlock)reject {
  [_impl showPreferenceCenter:payload resolve:resolve reject:reject];
}

- (void)showSecondaryBanner:(nonnull RCTPromiseResolveBlock)resolve
                     reject:(nonnull RCTPromiseRejectBlock)reject {
  [_impl showSecondaryBanner:resolve reject:reject];
}

- (void)getConsentStatus:(nonnull NSString *)payload
                 resolve:(nonnull RCTPromiseResolveBlock)resolve
                  reject:(nonnull RCTPromiseRejectBlock)reject {
  [_impl getConsentStatus:payload resolve:resolve reject:reject];
}

- (void)getLastConsentedAt:(NSString *)payload
          resolve:(RCTPromiseResolveBlock)resolve
           reject:(RCTPromiseRejectBlock)reject{
  [_impl getLastConsentedAt:payload resolve:resolve reject:reject];
}

- (void)getConsentRecollectionReason:(NSString *)payload
          resolve:(RCTPromiseResolveBlock)resolve
           reject:(RCTPromiseRejectBlock)reject{
  [_impl getConsentRecollectionReason:payload resolve:resolve reject:reject];
}

- (void)getPackage:(nonnull NSString *)payload
           resolve:(nonnull RCTPromiseResolveBlock)resolve
            reject:(nonnull RCTPromiseRejectBlock)reject {
  [_impl getPackage:payload resolve:resolve reject:reject];
}

- (void)addConsentEventListener:(nonnull NSString *)payload {
  [_impl addConsentEventListener:payload];
}

- (void)removeConsentEventListener:(nonnull NSString *)payload {
  [_impl removeConsentEventListener:payload];
}

- (void)clearSession:(nonnull RCTPromiseResolveBlock)resolve
              reject:(nonnull RCTPromiseRejectBlock)reject {
  [_impl clearSession:resolve reject:reject];
}

@end
