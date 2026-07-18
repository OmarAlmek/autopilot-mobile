import type { ComponentProps, ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, radii, spacing, typography } from '../../theme/tokens';

type ButtonVariant = 'neutral' | 'accent' | 'success' | 'dangerSecondary';
type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

interface ButtonProps {
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: IconName;
  trailing?: ReactNode;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
}

const variantColors: Record<ButtonVariant, { background: string; foreground: string }> = {
  neutral: { background: colors.textPrimary, foreground: colors.inverse },
  accent: { background: colors.accent, foreground: colors.inverse },
  success: { background: colors.success, foreground: colors.inverse },
  dangerSecondary: { background: colors.dangerSoft, foreground: colors.danger },
};

export function Button({
  label,
  onPress,
  accessibilityLabel,
  disabled = false,
  loading = false,
  icon,
  trailing,
  variant = 'neutral',
  style,
}: ButtonProps) {
  const palette = variantColors[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: palette.background },
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.foreground} size="small" />
      ) : (
        <>
          {icon ? <MaterialCommunityIcons color={palette.foreground} name={icon} size={18} /> : null}
          <Text style={[styles.label, { color: palette.foreground }]}>{label}</Text>
          {trailing}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: radii.control,
    flexDirection: 'row',
    gap: spacing[2],
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  label: {
    ...typography.supporting,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
});