import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import PrimaryButton from '../components/PrimaryButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useSubscription } from '../state/SubscriptionContext';
import { Colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export default function OnboardingScreen({ navigation }: Props) {
  const { markOnboarded } = useSubscription();

  const handleContinue = async () => {
    await markOnboarded();
    navigation.replace('Auth');
  };

  return (
    <ScreenContainer>
      <View style={styles.top}>
        <Image source={require('../../assets/icon.png')} style={styles.logo} />
        <Text style={styles.title}>DYTGT</Text>
        <Text style={styles.subtitle}>Did You Thank God Today?</Text>
      </View>
      <View style={styles.middle}>
        <Text style={styles.body}>
          One quiet verse. One short reflection. One simple moment of gratitude to God each day.
        </Text>
      </View>
      <View style={styles.bottom}>
        <PrimaryButton label="Begin" onPress={handleContinue} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  top: {
    alignItems: 'center',
    marginTop: 32,
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 2,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  middle: {
    flex: 1,
    justifyContent: 'center',
  },
  body: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    textAlign: 'center',
  },
  bottom: {
    paddingBottom: 24,
  },
});


