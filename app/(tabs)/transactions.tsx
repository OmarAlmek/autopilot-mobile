import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useWorkspace, type ActivityItem } from '../../src/context/WorkspaceContext';

type ActivityFilter = 'all' | 'decision' | 'money';

const filters: { label: string; value: ActivityFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Decisions', value: 'decision' },
  { label: 'Money', value: 'money' },
];

function getActivityStyle(item: ActivityItem) {
  if (item.status === 'approved') return { color: '#10B981', backgroundColor: '#D1FAE5', icon: 'check-circle-outline' as const, label: 'Approved' };
  if (item.status === 'rejected') return { color: '#EF4444', backgroundColor: '#FEF2F2', icon: 'close-circle-outline' as const, label: 'Rejected' };
  if (item.status === 'changes_requested') return { color: '#F59E0B', backgroundColor: '#FEF3C7', icon: 'file-edit-outline' as const, label: 'Changes requested' };
  if (item.amount?.startsWith('+')) return { color: '#10B981', backgroundColor: '#D1FAE5', icon: 'arrow-down-left' as const, label: 'Money received' };
  return { color: '#64748B', backgroundColor: '#F1F5F9', icon: 'arrow-up-right' as const, label: 'Money sent' };
}

function getActivityCategory(item: ActivityItem) {
  return item.category ?? (item.status === 'completed' ? 'money' : 'decision');
}

function getActivityVisibility(item: ActivityItem) {
  return item.visibility ?? (getActivityCategory(item) === 'money' ? 'admin' : 'workspace');
}

