import Purchases, { CustomerInfo, PurchasesOfferings, PurchasesPackage } from 'react-native-purchases';
import { Platform } from 'react-native';
import {
  ENTITLEMENT_PRO,
  REVENUECAT_API_KEY_ANDROID,
  REVENUECAT_API_KEY_IOS,
  MONTHLY_PRODUCT_ID,
  YEARLY_PRODUCT_ID,
} from '../config/subscriptions';

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

async function findPackageByProductId(offerings: PurchasesOfferings, productId: string): Promise<PurchasesPackage | null> {
  const allPackages = Object.values(offerings.all).flatMap((offering) => offering.availablePackages);
  return allPackages.find((pkg) => pkg.storeProduct.identifier === productId) ?? null;
}

async function hasActiveEntitlement(customerInfo: CustomerInfo): Promise<boolean> {
  return customerInfo.entitlements.active[ENTITLEMENT_PRO] != null;
}

export async function purchaseMonthly(): Promise<boolean> {
  const offerings = await Purchases.getOfferings();
  const selected = await findPackageByProductId(offerings, MONTHLY_PRODUCT_ID);
  if (!selected) {
    throw new Error('Monthly package not found. Check MONTHLY_PRODUCT_ID and RevenueCat offerings.');
  }
  const { customerInfo } = await Purchases.purchasePackage(selected);
  return hasActiveEntitlement(customerInfo);
}

export async function purchaseYearly(): Promise<boolean> {
  const offerings = await Purchases.getOfferings();
  const selected = await findPackageByProductId(offerings, YEARLY_PRODUCT_ID);
  if (!selected) {
    throw new Error('Yearly package not found. Check YEARLY_PRODUCT_ID and RevenueCat offerings.');
  }
  const { customerInfo } = await Purchases.purchasePackage(selected);
  return hasActiveEntitlement(customerInfo);
}

export async function restorePurchasesAndCheck(): Promise<boolean> {
  const customerInfo = await Purchases.restorePurchases();
  return hasActiveEntitlement(customerInfo);
}

