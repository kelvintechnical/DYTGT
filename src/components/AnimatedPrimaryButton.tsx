import React, { useRef } from 'react';
import { Pressable, Text, StyleSheet, GestureResponderEvent, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '../theme/colors';

type Props = {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
};

export default function AnimatedPrimaryButton({
  label,
  onPress,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
}: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    // Light haptic feedback on press
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Scale down animation
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    // Scale back up with slight bounce
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 7,
    }).start();
  };

  const handlePress = (event: GestureResponderEvent) => {
    if (disabled) return;
    onPress(event);
  };

  const a11yLabel = accessibilityLabel ?? label;
  const a11yHint = accessibilityHint ?? (disabled ? 'Button is disabled' : 'Double tap to activate');

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessible
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      accessibilityHint={a11yHint}
      accessibilityState={{ disabled }}
    >
      <Animated.View
        style={[
          styles.button,
          { transform: [{ scale: scaleAnim }] },
          disabled && styles.buttonDisabled,
        ]}
      >
        <Text style={styles.label}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  label: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

