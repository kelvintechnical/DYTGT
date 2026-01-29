import Purchases, { CustomerInfo, PurchasesOfferings, PurchasesPackage } from 'react-native-purchases';
import { Platform } from 'react-native';
import { RevenueCatConfig } from '../config/subscriptions';
import { ErrorCode, SubscriptionError } from '../utils/errors';

export type PurchaseResult = { success: boolean; cancelled?: boolean };

export async function configureRevenueCat(): Promise<void> {
  const apiKey = Platform.select({
    ios: RevenueCatConfig.ios,
    android: RevenueCatConfig.android,
    default: RevenueCatConfig.android,
  });

  if (!apiKey || apiKey.startsWith('REPLACE_')) {
    return;
  }

  try {
    await Purchases.configure({ apiKey });
  } catch (err) {
    if (__DEV__) {
      console.error('RevenueCat configure failed:', err);
    }
    throw new SubscriptionError(
      'Failed to configure subscription service',
      ErrorCode.SUBSCRIPTION_CONFIG_FAILED,
      true,
      err
    );
  }
}

export async function checkEntitlements(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active[RevenueCatConfig.entitlement] != null;
  } catch (err) {
    if (__DEV__) {
      console.error('checkEntitlements failed:', err);
    }
    return false;
  }
}

async function findPackageByProductId(offerings: PurchasesOfferings, productId: string): Promise<PurchasesPackage | null> {
  const allPackages = Object.values(offerings.all).flatMap((offering) => offering.availablePackages);
  return allPackages.find((pkg) => pkg.storeProduct.identifier === productId) ?? null;
}

async function hasActiveEntitlement(customerInfo: CustomerInfo): Promise<boolean> {
  return customerInfo.entitlements.active[RevenueCatConfig.entitlement] != null;
}

function isPurchaseCancelledError(err: unknown): boolean {
  const e = err as { code?: string; userCancelled?: boolean };
  return e?.code === ErrorCode.PURCHASE_CANCELLED || e?.userCancelled === true;
}

export async function purchaseMonthly(): Promise<PurchaseResult> {
  try {
    const offerings = await Purchases.getOfferings();
    const selected = await findPackageByProductId(offerings, RevenueCatConfig.products.monthly);
    if (!selected) {
      throw new SubscriptionError(
        'Monthly package not found. Check MONTHLY_PRODUCT_ID and RevenueCat offerings.',
        ErrorCode.PURCHASE_FAILED,
        true
      );
    }
    const { customerInfo } = await Purchases.purchasePackage(selected);
    const active = await hasActiveEntitlement(customerInfo);
    return { success: active };
  } catch (err) {
    if (__DEV__) {
      console.error('purchaseMonthly failed:', err);
    }
    if (isPurchaseCancelledError(err)) {
      return { success: false, cancelled: true };
    }
    throw new SubscriptionError(
      'Monthly purchase failed',
      ErrorCode.PURCHASE_FAILED,
      true,
      err
    );
  }
}

export async function purchaseYearly(): Promise<PurchaseResult> {
  try {
    const offerings = await Purchases.getOfferings();
    const selected = await findPackageByProductId(offerings, RevenueCatConfig.products.yearly);
    if (!selected) {
      throw new SubscriptionError(
        'Yearly package not found. Check YEARLY_PRODUCT_ID and RevenueCat offerings.',
        ErrorCode.PURCHASE_FAILED,
        true
      );
    }
    const { customerInfo } = await Purchases.purchasePackage(selected);
    const active = await hasActiveEntitlement(customerInfo);
    return { success: active };
  } catch (err) {
    if (__DEV__) {
      console.error('purchaseYearly failed:', err);
    }
    if (isPurchaseCancelledError(err)) {
      return { success: false, cancelled: true };
    }
    throw new SubscriptionError(
      'Yearly purchase failed',
      ErrorCode.PURCHASE_FAILED,
      true,
      err
    );
  }
}

export async function restorePurchasesAndCheck(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return hasActiveEntitlement(customerInfo);
  } catch (err) {
    if (__DEV__) {
      console.error('restorePurchasesAndCheck failed:', err);
    }
    throw new SubscriptionError(
      'Failed to restore purchases',
      ErrorCode.RESTORE_FAILED,
      true,
      err
    );
  }
}
