import { useEffect, useMemo, useRef, useState } from 'react';
import {
  SecurePrivacyMobileConsent,
  SPConsentStatus,
  SPLogger,
} from '@secureprivacy/react-native-mobile-consent';
import type { SPAuthKey, Subscription } from '@secureprivacy/react-native-mobile-consent';
import { SPConsentRecollectionReason } from '../../../../src/enums/SPConsentRecollectionReason';
import { AppConfig } from '../../AppConfig';

const TAG = 'MainScreen';

const PRIMARY_EVENT = 101;
const SECONDARY_EVENT = 102;

export const UseMainScreen = () => {
  const [initialised, setInitialised] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState('');
  const [primaryAppClientIdAndLocale, setPrimaryAppClientIdAndLocale] = useState<string>('');
  const [secondaryAppClientIdAndLocale, setSecondaryAppClientIdAndLocale] = useState<string>('');
  const [consentStatus, setConsentStatus] = useState<SPConsentStatus>(SPConsentStatus.PENDING);
  const [lastConsentedAt, setLastConsentedAt] = useState<bigint | null>(null);
  const [consentRecollectionReason, setConsentRecollectionReason] = useState<SPConsentRecollectionReason | null>(null);
  const [packageId, setPackageId] = useState<string>('');
  const [packageLabel, setPackageLabel] = useState<string>('');

  const primarySubscription = useRef<Subscription | null>(null);
  const secondarySubscription = useRef<Subscription | null>(null);


  /**
   * Cleanup subscriptions when component unmounts.
   */
  useEffect(() => {
    return () => {
      primarySubscription.current?.unsubscribe();
      secondarySubscription.current?.unsubscribe();

      primarySubscription.current = null;
      secondarySubscription.current = null;
    };
  }, []);

  useEffect(() => setPackageLabel(''), [packageId, selectedAppId]);

  useEffect(() => {
    if (initialised) {
      void fetchClientIdsAndLocale();
    }
  }, [initialised]);
  useEffect(() => {
    if (initialised && selectedAppId) {
      fetchConsentStatus(selectedAppId);
      fetchLastConsentedAtAndRecollectionReason(selectedAppId);
    }
  }, [selectedAppId]);

  const getSDKVersion = () => SecurePrivacyMobileConsent.getSDKVersion();

  const onInitialiseTap = async () => {
    const androidKey: SPAuthKey = {
      applicationId: AppConfig.primaryAppId,
      secondaryApplicationId: AppConfig.secondaryAppId,
    };
    const iosKey: SPAuthKey = {
      applicationId: AppConfig.primaryAppId,
      secondaryApplicationId: AppConfig.secondaryAppId,
    };
    await SecurePrivacyMobileConsent.initialiseSDK(androidKey, iosKey).then((result) => {
      SPLogger.i(TAG, `Initialisation result => ${JSON.stringify(result)}`);
      if (result.code === 200) {
        setInitialised(true);
        setSelectedAppId(AppConfig.primaryAppId);
        primarySubscription.current = SecurePrivacyMobileConsent.onConsentEvent(AppConfig.primaryAppId, PRIMARY_EVENT, (event) => {
          SPLogger.i(TAG, `Consent event received for primary app => ${JSON.stringify(event)}`);
          const appId = event.data?.applicationId;
          if (appId === AppConfig.primaryAppId) {
            fetchConsentStatus(appId);
            fetchLastConsentedAtAndRecollectionReason(appId);
          }
        });
        secondarySubscription.current = SecurePrivacyMobileConsent.onConsentEvent(AppConfig.secondaryAppId, SECONDARY_EVENT, (event) => {
          SPLogger.i(TAG, `Consent event received for secondary app => ${JSON.stringify(event)}`);
          const appId = event.data?.applicationId;
          if (appId === AppConfig.secondaryAppId) {
            fetchConsentStatus(appId);
            fetchLastConsentedAtAndRecollectionReason(appId);
          }
        });
      } else {
        setInitialised(false);
      }
    }).catch((error) => {
      SPLogger.e(TAG, `Unable to initialise engine`, error);
      setInitialised(false);
    });
  };

  const fetchClientIdsAndLocale = () => {

    /**
     * Fetch clientId and locale for a given appId.
     */
    const fetchForApp = (appId: string): Promise<string> => {
      return Promise.all([
        SecurePrivacyMobileConsent.getClientId(appId),
        SecurePrivacyMobileConsent.getLocale(appId),
      ])
        .then(([clientResult, localeResult]) => {

          const locale = typeof localeResult?.data === 'string' ? localeResult.data : '';
          const clientId = typeof clientResult?.data === 'string' ? clientResult.data : '';

          return `${locale} ${clientId}`.trim();
        })
        .catch((error) => {
          SPLogger.e(TAG, `Get client id and locale error for ${appId}`, error);
          return '';
        });
    };

    return Promise.all([
      fetchForApp(AppConfig.primaryAppId),
      fetchForApp(AppConfig.secondaryAppId),
    ]).then(([primary, secondary]) => {
      setPrimaryAppClientIdAndLocale(primary);
      setSecondaryAppClientIdAndLocale(secondary);
    }).catch((error) => {
      setPrimaryAppClientIdAndLocale('');
      setSecondaryAppClientIdAndLocale('');
      SPLogger.e(TAG, `Error fetching client ids and locales`, error);
    });
  };

  const fetchConsentStatus = (appId: string) => {
    SecurePrivacyMobileConsent.getConsentStatus(appId).then(result => {
      if (typeof result?.data === 'string') {
        setConsentStatus(result.data);
      } else {
        setConsentStatus(SPConsentStatus.PENDING);
      }
    }).catch(error => {
      SPLogger.e(TAG, `Get consent status error`, error);
    });
  };

  const fetchLastConsentedAtAndRecollectionReason = (appId: string) => {
    SecurePrivacyMobileConsent.getLastConsentedAt(appId).then(result => {
      if (result?.data) {
        setLastConsentedAt(result.data);
      } else {
        setLastConsentedAt(null);
      }
    }).catch(error => {
      SPLogger.e(TAG, `Get last consented at error`, error);
    });
    SecurePrivacyMobileConsent.getConsentRecollectionReason(appId).then(result => {
      if (result?.data) {
        setConsentRecollectionReason(result.data);
      } else {
        setConsentRecollectionReason(null);
      }
    }).catch(error => {
      SPLogger.e(TAG, `Get recollection reason error`, error);
    });
  };

  const checkPackage = async () => {
    if (!packageId.trim()) {
      return;
    }
    const result = await SecurePrivacyMobileConsent.getPackage(selectedAppId, packageId);
    if (result.code === 200) {
      if (result.data) {
        setPackageLabel(`Package status: ${result.data?.enabled === true ? 'Enabled' : 'Disabled'}`);
      } else if (result?.msg && result?.msg.length > 0) {
        setPackageLabel(result.msg);
      } else {
        setPackageLabel('Package not found!');
      }
    } else {
      setPackageLabel(result?.msg ?? '');
    }
  };

  const onConsentStatusTap = () => {
    if (selectedAppId) {
      fetchConsentStatus(selectedAppId);
    }
  };

  const onConsentedAtAndRecollectionReasonTap = () => {
    if (selectedAppId) {
      fetchLastConsentedAtAndRecollectionReason(selectedAppId);
    }
  };

  const consentedAtAndRecollectionReason = useMemo(() => {
    const consentedAt = lastConsentedAt ? `Last Consented At: ${new Date(Number(lastConsentedAt)).toLocaleString()}` : '';
    const reason = consentRecollectionReason ? `Recollection required: ${consentRecollectionReason}` : '';
    return `${consentedAt}\n${reason}`;
  }, [lastConsentedAt, consentRecollectionReason]);

  const onConsentBannerTap = () => {
    const promise = selectedAppId === AppConfig.primaryAppId
      ? SecurePrivacyMobileConsent.showConsentBanner()
      : SecurePrivacyMobileConsent.showSecondaryBanner();
    promise.then(result => {
      SPLogger.i(TAG, `Show banner result => ${JSON.stringify(result)}`);
    }).catch((error) => {
      SPLogger.e(TAG, `Show banner error`, error);
    });
  };
  const onPreferenceCenterTap = () => {
    SecurePrivacyMobileConsent.showPreferenceCenter(selectedAppId).then(result => {
      SPLogger.i(TAG, `Show preference center result => ${JSON.stringify(result)}`);
    }).catch((error) => {
      SPLogger.e(TAG, `Show preference center error`, error);
    });
  };

  const onPackageIdChange = setPackageId;

  const onCheckPackageTap = checkPackage;

  const onClearSessionTap = () => {
    SecurePrivacyMobileConsent.clearSession().then((result) => {
      SPLogger.i(TAG, `Clear session result => ${JSON.stringify(result)}`);
      primarySubscription.current?.unsubscribe();
      secondarySubscription.current?.unsubscribe();
      primarySubscription.current = null;
      secondarySubscription.current = null;

      setConsentStatus(SPConsentStatus.PENDING);
      setPrimaryAppClientIdAndLocale('');
      setSecondaryAppClientIdAndLocale('');
      setConsentRecollectionReason(null);
      setLastConsentedAt(null);
      setInitialised(false);
      setPackageLabel('');
      setPackageId('');
    })
      .catch(error => {
        SPLogger.e(TAG, `Clear session error => ${error}`);
      });

  };

  return {
    getSDKVersion,
    initialised,
    onInitialiseTap,
    selectedAppId,
    setSelectedAppId,
    primaryAppClientIdAndLocale,
    secondaryAppClientIdAndLocale,
    consentStatus,
    onConsentStatusTap,
    consentedAtAndRecollectionReason,
    onConsentedAtAndRecollectionReasonTap,
    onConsentBannerTap,
    onPreferenceCenterTap,
    packageId,
    onPackageIdChange,
    packageLabel,
    onCheckPackageTap,
    onClearSessionTap,
  };
};

