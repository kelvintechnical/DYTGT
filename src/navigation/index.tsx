import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/OnboardingScreen';
import AuthScreen from '../screens/AuthScreen';
import PaywallScreen from '../screens/PaywallScreen';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import StreakScreen from '../screens/StreakScreen';
import { useSubscription } from '../state/SubscriptionContext';

export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  Paywall: undefined;
  Home: undefined;
  Streak: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#020617',
    card: '#020617',
    text: '#e5e7eb',
    primary: '#fbbf24',
  },
};

function RootNavigator() {
  const { isLoading, isOnboarded, isSubscribedOrOnTrial } = useSubscription();

  if (isLoading) {
    return null;
  }

  const initialRouteName = isOnboarded ? (isSubscribedOrOnTrial ? 'Home' : 'Paywall') : 'Onboarding';

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#020617' },
      }}
    >
      {!isOnboarded && <Stack.Screen name="Onboarding" component={OnboardingScreen} />}
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Paywall" component={PaywallScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Streak" component={StreakScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigation() {
  return (
    <NavigationContainer theme={navTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}


