// Placeholder configuration for RevenueCat offerings and entitlements.
// Values are loaded from .env via react-native-dotenv (see .env.example).

import {
  REVENUECAT_API_KEY_IOS,
  REVENUECAT_API_KEY_ANDROID,
  ENTITLEMENT_PRO,
  MONTHLY_PRODUCT_ID,
  YEARLY_PRODUCT_ID,
} from '@env';

export const RevenueCatConfig = {
  ios: REVENUECAT_API_KEY_IOS ?? 'REPLACE_WITH_REVENUECAT_IOS_API_KEY',
  android: REVENUECAT_API_KEY_ANDROID ?? 'REPLACE_WITH_REVENUECAT_ANDROID_API_KEY',
  entitlement: ENTITLEMENT_PRO ?? 'pro',
  products: {
    monthly: MONTHLY_PRODUCT_ID ?? 'dytgt_monthly',
    yearly: YEARLY_PRODUCT_ID ?? 'dytgt_yearly',
  },
};
