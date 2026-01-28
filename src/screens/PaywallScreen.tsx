import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import PrimaryButton from '../components/PrimaryButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Paywall'>;

export default function PaywallScreen({ navigation }: Props) {
  const handleStartTrialMonthly = async () => {
    // TODO: Integrate RevenueCat purchase for monthly package with 7-day trial
    navigation.replace('Home');
  };

  const handleStartTrialYearly = async () => {
    // TODO: Integrate RevenueCat purchase for yearly package with 7-day trial
    navigation.replace('Home');
  };

  const handleRestore = async () => {
    // TODO: RevenueCat restore purchases
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Stay anchored in gratitude</Text>
        <Text style={styles.subtitle}>
          7-day free trial. One daily verse, reflection, and thank-you moment to God.
        </Text>
      </View>
      <View style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.planLabel}>Monthly</Text>
          <Text style={styles.price}>$4.99 / month</Text>
          <Text style={styles.trial}>7 days free, cancel anytime.</Text>
          <PrimaryButton label="Start 7-day trial (Monthly)" onPress={handleStartTrialMonthly} />
        </View>
        <View style={styles.card}>
          <Text style={styles.planLabel}>Yearly</Text>
          <Text style={styles.price}>$9.99 / year</Text>
          <Text style={styles.trial}>Best value. 7 days free, cancel anytime.</Text>
          <PrimaryButton label="Start 7-day trial (Yearly)" onPress={handleStartTrialYearly} />
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Payment is handled securely through the App Store or Google Play.</Text>
        <Text style={styles.footerLink} onPress={handleRestore}>
          Restore purchases
        </Text>
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
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#9ca3af',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    gap: 24,
  },
  card: {
    backgroundColor: '#020617',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#111827',
    gap: 12,
  },
  planLabel: {
    fontSize: 14,
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e5e7eb',
  },
  trial: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 8,
  },
  footer: {
    paddingBottom: 24,
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
  },
  footerLink: {
    fontSize: 13,
    color: '#fbbf24',
  },
});


