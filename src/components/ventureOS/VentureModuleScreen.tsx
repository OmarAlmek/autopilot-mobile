import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { ComponentProps } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Screen } from '../common/Screen';
import { colors, radii, spacing, typography } from '../../theme/tokens';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

interface VentureModuleScreenProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: IconName;
  stats: Array<{ label: string; value: string }>;
  nextTitle: string;
  nextDescription: string;
  onNextPress?: () => void;
  status?: { kind: 'loading' } | { kind: 'error'; message: string; onRetry: () => void };
}

export function VentureModuleScreen({
  eyebrow,
  title,
  description,
  icon,
  stats,
  nextTitle,
  nextDescription,
  onNextPress,
  status,
}: VentureModuleScreenProps) {
  const router = useRouter();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <View style={styles.brandMark}>
              <MaterialCommunityIcons name="creation" size={18} color={colors.inverse} />
            </View>
            <Text style={styles.brand}>VENTURE OS</Text>
          </View>
          <TouchableOpacity
            accessibilityLabel="Return to AutoPilot"
            accessibilityRole="button"
            activeOpacity={0.7}
            onPress={() => router.replace('/(tabs)/dashboard')}
            style={styles.autopilotButton}
          >
            <MaterialCommunityIcons name="arrow-left" size={18} color={colors.textPrimary} />
            <Text style={styles.autopilotButtonText}>AutoPilot</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.hero}>
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons name={icon} size={26} color={colors.accent} />
          </View>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.stat}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {status?.kind === 'loading' ? (
          <Card style={styles.statusCard}>
            <Text accessibilityLiveRegion="polite" style={styles.statusTitle}>Loading your program...</Text>
          </Card>
        ) : status?.kind === 'error' ? (
          <Card style={styles.statusCard}>
            <Text accessibilityLiveRegion="assertive" style={styles.statusTitle}>Program unavailable</Text>
            <Text style={styles.statusDescription}>{status.message}</Text>
            <Button label="Try again" onPress={status.onRetry} style={styles.retryButton} />
          </Card>
        ) : (
          <>
            <Text style={styles.sectionLabel}>UP NEXT</Text>
            <TouchableOpacity
              accessibilityLabel={onNextPress ? nextTitle : undefined}
              accessibilityRole={onNextPress ? 'button' : undefined}
              activeOpacity={onNextPress ? 0.7 : 1}
              disabled={!onNextPress}
              onPress={onNextPress}
            >
            <Card style={styles.nextCard}>
              <View style={styles.nextNumber}><Text style={styles.nextNumberText}>01</Text></View>
              <View style={styles.nextCopy}>
                <Text style={styles.nextTitle}>{nextTitle}</Text>
                <Text style={styles.nextDescription}>{nextDescription}</Text>
              </View>
              {onNextPress ? <MaterialCommunityIcons name="arrow-right" size={22} color={colors.textPrimary} /> : null}
            </Card>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing[5], paddingBottom: spacing[10] },
  topBar: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing[8] },
  brandRow: { alignItems: 'center', flexDirection: 'row', gap: spacing[2] },
  brandMark: { alignItems: 'center', backgroundColor: colors.textPrimary, borderRadius: radii.small, height: 32, justifyContent: 'center', width: 32 },
  brand: { ...typography.micro, color: colors.textPrimary, fontWeight: '800' },
  autopilotButton: { alignItems: 'center', borderColor: colors.border, borderRadius: radii.control, borderWidth: 1, flexDirection: 'row', gap: spacing[1], minHeight: 40, paddingHorizontal: spacing[3] },
  autopilotButtonText: { ...typography.label, color: colors.textPrimary },
  hero: { marginBottom: spacing[8] },
  iconWrap: { alignItems: 'center', backgroundColor: colors.accentSoft, borderRadius: radii.control, height: 48, justifyContent: 'center', marginBottom: spacing[5], width: 48 },
  eyebrow: { ...typography.label, color: colors.accent, marginBottom: spacing[2], textTransform: 'uppercase' },
  title: { ...typography.display, color: colors.textPrimary, marginBottom: spacing[3] },
  description: { ...typography.body, color: colors.textSecondary, lineHeight: 23, maxWidth: 520 },
  statsRow: { borderBottomColor: colors.border, borderBottomWidth: 1, borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', marginBottom: spacing[8], paddingVertical: spacing[5] },
  stat: { flex: 1 },
  statValue: { ...typography.profileTitle, color: colors.textPrimary },
  statLabel: { ...typography.micro, color: colors.textSecondary, marginTop: spacing[1] },
  sectionLabel: { ...typography.micro, color: colors.textTertiary, fontWeight: '800', marginBottom: spacing[3] },
  nextCard: { alignItems: 'center', borderRadius: radii.brand, flexDirection: 'row' },
  nextNumber: { alignItems: 'center', backgroundColor: colors.textPrimary, borderRadius: radii.control, height: 44, justifyContent: 'center', marginRight: spacing[3], width: 44 },
  nextNumberText: { ...typography.label, color: colors.inverse },
  nextCopy: { flex: 1, paddingRight: spacing[3] },
  nextTitle: { ...typography.itemTitle, color: colors.textPrimary },
  nextDescription: { ...typography.supporting, color: colors.textSecondary, marginTop: spacing[1] },
  statusCard: { borderRadius: radii.brand },
  statusTitle: { ...typography.itemTitle, color: colors.textPrimary },
  statusDescription: { ...typography.supporting, color: colors.textSecondary, marginTop: spacing[2] },
  retryButton: { alignSelf: 'flex-start', marginTop: spacing[4] },
});