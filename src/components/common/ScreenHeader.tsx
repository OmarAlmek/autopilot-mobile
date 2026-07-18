import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, spacing, typography } from '../../theme/tokens';

interface ScreenHeaderProps {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  trailing?: ReactNode;
  bordered?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function ScreenHeader({
  title,
  eyebrow,
  subtitle,
  trailing,
  bordered = false,
  style,
}: ScreenHeaderProps) {
  return (
    <View style={[styles.header, bordered && styles.bordered, style]}>
      <View style={styles.copy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: spacing[6],
    paddingHorizontal: spacing[5],
    paddingTop: spacing[6],
  },
  bordered: {
    backgroundColor: colors.surface,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    paddingBottom: spacing[5],
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    ...typography.itemTitle,
    color: colors.textSecondary,
    fontWeight: '400',
    marginBottom: spacing[1],
  },
  title: {
    ...typography.screenTitle,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing[1],
  },
  trailing: {
    marginLeft: spacing[4],
  },
});