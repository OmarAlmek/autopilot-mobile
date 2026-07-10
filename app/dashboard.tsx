import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const mockChartData = [0, 1, 0.5, 2, 1.5, 3, 2, 4, 3, 3.5, 2.5, 4, 3];
const maxVal = Math.max(...mockChartData, 1);

export default function Dashboard() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.subheading}>
            Here's your cash position for <Text style={styles.bold}>July 10, 2026</Text>
          </Text>
          <Text style={styles.updated}>Updated just now</Text>
        </View>
        <TouchableOpacity style={styles.notifButton}>
          <MaterialCommunityIcons name="bell-outline" size={22} color="#1A1A2E" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Metric Cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}>

          <View style={styles.metricCard}>
            <View style={[styles.iconBg, { backgroundColor: '#F0F0F0' }]}>
              <MaterialCommunityIcons name="wallet-outline" size={18} color="#555" />
            </View>
            <Text style={styles.metricLabel}>Available Cash</Text>
            <Text style={styles.metricValue}>$0.0</Text>
            <View style={styles.tagRow}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>— $0</Text>
              </View>
              <Text style={styles.metricSub}> Operational</Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.iconBg, { backgroundColor: '#FFF0F0' }]}>
              <MaterialCommunityIcons name="trending-down" size={18} color="#FF6B6B" />
            </View>
            <Text style={styles.metricLabel}>Monthly Burn</Text>
            <Text style={styles.metricValue}>$0.0</Text>
            <View style={styles.tagRow}>
              <View style={[styles.tag, { backgroundColor: '#FFE8E8' }]}>
                <Text style={[styles.tagText, { color: '#FF6B6B' }]}>Projected</Text>
              </View>
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.iconBg, { backgroundColor: '#F0FBF6' }]}>
              <MaterialCommunityIcons name="trending-up" size={18} color="#00C48C" />
            </View>
            <Text style={styles.metricLabel}>Weekly Money In</Text>
            <Text style={styles.metricValue}>$0.0</Text>
            <View style={styles.tagRow}>
              <View style={[styles.tag, { backgroundColor: '#E0F8EE' }]}>
                <Text style={[styles.tagText, { color: '#00C48C' }]}>0 txns</Text>
              </View>
              <Text style={styles.metricSub}> last 7 days</Text>
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.iconBg, { backgroundColor: '#FFF0F0' }]}>
              <MaterialCommunityIcons name="trending-down" size={18} color="#FF6B6B" />
            </View>
            <Text style={styles.metricLabel}>Weekly Money Out</Text>
            <Text style={styles.metricValue}>$0.0</Text>
            <View style={styles.tagRow}>
              <View style={[styles.tag, { backgroundColor: '#FFE8E8' }]}>
                <Text style={[styles.tagText, { color: '#FF6B6B' }]}>spent</Text>
              </View>
              <Text style={styles.metricSub}> last 7 days</Text>
            </View>
          </View>

        </ScrollView>

        {/* Forecast Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>13-week money forecast</Text>
              <Text style={styles.chartSub}>Snapshot may be stale. Refresh to rebuild.</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={styles.legendDot} />
              <Text style={styles.legendText}>Projected Cash</Text>
            </View>
          </View>

          {/* Custom Chart */}
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
            <Text style={styles.chartFooterText}>Minimum cash target  <Text style={styles.chartFooterValue}>$0</Text></Text>
            <Text style={styles.chartFooterText}>Min. Cash (W1)  <Text style={[styles.chartFooterValue, { color: '#FFA500' }]}>$0</Text></Text>
          </View>
        </View>

        {/* Active Risks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Risks</Text>
            <View style={styles.badge}><Text style={styles.badgeText}>0</Text></View>
          </View>
          <View style={styles.card}>
            <MaterialCommunityIcons name="shield-check-outline" size={18} color="#00C48C" />
            <Text style={styles.cardText}>No active risks detected. Your cash looks healthy.</Text>
          </View>
        </View>

        {/* Priority To-Dos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={styles.sectionTitle}>Priority To-Dos</Text>
              <View style={styles.badge}><Text style={styles.badgeText}>0</Text></View>
            </View>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={18} color="#999" />
            <Text style={styles.cardText}>No pending actions right now. Check back later.</Text>
          </View>
        </View>

        {/* Insights Snapshot */}
        <View style={styles.section}>
          <View style={styles.insightCard}>
            <MaterialCommunityIcons name="lightbulb-outline" size={18} color="#666" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.insightTitle}>Insights Snapshot</Text>
              <Text style={styles.cardText}>No major anomalies detected in current period.</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={18} color="#999" />
          </View>
        </View>

      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="view-dashboard-outline" size={22} color="#00C48C" />
          <Text style={[styles.navLabel, { color: '#00C48C' }]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="lightning-bolt" size={22} color="#999" />
          <Text style={styles.navLabel}>Actions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="robot-outline" size={22} color="#999" />
          <Text style={styles.navLabel}>Agents</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="check-circle-outline" size={22} color="#999" />
          <Text style={styles.navLabel}>Approvals</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
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
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  greeting: { fontSize: 22, fontWeight: '700', color: '#1A1A2E' },
  subheading: { fontSize: 13, color: '#666', marginTop: 2 },
  bold: { fontWeight: '700', color: '#1A1A2E' },
  updated: { fontSize: 11, color: '#AAA', marginTop: 4 },
  notifButton: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#F8F9FB', alignItems: 'center', justifyContent: 'center',
  },
  metricCard: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBg: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  metricLabel: { fontSize: 12, color: '#888', marginBottom: 4 },
  metricValue: { fontSize: 24, fontWeight: '700', color: '#1A1A2E', marginBottom: 8 },
  tagRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  tag: { backgroundColor: '#F0F0F0', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  tagText: { fontSize: 10, color: '#555', fontWeight: '600' },
  metricSub: { fontSize: 10, color: '#AAA' },
  chartCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  chartTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
  chartSub: { fontSize: 11, color: '#AAA', marginTop: 2 },
  legendRow: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00C48C', marginRight: 4 },
  legendText: { fontSize: 11, color: '#666' },
  chart: { height: 120, justifyContent: 'flex-end' },
  chartBars: { flexDirection: 'row', alignItems: 'flex-end', height: 100, gap: 4 },
  barColumn: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  bar: { width: '70%', borderRadius: 3, minHeight: 2 },
  barLabel: { fontSize: 8, color: '#AAA', marginTop: 4 },
  chartFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  chartFooterText: { fontSize: 11, color: '#AAA' },
  chartFooterValue: { fontSize: 11, fontWeight: '600', color: '#1A1A2E' },
  section: { paddingHorizontal: 20, marginBottom: 16 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A2E' },
  badge: {
    backgroundColor: '#F0F0F0', borderRadius: 10,
    paddingHorizontal: 7, paddingVertical: 1, marginLeft: 6,
  },
  badgeText: { fontSize: 11, color: '#666', fontWeight: '600' },
  viewAll: { fontSize: 13, color: '#00C48C', fontWeight: '500' },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  cardText: { fontSize: 13, color: '#666', flex: 1 },
  insightCard: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16,
    flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  insightTitle: { fontSize: 13, fontWeight: '700', color: '#1A1A2E', marginBottom: 2 },
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