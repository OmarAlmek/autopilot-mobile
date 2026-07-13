import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ActivityScreen() {
  const transactions = [
    { id: '1', name: 'Stripe Payout', category: 'Revenue', amount: '+$12,450.00', date: 'Today, 9:41 AM', type: 'in' },
    { id: '2', name: 'AWS Cloud Services', category: 'Infrastructure', amount: '-$890.00', date: 'Yesterday', type: 'out' },
    { id: '3', name: 'Gusto Payroll', category: 'Team', amount: '-$24,200.00', date: 'Oct 12', type: 'out' },
    { id: '4', name: 'Apple Store', category: 'Equipment', amount: '-$2,499.00', date: 'Oct 10', type: 'out' },
    { id: '5', name: 'Wire Transfer', category: 'Investment', amount: '+$50,000.00', date: 'Oct 8', type: 'in' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity</Text>
        <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
          <MaterialCommunityIcons name="filter-variant" size={24} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        
        <View style={styles.card}>
          {transactions.map((tx, index) => (
            <View key={tx.id}>
              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <View style={[styles.iconBox, { backgroundColor: tx.type === 'in' ? '#D1FAE5' : '#F1F5F9' }]}>
                    <MaterialCommunityIcons 
                      name={tx.type === 'in' ? 'arrow-bottom-left' : 'arrow-top-right'} 
                      size={20} 
                      color={tx.type === 'in' ? '#10B981' : '#64748B'} 
                    />
                  </View>
                  <View>
                    <Text style={styles.txName}>{tx.name}</Text>
                    <Text style={styles.txCategory}>{tx.category} • {tx.date}</Text>
                  </View>
                </View>
                <Text style={[styles.txAmount, { color: tx.type === 'in' ? '#10B981' : '#0F172A' }]}>
                  {tx.amount}
                </Text>
              </View>
              {index < transactions.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
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
  
  content: { padding: 20 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 12, paddingLeft: 4 },
  
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  
  // MATCHING TYPOGRAPHY:
  txName: { fontSize: 16, fontWeight: '600', color: '#0F172A' },
  txCategory: { fontSize: 13, color: '#64748B', marginTop: 2 },
  txAmount: { fontSize: 16, fontWeight: '700' },
  
  divider: { height: 1, backgroundColor: '#F1F5F9', marginLeft: 52 },
});