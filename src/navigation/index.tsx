import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { View, Image, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/OnboardingScreen';
import AuthScreen from '../screens/AuthScreen';
import PaywallScreen from '../screens/PaywallScreen';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import StreakScreen from '../screens/StreakScreen';
import { useSubscription } from '../state/SubscriptionContext';
import { Colors } from '../theme/colors';

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
    background: Colors.background,
    card: Colors.surface,
    text: Colors.textPrimary,
    primary: Colors.primary,
  },
};

function RootNavigator() {
  const { isLoading, isOnboarded, isSubscribedOrOnTrial } = useSubscription();

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <Image source={require('../../assets/icon.png')} style={styles.logo} />
        <Text style={styles.splashTitle}>DYTGT</Text>
        <Text style={styles.splashSubtitle}>Did You Thank God Today?</Text>
      </View>
    );
  }

  const initialRouteName = isOnboarded ? (isSubscribedOrOnTrial ? 'Home' : 'Paywall') : 'Onboarding';

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
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

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  splashTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 2,
  },
  splashSubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.textSecondary,
  },
});

