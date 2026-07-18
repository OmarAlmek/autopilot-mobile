import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useWorkspace } from '../../src/context/WorkspaceContext';

type ActionFilter = 'all' | 'invoice' | 'access';

const filters: { label: string; value: ActionFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Financial', value: 'invoice' },
  { label: 'Access', value: 'access' },
];

export default function ActionsScreen() {
  const router = useRouter();
  const { actions, can } = useWorkspace();
  const canApprove = can('approveActions');
  const [filter, setFilter] = useState<ActionFilter>('all');
  const visibleActions = filter === 'all' ? actions : actions.filter((item) => item.type === filter);

  const getIconForType = (type: string) => {
    switch(type) {
      case 'invoice': return { name: 'receipt', color: '#8B5CF6', bg: '#EDE9FE' };
      case 'access': return { name: 'key-variant', color: '#F59E0B', bg: '#FEF3C7' };
      case 'budget': return { name: 'chart-pie', color: '#10B981', bg: '#D1FAE5' };
      default: return { name: 'lightning-bolt', color: '#3B82F6', bg: '#DBEAFE' };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Pending Actions</Text>
          <Text style={styles.subtitle}>{canApprove ? 'Review and execute tasks' : 'View requests assigned to your workspace'}</Text>
        </View>
        <View style={styles.badgeCount}>
          <Text style={styles.badgeText}>{actions.length}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.filters}>
          {filters.map((item) => {
            const selected = filter === item.value;
            return <TouchableOpacity
              key={item.value}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              activeOpacity={0.7}
              onPress={() => setFilter(item.value)}
              style={[styles.filter, selected && styles.filterSelected]}
            >
              <Text style={[styles.filterText, selected && styles.filterTextSelected]}>{item.label}</Text>
            </TouchableOpacity>;
          })}
        </View>

        {actions.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <MaterialCommunityIcons name="check-all" size={48} color="#10B981" />
            </View>
            <Text style={styles.emptyStateTitle}>You're all caught up!</Text>
            <Text style={styles.emptyStateSub}>No pending approvals at this time.</Text>
          </View>
        ) : visibleActions.length === 0 ? (
          <View style={styles.filteredEmpty}>
            <Text style={styles.filteredEmptyTitle}>No matching requests</Text>
            <Text style={styles.filteredEmptyText}>Try a different action category.</Text>
          </View>
        ) : (
          visibleActions.map((item) => {
            const iconConfig = getIconForType(item.type);
            const riskColor = item.risk === 'high' ? '#EF4444' : item.risk === 'medium' ? '#F59E0B' : '#10B981';
            const riskBackground = item.risk === 'high' ? '#FEF2F2' : item.risk === 'medium' ? '#FEF3C7' : '#D1FAE5';
            
            return (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <View style={[styles.iconBox, { backgroundColor: iconConfig.bg as string }]}>
                      <MaterialCommunityIcons name={iconConfig.name as any} size={24} color={iconConfig.color as string} />
                    </View>
                    <View>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                      <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                    </View>
                  </View>
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>

                {item.amount && (
                  <Text style={styles.amountText}>{item.amount}</Text>
                )}

                <View style={styles.statusRow}>
                  <View style={[styles.statusBadge, { backgroundColor: riskBackground }]}>
                    <MaterialCommunityIcons name="shield-outline" size={14} color={riskColor} />
                    <Text style={[styles.statusText, { color: riskColor }]}>{item.risk.charAt(0).toUpperCase() + item.risk.slice(1)} risk</Text>
                  </View>
                  <View style={styles.dueBadge}>
                    <MaterialCommunityIcons name="clock-outline" size={14} color="#64748B" />
                    <Text style={styles.dueText}>{item.dueLabel}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.cardFooter}>
                  <Text style={styles.requesterText}>Requested by {item.requester}</Text>
                  <TouchableOpacity
                    accessibilityLabel={`View details for ${item.title}`}
                    accessibilityRole="button"
                    activeOpacity={0.7}
                    onPress={() => router.push({ pathname: '/action/[id]', params: { id: item.id } })}
                    style={styles.detailsButton}
                  >
                    <Text style={styles.detailsButtonText}>{canApprove ? 'Review' : 'View details'}</Text>
                    <MaterialCommunityIcons name="chevron-right" size={18} color="#8B5CF6" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 40, 
    paddingBottom: 20, 
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  title: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  subtitle: { fontSize: 15, color: '#64748B', marginTop: 4 },
  badgeCount: { backgroundColor: '#EF4444', height: 32, width: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
  
  content: { padding: 20 },
  filters: { backgroundColor: '#E2E8F0', borderRadius: 12, flexDirection: 'row', marginBottom: 20, padding: 4 },
  filter: { alignItems: 'center', borderRadius: 10, flex: 1, justifyContent: 'center', minHeight: 40, paddingHorizontal: 8 },
  filterSelected: { backgroundColor: '#FFFFFF' },
  filterText: { color: '#64748B', fontSize: 13, fontWeight: '600' },
  filterTextSelected: { color: '#0F172A' },
  
  // Card Styling
  card: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    padding: 20, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  cardSubtitle: { fontSize: 14, color: '#64748B', marginTop: 2 },
  timeText: { fontSize: 13, color: '#94A3B8', fontWeight: '500' },
  amountText: { fontSize: 32, fontWeight: '800', color: '#0F172A', marginVertical: 8 },
  statusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  statusBadge: { alignItems: 'center', borderRadius: 12, flexDirection: 'row', gap: 4, paddingHorizontal: 10, paddingVertical: 6 },
  statusText: { fontSize: 12, fontWeight: '700' },
  dueBadge: { alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 12, flexDirection: 'row', gap: 4, paddingHorizontal: 10, paddingVertical: 6 },
  dueText: { color: '#64748B', fontSize: 12, fontWeight: '600' },
  
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  requesterText: { fontSize: 13, color: '#64748B', flex: 1, paddingRight: 10 },
  
  detailsButton: { alignItems: 'center', flexDirection: 'row', gap: 2, minHeight: 40, paddingLeft: 12 },
  detailsButtonText: { color: '#8B5CF6', fontSize: 14, fontWeight: '700' },

  // Empty State Styling
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyIconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#D1FAE5', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  emptyStateTitle: { fontSize: 22, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  emptyStateSub: { fontSize: 16, color: '#64748B', textAlign: 'center' }
  ,filteredEmpty: { alignItems: 'center', paddingVertical: 60 },
  filteredEmptyTitle: { color: '#0F172A', fontSize: 18, fontWeight: '700' },
  filteredEmptyText: { color: '#64748B', fontSize: 14, marginTop: 6 },
});