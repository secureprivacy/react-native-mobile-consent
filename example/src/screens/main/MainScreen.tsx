import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { AppConfig } from '../../AppConfig';
import SPButton from '../../components/SPButton';
import SPTextField from '../../components/SPTextField';
import { SPRadioItem } from '../../components/SPRadioItem';
import { UseMainScreen } from './UseMainScreen';

const MainScreen = () => {
  const controller = UseMainScreen();

  if (!controller.initialised) {
    return (
      <View style={{ padding: 24, backgroundColor: 'white', flex: 1, justifyContent: 'center', alignItems: 'stretch' }}>
        <Text style={{ marginVertical: 8 }}>
          SDK Version: {controller.getSDKVersion()}
        </Text>
        <SPButton label='Initialise SDK' onPress={controller.onInitialiseTap} />
      </View>
    );
  }

  return (
    <ScrollView style={{ padding: 16, backgroundColor: 'white' }}
                contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'stretch' }}>
      <Text style={{ fontSize: 22, marginBottom: 12 }}>
        SDK Status: Initialised
      </Text>

      <Text>Application Type</Text>

      <SPRadioItem<string>
        value={AppConfig.primaryAppId}
        selected={controller.selectedAppId}
        title='Primary '
        subtitle={controller.primaryAppClientIdAndLocale}
        onSelect={controller.setSelectedAppId}
      />

      <SPRadioItem<string>
        value={AppConfig.secondaryAppId}
        selected={controller.selectedAppId}
        title='Secondary'
        subtitle={controller.secondaryAppClientIdAndLocale}
        onSelect={controller.setSelectedAppId}
      />

      <TouchableOpacity onPress={controller.onConsentStatusTap}>
        <Text style={{ marginTop: 8 }}>
          Consent Status: {controller.consentStatus}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={controller.onConsentedAtAndRecollectionReasonTap}>
        <Text style={{ marginTop: 4, marginBottom: 8, fontSize: 12 }}>
          {controller.consentedAtAndRecollectionReason}
        </Text>
      </TouchableOpacity>

      <SPButton
        label='Consent Banner'
        onPress={controller.onConsentBannerTap}
      />

      <SPButton
        label='Preference Center'
        onPress={controller.onPreferenceCenterTap}
      />

      <SPTextField
        label={controller.packageLabel || 'Enter package name'}
        placeholder='com.google.ads.mediation:facebook'
        onChange={controller.onPackageIdChange}
      />

      <SPButton label='Check package status' onPress={controller.onCheckPackageTap} />

      <SPButton
        label='Clear session'
        onPress={controller.onClearSessionTap}
      />
    </ScrollView>
  );
};

export default MainScreen;
