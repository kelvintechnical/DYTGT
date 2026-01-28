import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';
import { ENTITLEMENT_PRO, REVENUECAT_API_KEY_ANDROID, REVENUECAT_API_KEY_IOS } from '../config/subscriptions';

export async function configureRevenueCat() {
  const apiKey = Platform.select({
    ios: REVENUECAT_API_KEY_IOS,
    android: REVENUECAT_API_KEY_ANDROID,
    default: REVENUECAT_API_KEY_ANDROID,
  });

  if (!apiKey || apiKey.startsWith('REPLACE_')) {
    return;
  }

  await Purchases.configure({ apiKey });
}

export async function checkEntitlements(): Promise<boolean> {
  const customerInfo = await Purchases.getCustomerInfo();
  return customerInfo.entitlements.active[ENTITLEMENT_PRO] != null;
}


