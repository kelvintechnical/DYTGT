import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import PrimaryButton from '../components/PrimaryButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  const handleRestore = async () => {
    // TODO: RevenueCat restore purchases
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
        <PrimaryButton label="Restore purchases" onPress={handleRestore} />
        <View style={styles.spacer} />
        <PrimaryButton label="Log out" onPress={handleLogout} />
        <View style={styles.spacer} />
        <PrimaryButton label="Delete account" onPress={handleDeleteAccount} />
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>No ads. No feeds. Just Scripture, reflection, and gratitude.</Text>
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
    color: '#e5e7eb',
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
    color: '#6b7280',
    textAlign: 'center',
  },
});


