import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SubscriptionContextValue = {
  isLoading: boolean;
  isOnboarded: boolean;
  isSubscribedOrOnTrial: boolean;
  markOnboarded: () => Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(undefined);

const ONBOARDED_KEY = 'dytgt:onboarded';

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isSubscribedOrOnTrial, setIsSubscribedOrOnTrial] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const onboardedValue = await AsyncStorage.getItem(ONBOARDED_KEY);
        setIsOnboarded(onboardedValue === 'true');

        // TODO: Replace with real RevenueCat entitlement check
        setIsSubscribedOrOnTrial(false);
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


