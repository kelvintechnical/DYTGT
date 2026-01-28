import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureRevenueCat, checkEntitlements } from './RevenueCatClient';

type SubscriptionContextValue = {
  isLoading: boolean;
  isOnboarded: boolean;
  isSubscribedOrOnTrial: boolean;
  markOnboarded: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
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
    } catch {
      setIsSubscribedOrOnTrial(false);
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const onboardedValue = await AsyncStorage.getItem(ONBOARDED_KEY);
        setIsOnboarded(onboardedValue === 'true');

        await configureRevenueCat();
        await refreshSubscription();
      } finally {
        setIsLoading(false);
      }
    };

    void bootstrap();
  }, []);

  const markOnboarded = async () => {
    setIsOnboarded(true);
    await AsyncStorage.setItem(ONBOARDED_KEY, 'true');
  };

  return (
    <SubscriptionContext.Provider
      value={{
        isLoading,
        isOnboarded,
        isSubscribedOrOnTrial,
        markOnboarded,
        refreshSubscription,
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

