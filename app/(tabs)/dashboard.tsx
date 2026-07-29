import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Card } from '../../src/components/common/Card';
import { Screen } from '../../src/components/common/Screen';
import { ScreenHeader } from '../../src/components/common/ScreenHeader';
import { useWorkspace } from '../../src/context/WorkspaceContext';
import { colors, radii, spacing, typography } from '../../src/theme/tokens';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const router = useRouter();
  const { user, actions, activity, can } = useWorkspace();
  const canApprove = can('approveActions');
  const canViewFinancials = user.role === 'admin';
  const initials = user.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  // Mock data for our custom cashflow chart
  const chartData = [
    { day: 'Mon', value: 40 },
    { day: 'Tue', value: 65 },
    { day: 'Wed', value: 45 },
    { day: 'Thu', value: 80 },
    { day: 'Fri', value: 100 }, // Peak
    { day: 'Sat', value: 55 },
    { day: 'Sun', value: 30 },
  ];

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          eyebrow="Good morning,"
          title={user.name}
          trailing={(
            <TouchableOpacity
              accessibilityLabel="Open settings"
              accessibilityRole="button"
              activeOpacity={0.7}
              onPress={() => router.push('/settings')}
              style={styles.profileAvatar}
            >
              <Text style={styles.profileInitials}>{initials}</Text>
            </TouchableOpacity>
          )}
        />

        {canViewFinancials ? <View style={styles.freshnessRow}>
          <MaterialCommunityIcons name="check-circle" size={16} color={colors.success} />
          <Text style={styles.freshnessText}>Financial data updated 10 minutes ago</Text>
        </View> : null}

        {/* Business KPI Cards (Horizontal Scroll) */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.kpiContainer}
          snapToInterval={width * 0.45 + 16}
          decelerationRate="fast"
        >
          {canViewFinancials ? <Card style={[styles.kpiCard, styles.kpiCardPrimary]}>
            <View style={styles.kpiIconWrapper}>
              <MaterialCommunityIcons name="bank" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.kpiLabelLight}>Available Cash</Text>
            <Text style={styles.kpiValueLight}>$142,500</Text>
            <Text style={styles.kpiTrendLight}>Across 2 accounts</Text>
          </Card> : null}

          {canViewFinancials ? <Card style={styles.kpiCard}>
            <View style={[styles.kpiIconWrapper, { backgroundColor: '#F1F5F9' }]}>
              <MaterialCommunityIcons name="trending-down" size={24} color="#64748B" />
            </View>
            <Text style={styles.kpiLabel}>Monthly Burn</Text>
            <Text style={styles.kpiValue}>$38,200</Text>
            <Text style={styles.kpiTrendDark}>Under budget by 4%</Text>
          </Card> : null}

          <TouchableOpacity
            accessibilityLabel={`Open ${actions.length} pending actions`}
            accessibilityRole="button"
            activeOpacity={0.7}
            onPress={() => router.push('/(tabs)/actions')}
          >
            <Card style={styles.kpiCard}>
              <View style={[styles.kpiIconWrapper, { backgroundColor: colors.dangerSoft }]}>
                <MaterialCommunityIcons name="lightning-bolt" size={24} color={colors.danger} />
              </View>
              <Text style={styles.kpiLabel}>Pending Actions</Text>
              <Text style={styles.kpiValue}>{actions.length} {actions.length === 1 ? 'Item' : 'Items'}</Text>
              <Text style={[styles.kpiTrendDark, { color: colors.danger }]}>{canApprove ? 'Requires approval' : 'Admin review required'}</Text>
            </Card>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Needs Your Attention</Text>
            <TouchableOpacity accessibilityRole="button" onPress={() => router.push('/(tabs)/actions')}>
              <Text style={styles.sectionLink}>View all</Text>
            </TouchableOpacity>
          </View>
          <Card style={styles.attentionCard}>
            {actions.length === 0 ? <View style={styles.emptyAttention}>
              <MaterialCommunityIcons name="check-all" size={24} color={colors.success} />
              <Text style={styles.emptyAttentionText}>You're all caught up.</Text>
            </View> : actions.slice(0, 3).map((item, index) => <TouchableOpacity
              key={item.id}
              accessibilityRole="button"
              activeOpacity={0.7}
              onPress={() => router.push('/(tabs)/actions')}
              style={[styles.attentionRow, index < Math.min(actions.length, 3) - 1 && styles.attentionDivider]}
            >
              <View style={[styles.attentionIcon, { backgroundColor: item.type === 'access' ? colors.warningSoft : colors.accentSoft }]}>
                <MaterialCommunityIcons name={item.type === 'access' ? 'key-variant' : 'receipt'} size={20} color={item.type === 'access' ? colors.warning : colors.accent} />
              </View>
              <View style={styles.attentionCopy}>
                <Text style={styles.attentionTitle}>{item.title}</Text>
                <Text style={styles.attentionMeta}>{item.requester} · {item.time}</Text>
              </View>
              {item.amount ? <Text style={styles.attentionAmount}>{item.amount}</Text> : <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textTertiary} />}
            </TouchableOpacity>)}
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AutoPilot Brief</Text>
          <TouchableOpacity accessibilityRole="button" activeOpacity={0.7} onPress={() => router.push({ pathname: '/message', params: { title: 'Sarah (Finance AI)', online: 'true' } })}>
            <Card style={styles.briefCard}>
              <View style={styles.briefIcon}><MaterialCommunityIcons name="creation" size={22} color={colors.accent} /></View>
              <View style={styles.briefCopy}>
                <Text style={styles.briefTitle}>{canViewFinancials ? 'Cash inflow is 12% above last week.' : 'Your workspace has new activity to review.'}</Text>
                <Text style={styles.briefText}>{actions.length} pending {actions.length === 1 ? 'request needs' : 'requests need'} attention. Ask Sarah for a summary.</Text>
              </View>
              <MaterialCommunityIcons name="arrow-right" size={20} color={colors.accent} />
            </Card>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Programs</Text>
          <TouchableOpacity accessibilityRole="button" activeOpacity={0.7} onPress={() => router.push('/venture-os')}>
            <Card style={styles.ventureCard}>
              <View style={styles.ventureIcon}><MaterialCommunityIcons name="creation" size={24} color={colors.inverse} /></View>
              <View style={styles.briefCopy}>
                <Text style={styles.ventureEyebrow}>VENTURE OS</Text>
                <Text style={styles.ventureTitle}>Build your AI-native company</Text>
                <Text style={styles.briefText}>A 12-week curriculum, playbook, toolbox, and founder community.</Text>
              </View>
              <MaterialCommunityIcons name="arrow-right" size={22} color={colors.textPrimary} />
            </Card>
          </TouchableOpacity>
        </View>

        {canViewFinancials ? <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Weekly Cashflow</Text>
            <TouchableOpacity accessibilityLabel="View cashflow activity" accessibilityRole="button" onPress={() => router.push('/(tabs)/transactions')}>
              <MaterialCommunityIcons name="arrow-right" size={24} color="#94A3B8" />
            </TouchableOpacity>
          </View>
          
          <Card style={styles.chartCard}>
            <Text style={styles.chartTotal}>+$24,500.00</Text>
            <Text style={styles.chartSubtext}>Total incoming this week</Text>
            
            <View style={styles.barsContainer}>
              {chartData.map((item, index) => (
                <View key={index} style={styles.barColumn}>
                  <View style={styles.barTrack}>
                    <View style={[
                      styles.barFill, 
                      { height: `${item.value}%`, backgroundColor: item.value === 100 ? '#8B5CF6' : '#E2E8F0' }
                    ]} />
                  </View>
                  <Text style={[styles.barLabel, item.value === 100 && { color: '#8B5CF6', fontWeight: '700' }]}>
                    {item.day}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        </View> : null}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity accessibilityRole="button" onPress={() => router.push('/(tabs)/transactions')}><Text style={styles.sectionLink}>View all</Text></TouchableOpacity>
          </View>
          <Card style={styles.activityCard}>
            {activity.slice(0, 3).map((item, index) => <View key={item.id} style={[styles.activityRow, index < Math.min(activity.length, 3) - 1 && styles.attentionDivider]}>
              <View style={[styles.activityDot, { backgroundColor: item.status === 'rejected' ? colors.danger : colors.success }]} />
              <View style={styles.attentionCopy}>
                <Text style={styles.attentionTitle}>{item.title}</Text>
                <Text style={styles.attentionMeta}>{item.createdAt}</Text>
              </View>
              {item.amount ? <Text style={styles.activityAmount}>{item.amount}</Text> : null}
            </View>)}
          </Card>
        </View>

      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: spacing[10] },
  profileAvatar: { width: 48, height: 48, borderRadius: radii.pill, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.surface, shadowColor: colors.textPrimary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  profileInitials: { ...typography.itemTitle, color: colors.textMuted },
  freshnessRow: { alignItems: 'center', flexDirection: 'row', gap: spacing[2], paddingHorizontal: spacing[5], paddingBottom: spacing[4] },
  freshnessText: { ...typography.micro, color: colors.textSecondary },

  // KPI Cards
  kpiContainer: { paddingHorizontal: spacing[5], paddingBottom: spacing[4], gap: spacing[4] },
  kpiCard: { width: width * 0.42, borderRadius: radii.feature },
  kpiCardPrimary: { backgroundColor: colors.accent, borderColor: colors.accent, shadowColor: colors.accent, shadowOpacity: 0.2 },
  kpiIconWrapper: { width: 40, height: 40, borderRadius: radii.control, alignItems: 'center', justifyContent: 'center', marginBottom: spacing[4] },
  kpiLabel: { ...typography.label, color: colors.textSecondary, marginBottom: spacing[2] },
  kpiLabelLight: { ...typography.label, color: colors.accentTextSoft, marginBottom: spacing[2] },
  kpiValue: { ...typography.profileTitle, color: colors.textPrimary, marginBottom: spacing[1] },
  kpiValueLight: { ...typography.profileTitle, color: colors.inverse, marginBottom: spacing[1] },
  kpiTrendDark: { ...typography.micro, color: colors.textTertiary },
  kpiTrendLight: { ...typography.micro, color: '#A78BFA' },

  // Sections
  section: { paddingHorizontal: spacing[5], marginTop: spacing[6] },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[4] },
  sectionTitle: { ...typography.sectionTitle, color: colors.textPrimary, marginBottom: spacing[4] },
  sectionLink: { ...typography.supporting, color: colors.accent, fontWeight: '700' },
  attentionCard: { paddingHorizontal: spacing[4], paddingVertical: 0 },
  attentionRow: { alignItems: 'center', flexDirection: 'row', minHeight: 76, paddingVertical: spacing[3] },
  attentionDivider: { borderBottomColor: colors.divider, borderBottomWidth: 1 },
  attentionIcon: { alignItems: 'center', borderRadius: radii.control, height: 40, justifyContent: 'center', marginRight: spacing[3], width: 40 },
  attentionCopy: { flex: 1, paddingRight: spacing[3] },
  attentionTitle: { ...typography.supporting, color: colors.textPrimary, fontWeight: '700' },
  attentionMeta: { ...typography.micro, color: colors.textSecondary, marginTop: spacing[1] },
  attentionAmount: { ...typography.supporting, color: colors.textPrimary, fontWeight: '700' },
  emptyAttention: { alignItems: 'center', flexDirection: 'row', gap: spacing[3], justifyContent: 'center', minHeight: 84 },
  emptyAttentionText: { ...typography.body, color: colors.textSecondary },
  briefCard: { alignItems: 'center', backgroundColor: colors.accentSoft, borderColor: colors.accentTextSoft, flexDirection: 'row' },
  briefIcon: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: radii.control, height: 44, justifyContent: 'center', marginRight: spacing[3], width: 44 },
  briefCopy: { flex: 1, paddingRight: spacing[3] },
  briefTitle: { ...typography.itemTitle, color: colors.textPrimary },
  briefText: { ...typography.supporting, color: colors.textSecondary, lineHeight: 20, marginTop: spacing[1] },
  ventureCard: { alignItems: 'center', borderColor: colors.textPrimary, flexDirection: 'row' },
  ventureIcon: { alignItems: 'center', backgroundColor: colors.textPrimary, borderRadius: radii.control, height: 48, justifyContent: 'center', marginRight: spacing[3], width: 48 },
  ventureEyebrow: { ...typography.micro, color: colors.accent, fontWeight: '800' },
  ventureTitle: { ...typography.itemTitle, color: colors.textPrimary, marginTop: spacing[1] },

  // Chart Card
  chartCard: { borderRadius: radii.feature, padding: spacing[6] },
  chartTotal: { ...typography.display, color: colors.textPrimary, marginBottom: spacing[1] },
  chartSubtext: { ...typography.supporting, color: colors.textSecondary, marginBottom: spacing[8] },
  
  barsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 160 },
  barColumn: { alignItems: 'center', width: 32 },
  barTrack: { height: 120, width: 12, backgroundColor: '#F8F9FB', borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden', marginBottom: 12 },
  barFill: { width: '100%', borderRadius: 6 },
  barLabel: { fontSize: 12, color: '#94A3B8', fontWeight: '500' },

  activityCard: { paddingHorizontal: spacing[4], paddingVertical: 0 },
  activityRow: { alignItems: 'center', flexDirection: 'row', minHeight: 68, paddingVertical: spacing[3] },
  activityDot: { borderRadius: radii.pill, height: 10, marginHorizontal: spacing[3], width: 10 },
  activityAmount: { ...typography.supporting, color: colors.textPrimary, fontWeight: '700' },
});