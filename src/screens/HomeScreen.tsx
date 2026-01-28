import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import PrimaryButton from '../components/PrimaryButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { getVerseForToday } from '../data/dailyVerses';
import { useStreak } from '../state/StreakContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const verse = getVerseForToday();
  const { hasThankedToday, markThankedToday, currentStreak } = useStreak();

  const handleThanked = async () => {
    if (!hasThankedToday) {
      await markThankedToday();
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.appTitle}>DYTGT</Text>
        <Text style={styles.streak} onPress={() => navigation.navigate('Streak')}>
          {currentStreak} day streak
        </Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.reference}>{verse.reference}</Text>
        <Text style={styles.text}>{verse.text}</Text>
        <Text style={styles.reflection}>{verse.reflection}</Text>
      </View>
      <View style={styles.footer}>
        <PrimaryButton
          label={hasThankedToday ? 'You thanked God today' : 'I Thanked God Today'}
          onPress={handleThanked}
          disabled={hasThankedToday}
        />
        <Text style={styles.footerText}>
          One thank-you a day is enough. When you’re ready, come back tomorrow.
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e5e7eb',
  },
  streak: {
    fontSize: 14,
    color: '#fbbf24',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  reference: {
    fontSize: 14,
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  text: {
    fontSize: 20,
    color: '#e5e7eb',
    lineHeight: 28,
  },
  reflection: {
    fontSize: 15,
    color: '#9ca3af',
  },
  footer: {
    paddingBottom: 24,
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});


