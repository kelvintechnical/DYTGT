import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import AnimatedPrimaryButton from '../components/AnimatedPrimaryButton';
import StreakCircle from '../components/StreakCircle';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { getVerseForToday } from '../data/dailyVerses';
import { useStreak } from '../state/StreakContext';
import { useSubscription } from '../state/SubscriptionContext';
import { Colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const verse = getVerseForToday();
  const { hasThankedToday, markThankedToday, currentStreak } = useStreak();
  const { isSubscribedOrOnTrial } = useSubscription();

  useEffect(() => {
    if (!isSubscribedOrOnTrial) {
      navigation.replace('Paywall');
    }
  }, [isSubscribedOrOnTrial, navigation]);

  const handleThanked = async () => {
    if (!hasThankedToday && isSubscribedOrOnTrial) {
      await markThankedToday();
    }
  };

  const buttonLabel = !isSubscribedOrOnTrial
    ? 'Subscription required'
    : hasThankedToday
    ? 'You thanked God today'
    : 'I Thanked God Today';

  const buttonDisabled = hasThankedToday || !isSubscribedOrOnTrial;
  const buttonA11yLabel = !isSubscribedOrOnTrial
    ? 'Subscription required. Tap to view subscription options.'
    : hasThankedToday
    ? 'You thanked God today. Button is disabled until tomorrow.'
    : 'I Thanked God Today. Double tap to mark today as complete.';

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
        {/* Streak progress circle */}
        <View style={styles.streakContainer}>
          <StreakCircle
            currentStreak={currentStreak}
            accessibilityLabel={`${currentStreak} day streak. Progress toward 30-day goal.`}
          />
        </View>
        {/* Daily gratitude button */}
        <AnimatedPrimaryButton
          label={buttonLabel}
          onPress={handleThanked}
          disabled={buttonDisabled}
          accessibilityLabel={buttonA11yLabel}
          accessibilityHint={
            buttonDisabled
              ? undefined
              : 'Marks today as complete and increments your streak counter'
          }
        />
        <Text style={styles.footerText}>
          {isSubscribedOrOnTrial
            ? 'One thank-you a day is enough. When you're ready, come back tomorrow.'
            : 'Start your free trial to thank God once a day with a verse and reflection.'}
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
    color: Colors.textPrimary,
  },
  streak: {
    fontSize: 14,
    color: Colors.success,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  reference: {
    fontSize: 14,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  text: {
    fontSize: 20,
    color: Colors.textPrimary,
    lineHeight: 28,
  },
  reflection: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  footer: {
    paddingBottom: 24,
    gap: 8,
  },
  streakContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  footerText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
