import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, radii } from '../../theme/tokens';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

interface IconButtonProps {
  accessibilityLabel: string;
  icon: IconName;
  onPress: () => void;
  backgroundColor?: string;
  color?: string;
  disabled?: boolean;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function IconButton({
  accessibilityLabel,
  icon,
  onPress,
  backgroundColor = colors.surfaceSubtle,
  color = colors.textPrimary,
  disabled = false,
  size = 22,
  style,
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor },
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <MaterialCommunityIcons color={color} name={icon} size={size} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: radii.pill,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
});