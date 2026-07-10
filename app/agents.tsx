import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const agents = [
  {
    id: '1',
    name: 'Sarah',
    role: 'Onboarding Agent',
    description: 'Guides you through setup, answers questions, and helps configure your workspace.',
    status: 'online',
    icon: 'account-voice',
    color: '#00C48C',
    bgColor: '#E0F8EE',
  },
  {
    id: '2',
    name: 'Ramsey',
    role: 'Finance & Accounting Agent',
    description: 'Handles invoices, expense reports, reconciliation, and financial insights.',
    status: 'online',
    icon: 'calculator-variant-outline',
    color: '#4B7BEC',
    bgColor: '#EEF3FF',
  },
  {
    id: '3',
    name: 'Custom Agent',
    role: 'Your Custom Agents',
    description: 'Browse and interact with agents you or your team have built for specific workflows.',
    status: 'idle',
    icon: 'robot-outline',
    color: '#888',
    bgColor: '#F0F0F0',
  },
];

export default function Agents() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Agents</Text>
        <Text style={styles.subtitle}>Your AI team, ready to help</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>

        {/* Agent Cards */}
        {agents.map((agent) => (
          <TouchableOpacity key={agent.id} style={styles.card}>
            <View style={[styles.iconBg, { backgroundColor: agent.bgColor }]}>
              <MaterialCommunityIcons name={agent.icon as any} size={24} color={agent.color} />
            </View>
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.agentName}>{agent.name}</Text>
                <View style={[styles.statusDot, { backgroundColor: agent.status === 'online' ? '#00C48C' : '#CCC' }]} />
              </View>
              <Text style={styles.agentRole}>{agent.role}</Text>
              <Text style={styles.agentDesc}>{agent.description}</Text>
              <TouchableOpacity style={[styles.chatButton, { backgroundColor: agent.color }]}>
                <MaterialCommunityIcons name="message-outline" size={14} color="#FFF" />
                <Text style={styles.chatButtonText}>Start Chat</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard')}>
          <MaterialCommunityIcons name="view-dashboard-outline" size={22} color="#999" />
          <Text style={styles.navLabel}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/actions')}>
          <MaterialCommunityIcons name="lightning-bolt" size={22} color="#999" />
          <Text style={styles.navLabel}>Actions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="robot-outline" size={22} color="#00C48C" />
          <Text style={[styles.navLabel, { color: '#00C48C' }]}>Agents</Text>
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
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: { fontSize: 22, fontWeight: '700', color: '#1A1A2E' },
  subtitle: { fontSize: 13, color: '#888', marginTop: 2 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBg: {
    width: 52, height: 52, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 16, marginTop: 4,
  },
  cardContent: { flex: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 },
  agentName: { fontSize: 17, fontWeight: '700', color: '#1A1A2E' },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  agentRole: { fontSize: 12, color: '#888', marginBottom: 8 },
  agentDesc: { fontSize: 13, color: '#555', lineHeight: 18, marginBottom: 12 },
  chatButton: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 8, alignSelf: 'flex-start',
  },
  chatButtonText: { fontSize: 13, fontWeight: '600', color: '#FFF' },
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