import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import PrimaryButton from '../components/PrimaryButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { Colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

export default function AuthScreen({ navigation }: Props) {
  const handleAnonymous = async () => {
    // TODO: Integrate Firebase anonymous sign-in
    navigation.replace('Paywall');
  };

  const handleApple = async () => {
    // TODO: Integrate Apple Sign-In + Firebase
    navigation.replace('Paywall');
  };

  const handleGoogle = async () => {
    // TODO: Integrate Google Sign-In + Firebase
    navigation.replace('Paywall');
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Sign in</Text>
        <Text style={styles.subtitle}>Your streaks and gratitude moments stay with you.</Text>
      </View>
      <View style={styles.body}>
        <PrimaryButton label="Continue anonymously" onPress={handleAnonymous} />
        <View style={styles.spacer} />
        <PrimaryButton label="Continue with Apple" onPress={handleApple} />
        <View style={styles.spacer} />
        <PrimaryButton label="Continue with Google" onPress={handleGoogle} />
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          You can start with an anonymous account now and connect Apple or Google later.
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
    gap: 16,
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
});


