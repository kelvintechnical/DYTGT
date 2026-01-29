import React from 'react';
import { View, Text, StyleSheet, AccessibilityProps } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../theme/colors';

type Props = {
  currentStreak: number;
  target?: number;
} & AccessibilityProps;

const SIZE = 96;
const STROKE_WIDTH = 8;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function StreakCircle({ currentStreak, target = 30, accessibilityLabel, ...rest }: Props) {
  const clampedTarget = target <= 0 ? 1 : target;
  const progress = Math.max(0, Math.min(currentStreak / clampedTarget, 1));
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const label = `${currentStreak}`;
  const subtitle = 'day streak';

  const a11yLabel =
    accessibilityLabel ??
    `${currentStreak} day streak. ${Math.round(progress * 100)} percent of ${clampedTarget}-day goal.`;

  return (
    <View
      style={styles.container}
      accessible
      accessibilityRole="image"
      accessibilityLabel={a11yLabel}
      {...rest}
    >
      <Svg width={SIZE} height={SIZE}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={Colors.surface}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={Colors.accent}
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      </Svg>
      <View style={styles.labelContainer} pointerEvents="none">
        <Text style={styles.count}>{label}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 11,
    color: Colors.textSecondary,
  },
});



