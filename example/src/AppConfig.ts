import { Platform } from 'react-native';

export const AppConfig = {
  primaryAppId:
    Platform.OS === 'android'
      ? 'ANDROID_PRIMARY_APP_ID'
      : Platform.OS === 'ios'
        ? 'IOS_PRIMARY_APP_ID'
        : '',

  secondaryAppId:
    Platform.OS === 'android'
      ? 'ANDROID_SECONDARY_APP_ID'
      : Platform.OS === 'ios'
        ? 'IOS_SECONDARY_APP_ID'
        : '',
};
