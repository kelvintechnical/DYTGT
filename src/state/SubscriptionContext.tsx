import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../services/logger';
import { configureRevenueCat, checkEntitlements } from './RevenueCatClient';

type SubscriptionContextValue = {
  isLoading: boolean;
  isOnboarded: boolean;
  isSubscribedOrOnTrial: boolean;
  markOnboarded: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
  error?: Error | null;
};

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(undefined);

const ONBOARDED_KEY = 'dytgt:onboarded';

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isSubscribedOrOnTrial, setIsSubscribedOrOnTrial] = useState(false);

  const refreshSubscription = async () => {
    try {
      const active = await checkEntitlements();
      setIsSubscribedOrOnTrial(active);
      logger.info('Entitlements checked', { active });
    } catch (err) {
      setIsSubscribedOrOnTrial(false);
      logger.warn('refreshSubscription failed', { error: err });
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const onboardedValue = await AsyncStorage.getItem(ONBOARDED_KEY);
        setIsOnboarded(onboardedValue === 'true');

        logger.info('Configuring RevenueCat');
        await configureRevenueCat();
        await refreshSubscription();
      } catch (err) {
        logger.error('Subscription bootstrap failed', err instanceof Error ? err : undefined, {
          message: err instanceof Error ? err.message : String(err),
        });
      } finally {
        setIsLoading(false);
      }
    };

    void bootstrap();
  }, []);

  const markOnboarded = async () => {
    setIsOnboarded(true);
    await AsyncStorage.setItem(ONBOARDED_KEY, 'true');
    logger.info('User marked onboarded');
  };

  return (
    <SubscriptionContext.Provider
      value={{
        isLoading,
        isOnboarded,
        isSubscribedOrOnTrial,
        markOnboarded,
        refreshSubscription,
        error: undefined,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return ctx;
}

