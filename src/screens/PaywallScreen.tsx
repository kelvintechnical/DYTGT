import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import PrimaryButton from '../components/PrimaryButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useSubscription } from '../state/SubscriptionContext';
import { purchaseMonthly, purchaseYearly, restorePurchasesAndCheck } from '../state/RevenueCatClient';
import { Colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Paywall'>;

export default function PaywallScreen({ navigation }: Props) {
  const { isSubscribedOrOnTrial, refreshSubscription } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isSubscribedOrOnTrial) {
      navigation.replace('Home');
    }
  }, [isSubscribedOrOnTrial, navigation]);

  const handleStartTrialMonthly = async () => {
    try {
      setIsProcessing(true);
      const result = await purchaseMonthly();
      await refreshSubscription();
      if (result.success) {
        navigation.replace('Home');
      } else if (!result.cancelled) {
        Alert.alert('Subscription not active', 'We could not activate your monthly subscription yet.');
      }
    } catch (error) {
      Alert.alert('Purchase failed', 'Something went wrong starting your monthly trial. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartTrialYearly = async () => {
    try {
      setIsProcessing(true);
      const result = await purchaseYearly();
      await refreshSubscription();
      if (result.success) {
        navigation.replace('Home');
      } else if (!result.cancelled) {
        Alert.alert('Subscription not active', 'We could not activate your yearly subscription yet.');
      }
    } catch (error) {
      Alert.alert('Purchase failed', 'Something went wrong starting your yearly trial. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestore = async () => {
    try {
      setIsProcessing(true);
      const active = await restorePurchasesAndCheck();
      await refreshSubscription();
      if (active) {
        navigation.replace('Home');
      } else {
        Alert.alert('No active subscription found', 'We could not find an active subscription to restore.');
      }
    } catch (error) {
      Alert.alert('Restore failed', 'Something went wrong while restoring purchases. Please try again.');
    } finally {
      setIsProcessing(false);
    }
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
          <PrimaryButton label="Start 7-day trial (Monthly)" onPress={handleStartTrialMonthly} disabled={isProcessing} />
        </View>
        <View style={styles.card}>
          <Text style={styles.planLabel}>Yearly</Text>
          <Text style={styles.price}>$9.99 / year</Text>
          <Text style={styles.trial}>Best value. 7 days free, cancel anytime.</Text>
          <PrimaryButton label="Start 7-day trial (Yearly)" onPress={handleStartTrialYearly} disabled={isProcessing} />
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Payment is handled securely through the App Store or Google Play.</Text>
        <Text style={styles.footerLink} onPress={handleRestore}>
          Restore purchases
        </Text>
        {isProcessing && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={Colors.primary} />
            <Text style={styles.loadingText}>Contacting App Store…</Text>
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
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    gap: 24,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.accent,
    gap: 12,
  },
  planLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  trial: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  footer: {
    paddingBottom: 24,
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  footerLink: {
    fontSize: 13,
    color: Colors.primary,
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
