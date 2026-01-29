import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigation from './src/navigation';
import ErrorBoundary from './src/components/ErrorBoundary';
import { SubscriptionProvider } from './src/state/SubscriptionContext';
import { StreakProvider } from './src/state/StreakContext';

export default function App() {
  return (
    <ErrorBoundary>
      <SubscriptionProvider>
        <StreakProvider>
          <StatusBar style="light" />
          <AppNavigation />
        </StreakProvider>
      </SubscriptionProvider>
    </ErrorBoundary>
  );
}
