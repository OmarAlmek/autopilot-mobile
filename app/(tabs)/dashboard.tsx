import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const router = useRouter();

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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section with Working Settings Link */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>Eden Mea</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileAvatar}
            onPress={() => router.push('/settings')}
            activeOpacity={0.7}
          >
            <Text style={styles.profileInitials}>OA</Text>
          </TouchableOpacity>
        </View>

        {/* Business KPI Cards (Horizontal Scroll) */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.kpiContainer}
          snapToInterval={width * 0.45 + 16}
          decelerationRate="fast"
        >
          {/* Restored: Available Cash Card */}
          <View style={[styles.kpiCard, styles.kpiCardPrimary]}>
            <View style={styles.kpiIconWrapper}>
              <MaterialCommunityIcons name="bank" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.kpiLabelLight}>Available Cash</Text>
            <Text style={styles.kpiValueLight}>$142,500</Text>
            <Text style={styles.kpiTrendLight}>Across 2 accounts</Text>
          </View>

          {/* Restored: Monthly Burn/Expenses */}
          <View style={styles.kpiCard}>
            <View style={[styles.kpiIconWrapper, { backgroundColor: '#F1F5F9' }]}>
              <MaterialCommunityIcons name="trending-down" size={24} color="#64748B" />
            </View>
            <Text style={styles.kpiLabel}>Monthly Burn</Text>
            <Text style={styles.kpiValue}>$38,200</Text>
            <Text style={styles.kpiTrendDark}>Under budget by 4%</Text>
          </View>

          {/* Action Workflow Link */}
          <View style={styles.kpiCard}>
            <View style={[styles.kpiIconWrapper, { backgroundColor: '#FEF2F2' }]}>
              <MaterialCommunityIcons name="lightning-bolt" size={24} color="#EF4444" />
            </View>
            <Text style={styles.kpiLabel}>Pending Actions</Text>
            <Text style={styles.kpiValue}>3 Items</Text>
            <Text style={[styles.kpiTrendDark, { color: '#EF4444' }]}>Requires approval</Text>
          </View>
        </ScrollView>

        {/* Custom Bar Chart Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Weekly Cashflow</Text>
            <TouchableOpacity>
              <MaterialCommunityIcons name="dots-horizontal" size={24} color="#94A3B8" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.chartCard}>
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
          </View>
        </View>

        {/* Quick Jump Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Navigation</Text>
          <View style={styles.quickNavGrid}>
            <TouchableOpacity 
              style={styles.quickNavCard}
              onPress={() => router.push('/(tabs)/actions')}
              activeOpacity={0.7}
            >
              <View style={[styles.quickNavIcon, { backgroundColor: '#FEF2F2' }]}>
                <MaterialCommunityIcons name="lightning-bolt" size={24} color="#EF4444" />
              </View>
              <Text style={styles.quickNavText}>Review Actions</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickNavCard}
              onPress={() => router.push('/(tabs)/transactions')}
              activeOpacity={0.7}
            >
              <View style={[styles.quickNavIcon, { backgroundColor: '#F0FDF4' }]}>
                <MaterialCommunityIcons name="format-list-bulleted" size={24} color="#10B981" />
              </View>
              <Text style={styles.quickNavText}>View Activity</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  scrollContent: { paddingBottom: 40 },
  
  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 40, paddingBottom: 24 },
  greeting: { fontSize: 16, color: '#64748B', marginBottom: 4 },
  userName: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  profileAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  profileInitials: { fontSize: 16, fontWeight: '700', color: '#475569' },

  // KPI Cards
  kpiContainer: { paddingHorizontal: 20, paddingBottom: 16, gap: 16 },
  kpiCard: { width: width * 0.42, backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  kpiCardPrimary: { backgroundColor: '#8B5CF6', shadowColor: '#8B5CF6', shadowOpacity: 0.2 },
  kpiIconWrapper: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  kpiLabel: { fontSize: 13, fontWeight: '600', color: '#64748B', marginBottom: 8 },
  kpiLabelLight: { fontSize: 13, fontWeight: '600', color: '#DDD6FE', marginBottom: 8 },
  kpiValue: { fontSize: 24, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  kpiValueLight: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  kpiTrendDark: { fontSize: 12, color: '#94A3B8', fontWeight: '500' },
  kpiTrendLight: { fontSize: 12, color: '#A78BFA', fontWeight: '500' },

  // Sections
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 16 },

  // Chart Card
  chartCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  chartTotal: { fontSize: 32, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  chartSubtext: { fontSize: 14, color: '#64748B', marginBottom: 32 },
  
  barsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 160 },
  barColumn: { alignItems: 'center', width: 32 },
  barTrack: { height: 120, width: 12, backgroundColor: '#F8F9FB', borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden', marginBottom: 12 },
  barFill: { width: '100%', borderRadius: 6 },
  barLabel: { fontSize: 12, color: '#94A3B8', fontWeight: '500' },

  // Quick Navigation Grid
  quickNavGrid: { flexDirection: 'row', gap: 16 },
  quickNavCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, alignItems: 'center', flexDirection: 'row', shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  quickNavIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  quickNavText: { fontSize: 15, fontWeight: '600', color: '#0F172A' },
});