export default function ActivityScreen() {
  const { activity, user } = useWorkspace();
  const [filter, setFilter] = useState<ActivityFilter>('all');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const permittedActivity = activity.filter((item) => getActivityVisibility(item) === 'workspace' || user.role === 'admin');
  const visibleActivity = filter === 'all' ? permittedActivity : permittedActivity.filter((item) => getActivityCategory(item) === filter);
  const decisionCount = permittedActivity.filter((item) => getActivityCategory(item) === 'decision').length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity</Text>
        <TouchableOpacity
          accessibilityLabel="Filter activity"
          accessibilityRole="button"
          accessibilityState={{ expanded: filtersVisible }}
          style={[styles.filterButton, filtersVisible && styles.filterButtonActive]}
          activeOpacity={0.7}
          onPress={() => setFiltersVisible((current) => !current)}
        >
          <MaterialCommunityIcons name="filter-variant" size={24} color="#0F172A" />
          {filter !== 'all' ? <View style={styles.filterDot} /> : null}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryCard}>
          <View>
            <Text style={styles.summaryValue}>{permittedActivity.length}</Text>
            <Text style={styles.summaryLabel}>Visible events</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View>
            <Text style={styles.summaryValue}>{decisionCount}</Text>
            <Text style={styles.summaryLabel}>Decisions</Text>
          </View>
          <View style={styles.summaryIcon}>
            <MaterialCommunityIcons name="shield-check-outline" size={24} color="#8B5CF6" />
          </View>
        </View>

        {filtersVisible ? <View style={styles.filters}>
          {filters.map((item) => {
            const selected = filter === item.value;
            const unavailable = item.value === 'money' && user.role !== 'admin';
            return <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={{ disabled: unavailable, selected }}
              activeOpacity={0.7}
              disabled={unavailable}
              key={item.value}
              onPress={() => setFilter(item.value)}
              style={[styles.filterOption, selected && styles.filterOptionSelected, unavailable && styles.filterOptionDisabled]}
            >
              <Text style={[styles.filterOptionText, selected && styles.filterOptionTextSelected]}>{item.label}</Text>
            </TouchableOpacity>;
          })}
        </View> : null}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Workspace Audit Trail</Text>
            <Text style={styles.sectionSubtitle}>{filter === 'all' ? 'All visible workspace events' : `${filters.find((item) => item.value === filter)?.label} only`}</Text>
          </View>
          <Text style={styles.resultCount}>{visibleActivity.length}</Text>
        </View>

        {visibleActivity.length === 0 ? <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <MaterialCommunityIcons name="text-box-search-outline" size={28} color="#8B5CF6" />
          </View>
          <Text style={styles.emptyTitle}>No matching activity</Text>
          <Text style={styles.emptyText}>Events in this category will appear here.</Text>
        </View> : <View style={styles.card}>
          {visibleActivity.map((item, index) => {
            const presentation = getActivityStyle(item);
            const expanded = expandedId === item.id;
            return <View key={item.id}>
              <TouchableOpacity
                accessibilityLabel={`${item.title}. ${presentation.label}. ${item.createdAt}`}
                accessibilityRole="button"
                accessibilityState={{ expanded }}
                activeOpacity={0.7}
                onPress={() => setExpandedId(expanded ? null : item.id)}
                style={styles.row}
              >
                <View style={styles.rowLeft}>
                  <View style={[styles.iconBox, { backgroundColor: presentation.backgroundColor }]}>
                    <MaterialCommunityIcons 
                      name={presentation.icon}
                      size={20} 
                      color={presentation.color}
                    />
                  </View>
                  <View style={styles.activityCopy}>
                    <Text style={styles.txName}>{item.title}</Text>
                    <Text style={styles.txCategory}>{item.detail} • {item.createdAt}</Text>
                  </View>
                </View>
                <View style={styles.rowRight}>
                  {item.amount ? <Text style={[styles.txAmount, { color: presentation.color }]}>{item.amount}</Text> : null}
                  <MaterialCommunityIcons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color="#94A3B8" />
                </View>
              </TouchableOpacity>
              {expanded ? <View style={styles.expandedDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Event</Text>
                  <Text style={styles.detailValue}>{presentation.label}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Category</Text>
                  <Text style={styles.detailValue}>{getActivityCategory(item) === 'money' ? 'Financial' : 'Approval decision'}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Visibility</Text>
                  <Text style={styles.detailValue}>{getActivityVisibility(item) === 'admin' ? 'Workspace Admins' : 'Workspace members'}</Text>
                </View>
              </View> : null}
              {index < visibleActivity.length - 1 && <View style={styles.divider} />}
            </View>
          })}
        </View>}
        {user.role !== 'admin' ? <View style={styles.accessNote}>
          <MaterialCommunityIcons name="lock-outline" size={18} color="#64748B" />
          <Text style={styles.accessNoteText}>Financial events are limited to Workspace Admins.</Text>
        </View> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 40, paddingBottom: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  // MATCHING TYPOGRAPHY:
  title: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  filterButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  filterButtonActive: { backgroundColor: '#EDE9FE' },
  filterDot: { backgroundColor: '#8B5CF6', borderColor: '#FFFFFF', borderRadius: 5, borderWidth: 2, height: 10, position: 'absolute', right: 2, top: 2, width: 10 },
  
  content: { padding: 20 },
  summaryCard: { alignItems: 'center', backgroundColor: '#1E293B', borderRadius: 16, flexDirection: 'row', marginBottom: 16, padding: 18 },
  summaryValue: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  summaryLabel: { color: '#CBD5E1', fontSize: 12, marginTop: 2 },
  summaryDivider: { alignSelf: 'stretch', backgroundColor: '#334155', marginHorizontal: 20, width: 1 },
  summaryIcon: { alignItems: 'center', backgroundColor: '#F5F3FF', borderRadius: 12, height: 44, justifyContent: 'center', marginLeft: 'auto', width: 44 },
  filters: { backgroundColor: '#E2E8F0', borderRadius: 12, flexDirection: 'row', marginBottom: 20, padding: 4 },
  filterOption: { alignItems: 'center', borderRadius: 10, flex: 1, justifyContent: 'center', minHeight: 40, paddingHorizontal: 6 },
  filterOptionSelected: { backgroundColor: '#FFFFFF' },
  filterOptionDisabled: { opacity: 0.4 },
  filterOptionText: { color: '#64748B', fontSize: 13, fontWeight: '600' },
  filterOptionTextSelected: { color: '#0F172A' },
  sectionHeader: { alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingHorizontal: 4 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' },
  sectionSubtitle: { color: '#64748B', fontSize: 12, marginTop: 3 },
  resultCount: { backgroundColor: '#EDE9FE', borderRadius: 12, color: '#8B5CF6', fontSize: 12, fontWeight: '700', minWidth: 24, overflow: 'hidden', paddingHorizontal: 8, paddingVertical: 4, textAlign: 'center' },
  
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 64, paddingVertical: 12 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  activityCopy: { flex: 1, paddingRight: 12 },
  iconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  
  // MATCHING TYPOGRAPHY:
  txName: { fontSize: 16, fontWeight: '600', color: '#0F172A' },
  txCategory: { fontSize: 13, color: '#64748B', marginTop: 2 },
  txAmount: { fontSize: 15, fontWeight: '700' },
  rowRight: { alignItems: 'flex-end', gap: 4 },
  expandedDetails: { backgroundColor: '#F8FAFC', borderRadius: 12, marginBottom: 12, marginLeft: 52, padding: 12 },
  detailItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  detailLabel: { color: '#94A3B8', fontSize: 12 },
  detailValue: { color: '#475569', flex: 1, fontSize: 12, fontWeight: '600', marginLeft: 12, textAlign: 'right' },
  
  divider: { height: 1, backgroundColor: '#F1F5F9', marginLeft: 52 },
  emptyState: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: 20, borderWidth: 1, paddingHorizontal: 24, paddingVertical: 48 },
  emptyIcon: { alignItems: 'center', backgroundColor: '#EDE9FE', borderRadius: 16, height: 56, justifyContent: 'center', width: 56 },
  emptyTitle: { color: '#0F172A', fontSize: 17, fontWeight: '700', marginTop: 16 },
  emptyText: { color: '#64748B', fontSize: 14, marginTop: 6, textAlign: 'center' },
  accessNote: { alignItems: 'center', flexDirection: 'row', gap: 8, marginTop: 16, paddingHorizontal: 8 },
  accessNoteText: { color: '#64748B', flex: 1, fontSize: 12, lineHeight: 17 },
});