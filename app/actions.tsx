import { router } from 'expo-router';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const mockActions = [
  {
    id: '1',
    title: 'Approve Invoice #1042',
    description: 'Vendor: Acme Corp — $4,200.00',
    type: 'approval',
    priority: 'high',
    time: '2h ago',
  },
  {
    id: '2',
    title: 'Review Expense Report',
    description: 'Submitted by: Sarah K. — $890.00',
    type: 'review',
    priority: 'medium',
    time: '4h ago',
  },
  {
    id: '3',
    title: 'Payment Due — Office Rent',
    description: 'Due in 2 days — $12,000.00',
    type: 'payment',
    priority: 'high',
    time: '1d ago',
  },
  {
    id: '4',
    title: 'Reconcile Bank Statement',
    description: 'August 2026 — 3 unmatched transactions',
    type: 'task',
    priority: 'low',
    time: '2d ago',
  },
];

const priorityColor = (priority: string) => {
  if (priority === 'high') return '#FF6B6B';
  if (priority === 'medium') return '#FFA500';
  return '#AAA';
};

const typeIcon = (type: string) => {
  if (type === 'approval') return 'check-circle-outline';
  if (type === 'review') return 'eye-outline';
  if (type === 'payment') return 'cash-multiple';
  return 'clipboard-text-outline';
};

export default function Actions() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Actions</Text>
        <Text style={styles.subtitle}>Tasks requiring your attention</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>

        {/* Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          {['All', 'Approvals', 'Payments', 'Reviews', 'Tasks'].map((tab, i) => (
            <TouchableOpacity key={i} style={[styles.tab, i === 0 && styles.activeTab]}>
              <Text style={[styles.tabText, i === 0 && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Action Cards */}
        {mockActions.map((action) => (
          <TouchableOpacity key={action.id} style={styles.card}>
            <View style={styles.cardLeft}>
              <View style={[styles.iconBg, { backgroundColor: action.priority === 'high' ? '#FFF0F0' : '#F0F0F0' }]}>
                <MaterialCommunityIcons
                  name={typeIcon(action.type) as any}
                  size={18}
                  color={priorityColor(action.priority)}
                />
              </View>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{action.title}</Text>
              <Text style={styles.cardDesc}>{action.description}</Text>
              <View style={styles.cardFooter}>
                <View style={[styles.priorityBadge, { backgroundColor: action.priority === 'high' ? '#FFE8E8' : action.priority === 'medium' ? '#FFF3E0' : '#F0F0F0' }]}>
                  <Text style={[styles.priorityText, { color: priorityColor(action.priority) }]}>
                    {action.priority.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.timeText}>{action.time}</Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={18} color="#CCC" />
          </TouchableOpacity>
        ))}

      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
     <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard')}>
  <MaterialCommunityIcons name="view-dashboard-outline" size={22} color="#999" />
  <Text style={styles.navLabel}>Dashboard</Text>
</TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="lightning-bolt" size={22} color="#00C48C" />
          <Text style={[styles.navLabel, { color: '#00C48C' }]}>Actions</Text>
        </TouchableOpacity>
<TouchableOpacity style={styles.navItem} onPress={() => router.push('/agents')}>
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
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: { fontSize: 22, fontWeight: '700', color: '#1A1A2E' },
  subtitle: { fontSize: 13, color: '#888', marginTop: 2 },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
  },
  activeTab: { backgroundColor: '#1A1A2E' },
  tabText: { fontSize: 13, color: '#666', fontWeight: '500' },
  activeTabText: { color: '#FFFFFF' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  cardLeft: { marginRight: 12 },
  iconBg: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#1A1A2E', marginBottom: 2 },
  cardDesc: { fontSize: 12, color: '#888', marginBottom: 8 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  priorityBadge: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  priorityText: { fontSize: 10, fontWeight: '700' },
  timeText: { fontSize: 11, color: '#AAA' },
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