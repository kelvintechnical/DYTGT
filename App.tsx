import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigation from './src/navigation';
import { SubscriptionProvider } from './src/state/SubscriptionContext';
import { StreakProvider } from './src/state/StreakContext';

export default function App() {
  return (
    <SubscriptionProvider>
      <StreakProvider>
        <StatusBar style="light" />
        <AppNavigation />
      </StreakProvider>
    </SubscriptionProvider>
  );
}
