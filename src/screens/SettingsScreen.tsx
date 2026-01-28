import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import PrimaryButton from '../components/PrimaryButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { restorePurchasesAndCheck } from '../state/RevenueCatClient';
import { useSubscription } from '../state/SubscriptionContext';
import { Colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  const { refreshSubscription } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRestore = async () => {
    try {
      setIsProcessing(true);
      const active = await restorePurchasesAndCheck();
      await refreshSubscription();
      if (active) {
        Alert.alert('Restored', 'Your subscription has been restored.');
      } else {
        Alert.alert('No active subscription found', 'We could not find an active subscription to restore.');
      }
    } catch (error) {
      Alert.alert('Restore failed', 'Something went wrong while restoring purchases. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogout = async () => {
    // TODO: Firebase sign-out and clear local state
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
  };

  const handleDeleteAccount = async () => {
    // TODO: Account deletion flow (Firebase + backend if added later)
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      <View style={styles.body}>
        <PrimaryButton label="Restore purchases" onPress={handleRestore} disabled={isProcessing} />
        <View style={styles.spacer} />
        <PrimaryButton label="Log out" onPress={handleLogout} />
        <View style={styles.spacer} />
        <PrimaryButton label="Delete account" onPress={handleDeleteAccount} />
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>No ads. No feeds. Just Scripture, reflection, and gratitude.</Text>
        {isProcessing && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={Colors.primary} />
            <Text style={styles.loadingText}>Checking your subscription…</Text>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  spacer: {
    height: 16,
  },
  footer: {
    paddingBottom: 24,
  },
  footerText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  loadingRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
