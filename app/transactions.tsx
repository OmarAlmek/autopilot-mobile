import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

const allTransactions = [
  {
    id: '1',
    category: 'Office & Rent',
    vendor: 'Downtown Properties LLC',
    amount: '-$12,000.00',
    date: 'Jul 1, 2026',
    status: 'paid',
    description: 'Monthly office rent — Floor 3, Cairo Business Park',
    approvedBy: 'Omar A.',
    type: 'expense',
  },
  {
    id: '2',
    category: 'Salaries',
    vendor: 'Payroll — July 2026',
    amount: '-$8,400.00',
    date: 'Jul 5, 2026',
    status: 'paid',
    description: 'Monthly salaries for 6 full-time employees',
    approvedBy: 'Omar A.',
    type: 'expense',
  },
  {
    id: '3',
    category: 'Vendors',
    vendor: 'Acme Corp',
    amount: '-$4,200.00',
    date: 'Jul 7, 2026',
    status: 'pending',
    description: 'Invoice #1042 — Office supplies and equipment',
    approvedBy: 'Pending approval',
    type: 'expense',
  },
  {
    id: '4',
    category: 'Subscriptions',
    vendor: 'Adobe Creative Cloud',
    amount: '-$890.00',
    date: 'Jul 8, 2026',
    status: 'paid',
    description: 'Annual subscription — Design team licenses',
    approvedBy: 'Auto-approved',
    type: 'expense',
  },
  {
    id: '5',
    category: 'Income',
    vendor: 'Client — TechStart Egypt',
    amount: '+$5,000.00',
    date: 'Jul 3, 2026',
    status: 'received',
    description: 'Payment for Q2 consulting services',
    approvedBy: 'Auto-recorded',
    type: 'income',
  },
  {
    id: '6',
    category: 'Income',
    vendor: 'Client — Gulf Ventures',
    amount: '+$3,200.00',
    date: 'Jul 6, 2026',
    status: 'received',
    description: 'Invoice #892 — Software development retainer',
    approvedBy: 'Auto-recorded',
    type: 'income',
  },
];

const statusColor = (status: string) => {
  if (status === 'paid' || status === 'received') return '#00C48C';
  if (status === 'pending') return '#FFA500';
  return '#AAA';
};

const statusBg = (status: string) => {
  if (status === 'paid' || status === 'received') return '#E0F8EE';
  if (status === 'pending') return '#FFF3E0';
  return '#F0F0F0';
};

export default function Transactions() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Transactions</Text>
          <Text style={styles.subtitle}>All spending and income</Text>
        </View>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>

        {/* Summary Row */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <MaterialCommunityIcons name="trending-up" size={16} color="#00C48C" />
            <Text style={styles.summaryLabel}>Total In</Text>
            <Text style={[styles.summaryValue, { color: '#00C48C' }]}>+$8,200</Text>
          </View>
          <View style={styles.summaryCard}>
            <MaterialCommunityIcons name="trending-down" size={16} color="#FF6B6B" />
            <Text style={styles.summaryLabel}>Total Out</Text>
            <Text style={[styles.summaryValue, { color: '#FF6B6B' }]}>-$25,490</Text>
          </View>
          <View style={styles.summaryCard}>
            <MaterialCommunityIcons name="swap-horizontal" size={16} color="#4B7BEC" />
            <Text style={styles.summaryLabel}>Net</Text>
            <Text style={[styles.summaryValue, { color: '#4B7BEC' }]}>-$17,290</Text>
          </View>
        </View>

        {/* Transaction List */}
        <Text style={styles.sectionTitle}>This Week</Text>
        {allTransactions.map((tx) => (
          <TouchableOpacity
            key={tx.id}
            style={[styles.txCard, selected === tx.id && styles.txCardExpanded]}
            onPress={() => setSelected(selected === tx.id ? null : tx.id)}
          >
            <View style={styles.txRow}>
              <View style={[styles.txIcon, { backgroundColor: tx.type === 'income' ? '#E0F8EE' : '#FFF0F0' }]}>
                <MaterialCommunityIcons
                  name={tx.type === 'income' ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'}
                  size={20}
                  color={tx.type === 'income' ? '#00C48C' : '#FF6B6B'}
                />
              </View>
              <View style={styles.txContent}>
                <Text style={styles.txVendor}>{tx.vendor}</Text>
                <Text style={styles.txCategory}>{tx.category} · {tx.date}</Text>
              </View>
              <View style={styles.txRight}>
                <Text style={[styles.txAmount, { color: tx.type === 'income' ? '#00C48C' : '#1A1A2E' }]}>
                  {tx.amount}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: statusBg(tx.status) }]}>
                  <Text style={[styles.statusText, { color: statusColor(tx.status) }]}>
                    {tx.status}
                  </Text>
                </View>
              </View>
            </View>

            {/* Expanded Detail */}
            {selected === tx.id && (
              <View style={styles.txDetail}>
                <View style={styles.detailDivider} />
                <View style={styles.detailRow}>
                  <MaterialCommunityIcons name="text-box-outline" size={14} color="#888" />
                  <Text style={styles.detailLabel}>Description</Text>
                </View>
                <Text style={styles.detailValue}>{tx.description}</Text>
                <View style={styles.detailRow}>
                  <MaterialCommunityIcons name="account-check-outline" size={14} color="#888" />
                  <Text style={styles.detailLabel}>Approved by</Text>
                </View>
                <Text style={styles.detailValue}>{tx.approvedBy}</Text>
                {tx.status === 'pending' && (
                  <TouchableOpacity style={styles.approveButton} onPress={() => router.push('/approvals')}>
                    <Text style={styles.approveButtonText}>Review & Approve →</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </TouchableOpacity>
        ))}

      </ScrollView>
    </View>
  );
}

import { useState } from 'react';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 20,
    backgroundColor: '#1A1A2E',
  },
  backButton: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },
  subtitle: { fontSize: 12, color: '#AAAACC', textAlign: 'center', marginTop: 2 },
  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  summaryCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12,
    padding: 12, alignItems: 'center', gap: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  summaryLabel: { fontSize: 11, color: '#888' },
  summaryValue: { fontSize: 14, fontWeight: '700' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A2E', marginBottom: 12 },
  txCard: {
    backgroundColor: '#FFFFFF', borderRadius: 14,
    padding: 16, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  txCardExpanded: { borderWidth: 1, borderColor: '#E0F0FF' },
  txRow: { flexDirection: 'row', alignItems: 'center' },
  txIcon: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  txContent: { flex: 1 },
  txVendor: { fontSize: 14, fontWeight: '600', color: '#1A1A2E', marginBottom: 2 },
  txCategory: { fontSize: 12, color: '#888' },
  txRight: { alignItems: 'flex-end', gap: 4 },
  txAmount: { fontSize: 14, fontWeight: '700' },
  statusBadge: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  statusText: { fontSize: 10, fontWeight: '600', textTransform: 'capitalize' },
  txDetail: { marginTop: 12 },
  detailDivider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  detailLabel: { fontSize: 12, color: '#888', fontWeight: '500' },
  detailValue: { fontSize: 13, color: '#1A1A2E', marginBottom: 10 },
  approveButton: {
    backgroundColor: '#1A1A2E', borderRadius: 8,
    padding: 12, alignItems: 'center', marginTop: 4,
  },
  approveButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 13 },
});