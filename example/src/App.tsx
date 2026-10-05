import React from 'react';
import MainScreen from './screens/main/MainScreen';
import { SecurePrivacyMobileConsent, SPLogType } from '@secureprivacy/react-native-mobile-consent';

const App = () => {
  SecurePrivacyMobileConsent.setLogConfig([
    { type: SPLogType.INFO, enabled: false },
    { type: SPLogType.WARNING, enabled: false },
    { type: SPLogType.ERROR, enabled: false },
    { type: SPLogType.DEBUG, enabled: false },
  ]).then(r => console.log('Log config set result => ', r));

  return (<MainScreen />);
};

export default App;
