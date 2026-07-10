import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';

const screenWidth = Dimensions.get('window').width;

const mockChartData = [0, 1, 0.5, 2, 1.5, 3, 2, 4, 3, 3.5, 2.5, 4, 3];
const maxVal = Math.max(...mockChartData, 1);

const spendingCategories = [
  { id: '1', label: 'Office & Rent', amount: '$12,000', percent: 48, icon: 'office-building-outline', color: '#4B7BEC', bg: '#EEF3FF' },
  { id: '2', label: 'Salaries', amount: '$8,400', percent: 34, icon: 'account-group-outline', color: '#00C48C', bg: '#E0F8EE' },
  { id: '3', label: 'Vendors', amount: '$4,200', percent: 17, icon: 'truck-outline', color: '#FFA500', bg: '#FFF3E0' },
  { id: '4', label: 'Subscriptions', amount: '$890', percent: 4, icon: 'apps', color: '#FF6B6B', bg: '#FFF0F0' },
];

export default function Dashboard() {
  const [forecastExpanded, setForecastExpanded] = useState(false);

  return (
    <View style={styles.container}>

      {/* Dark Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.headerDate}>July 10, 2026 · Updated just now</Text>
        </View>
        <TouchableOpacity style={styles.notifButton}>
          <MaterialCommunityIcons name="bell-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Attention Banner */}
        <TouchableOpacity style={styles.attentionBanner} onPress={() => router.push('/actions')}>
          <View style={styles.attentionLeft}>
            <MaterialCommunityIcons name="alert-circle-outline" size={18} color="#FFA500" />
            <Text style={styles.attentionText}>2 items need your attention</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={18} color="#FFA500" />
        </TouchableOpacity>

        {/* Cash Overview Card */}
        <View style={styles.cashCard}>
          <Text style={styles.cashLabel}>Available Cash</Text>
          <Text style={styles.cashValue}>$24,500.00</Text>
          <View style={styles.cashRow}>
            <View style={styles.cashInOut}>
              <MaterialCommunityIcons name="trending-up" size={14} color="#00C48C" />
              <Text style={styles.cashInText}>$8,200 in</Text>
            </View>
            <View style={styles.cashInOut}>
              <MaterialCommunityIcons name="trending-down" size={14} color="#FF6B6B" />
              <Text style={styles.cashOutText}>$5,490 out</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: '60%', backgroundColor: '#00C48C' }]} />
            <View style={[styles.progressFill, { width: '40%', backgroundColor: '#FF6B6B' }]} />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>Cash In</Text>
            <Text style={styles.progressLabel}>Cash Out</Text>
          </View>
        </View>

        {/* Metric Cards Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 4 }}>
          <View style={styles.metricCard}>
            <View style={[styles.iconBg, { backgroundColor: '#FFF0F0' }]}>
              <MaterialCommunityIcons name="fire" size={16} color="#FF6B6B" />
            </View>
            <Text style={styles.metricLabel}>Monthly Burn</Text>
            <Text style={styles.metricValue}>$25,490</Text>
            <View style={[styles.tag, { backgroundColor: '#FFE8E8' }]}>
              <Text style={[styles.tagText, { color: '#FF6B6B' }]}>Projected</Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.iconBg, { backgroundColor: '#E0F8EE' }]}>
              <MaterialCommunityIcons name="trending-up" size={16} color="#00C48C" />
            </View>
            <Text style={styles.metricLabel}>Weekly In</Text>
            <Text style={styles.metricValue}>$8,200</Text>
            <View style={[styles.tag, { backgroundColor: '#E0F8EE' }]}>
           <Text style={[styles.tagText, { color: '#00C48C' }]}>4 payments</Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.iconBg, { backgroundColor: '#FFF0F0' }]}>
              <MaterialCommunityIcons name="trending-down" size={16} color="#FF6B6B" />
            </View>
            <Text style={styles.metricLabel}>Weekly Out</Text>
            <Text style={styles.metricValue}>$5,490</Text>
            <View style={[styles.tag, { backgroundColor: '#FFE8E8' }]}>
              <Text style={[styles.tagText, { color: '#FF6B6B' }]}>7 payments</Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.iconBg, { backgroundColor: '#F0F0F0' }]}>
              <MaterialCommunityIcons name="shield-check-outline" size={16} color="#555" />
            </View>
            <Text style={styles.metricLabel}>Active Risks</Text>
            <Text style={styles.metricValue}>0</Text>
            <View style={[styles.tag, { backgroundColor: '#E0F8EE' }]}>
              <Text style={[styles.tagText, { color: '#00C48C' }]}>Healthy</Text>
            </View>
          </View>
        </ScrollView>

        {/* Spending Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spending This Week</Text>
          <View style={styles.spendingGrid}>
            {spendingCategories.map((cat) => (
              <TouchableOpacity key={cat.id} style={styles.spendingCard} onPress={() => router.push('/transactions')}>
                <View style={[styles.spendingIcon, { backgroundColor: cat.bg }]}>
                  <MaterialCommunityIcons name={cat.icon as any} size={18} color={cat.color} />
                </View>
                <Text style={styles.spendingLabel}>{cat.label}</Text>
                <Text style={styles.spendingAmount}>{cat.amount}</Text>
                <View style={styles.spendingBarBg}>
                  <View style={[styles.spendingBarFill, { width: `${cat.percent}%` as any, backgroundColor: cat.color }]} />
                </View>
                <Text style={styles.spendingPercent}>{cat.percent}% of spend</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Forecast — Collapsible */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.forecastHeader} onPress={() => setForecastExpanded(!forecastExpanded)}>
            <Text style={styles.sectionTitle}>13-Week Forecast</Text>
            <MaterialCommunityIcons name={forecastExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="#999" />
          </TouchableOpacity>

          {forecastExpanded && (
            <View style={styles.chartCard}>
              <View style={styles.legendRow}>
                <View style={styles.legendDot} />
                <Text style={styles.legendText}>Projected Cash</Text>
              </View>
              <View style={styles.chart}>
                <View style={styles.chartBars}>
                  {mockChartData.map((val, i) => (
                    <View key={i} style={styles.barColumn}>
                      <View style={[styles.bar, { height: (val / maxVal) * 100, backgroundColor: '#00C48C' }]} />
                      <Text style={styles.barLabel}>{i % 3 === 0 ? `W${i + 1}` : ''}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.chartFooterRow}>
                <Text style={styles.chartFooterText}>Min. target <Text style={styles.chartFooterValue}>$0</Text></Text>
                <Text style={styles.chartFooterText}>Min. Cash W1 <Text style={[styles.chartFooterValue, { color: '#FFA500' }]}>$0</Text></Text>
              </View>
            </View>
          )}
        </View>

      </ScrollView>

      {/* Sarah Floating Button */}
      <TouchableOpacity style={styles.sarahButton} onPress={() => router.push('/agents')}>
        <MaterialCommunityIcons name="message-outline" size={22} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="view-dashboard-outline" size={22} color="#00C48C" />
          <Text style={[styles.navLabel, { color: '#00C48C' }]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/actions')}>
          <MaterialCommunityIcons name="lightning-bolt" size={22} color="#999" />
          <Text style={styles.navLabel}>Actions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/agents')}>
          <MaterialCommunityIcons name="robot-outline" size={22} color="#999" />
          <Text style={styles.navLabel}>Agents</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/approvals')}>
          <MaterialCommunityIcons name="check-circle-outline" size={22} color="#999" />
          <Text style={styles.navLabel}>Approvals</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/settings')}>
          <MaterialCommunityIcons name="cog-outline" size={22} color="#999" />
          <Text style={styles.navLabel}>Settings</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 20,
    backgroundColor: '#1A1A2E',
  },
  greeting: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
  headerDate: { fontSize: 12, color: '#AAAACC', marginTop: 4 },
  notifButton: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  attentionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF8EE',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#FFA500',
  },
  attentionLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  attentionText: { fontSize: 13, fontWeight: '600', color: '#FFA500' },
  cashCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cashLabel: { fontSize: 13, color: '#888', marginBottom: 4 },
  cashValue: { fontSize: 32, fontWeight: '700', color: '#1A1A2E', marginBottom: 12 },
  cashRow: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  cashInOut: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cashInText: { fontSize: 13, color: '#00C48C', fontWeight: '600' },
  cashOutText: { fontSize: 13, color: '#FF6B6B', fontWeight: '600' },
  progressBg: { flexDirection: 'row', height: 6, borderRadius: 3, overflow: 'hidden', backgroundColor: '#F0F0F0', marginBottom: 6 },
  progressFill: { height: 6 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel: { fontSize: 11, color: '#AAA' },
  metricCard: {
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  iconBg: {
    width: 32, height: 32, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  metricLabel: { fontSize: 11, color: '#888', marginBottom: 2 },
  metricValue: { fontSize: 18, fontWeight: '700', color: '#1A1A2E', marginBottom: 6 },
  tag: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, alignSelf: 'flex-start' },
  tagText: { fontSize: 10, fontWeight: '600' },
  section: { paddingHorizontal: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A2E', marginBottom: 12 },
  spendingGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  spendingCard: {
    width: (screenWidth - 52) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  spendingIcon: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  spendingLabel: { fontSize: 12, color: '#888', marginBottom: 4 },
  spendingAmount: { fontSize: 16, fontWeight: '700', color: '#1A1A2E', marginBottom: 8 },
  spendingBarBg: { height: 4, backgroundColor: '#F0F0F0', borderRadius: 2, marginBottom: 4 },
  spendingBarFill: { height: 4, borderRadius: 2 },
  spendingPercent: { fontSize: 10, color: '#AAA' },
  forecastHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  legendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  legendDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00C48C', marginRight: 6 },
  legendText: { fontSize: 12, color: '#666' },
  chart: { height: 120, justifyContent: 'flex-end' },
  chartBars: { flexDirection: 'row', alignItems: 'flex-end', height: 100, gap: 4 },
  barColumn: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  bar: { width: '70%', borderRadius: 3, minHeight: 2 },
  barLabel: { fontSize: 8, color: '#AAA', marginTop: 4 },
  chartFooterRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  chartFooterText: { fontSize: 11, color: '#AAA' },
  chartFooterValue: { fontSize: 11, fontWeight: '600', color: '#1A1A2E' },
  sarahButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#00A878',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00A878',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingVertical: 10,
    paddingHorizontal: 8,
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 4 },
  navLabel: { fontSize: 10, color: '#999', marginTop: 3, fontWeight: '500' },
});