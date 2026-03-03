# @secureprivacy/react-native-mobile-consent

The **Secure Privacy React Native SDK** provides a unified way to collect, manage, and signal user consent for the **Android** platform.

It exposes a simple JavaScript API for consent handling, making your app compliant with GDPR, CCPA, and other privacy regulations.

------------------------------------------------------------------------

## Installation

``` sh
npm install @secureprivacy/react-native-mobile-consent
```

For iOS, install pods:

``` sh
cd ios && pod install
```

------------------------------------------------------------------------

## Quick Start

``` ts
import { SecurePrivacyMobileConsent } from '@secureprivacy/react-native-mobile-consent';

await SecurePrivacyMobileConsent.initialiseSDK(
  {
    applicationId: 'ANDROID_APP_ID',
    authKey: 'ANDROID_AUTH_KEY',
  },
  {
    applicationId: 'IOS_APP_ID',
    authKey: 'IOS_AUTH_KEY',
  }
);
```

------------------------------------------------------------------------

## Full Documentation

Complete setup instructions, configuration guides, event handling, and advanced usage are available here:

👉 https://docs.secureprivacy.ai/guides/mobile/react-native-sdk/01-setup-and-initialisation/

------------------------------------------------------------------------

## Platform Support

- ✅ Android
- 🚧 iOS (Coming soon)

------------------------------------------------------------------------

## License

© Secure Privacy. All rights reserved.
