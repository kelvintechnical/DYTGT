import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import PrimaryButton from '../components/PrimaryButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useStreak } from '../state/StreakContext';
import { Colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Streak'>;

export default function StreakScreen({ navigation }: Props) {
  const { currentStreak, hasThankedToday } = useStreak();

  return (
    <ScreenContainer>
      <View style={styles.body}>
        <Text style={styles.label}>Current streak</Text>
        <Text style={styles.count}>{currentStreak}</Text>
        <Text style={styles.caption}>
          You&apos;re building a quiet, daily habit of thanking God. One day at a time.
        </Text>
        <Text style={styles.status}>{hasThankedToday ? 'You thanked God today.' : 'Today is still open.'}</Text>
      </View>
      <View style={styles.footer}>
        <PrimaryButton label="Back to today" onPress={() => navigation.goBack()} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  count: {
    fontSize: 56,
    fontWeight: '800',
    color: Colors.success,
  },
  caption: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  status: {
    marginTop: 8,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  footer: {
    paddingBottom: 24,
  },
});


