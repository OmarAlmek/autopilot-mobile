import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ActionItem {
  id: string;
  type: 'invoice' | 'access' | 'budget';
  title: string;
  subtitle: string;
  amount?: string;
  requester: string;
  time: string;
}

export default function ActionsScreen() {
  const [actions, setActions] = useState<ActionItem[]>([
    {
      id: '1',
      type: 'invoice',
      title: 'Q3 Marketing Invoice',
      subtitle: 'AdPulse Media',
      amount: '$4,200.00',
      requester: 'Sarah (Finance AI)',
      time: '10m ago',
    },
    {
      id: '2',
      type: 'invoice',
      title: 'AWS Hosting Subscription',
      subtitle: 'Cloud Infrastructure',
      amount: '$890.00',
      requester: 'Sarah (Finance AI)',
      time: '1h ago',
    },
    {
      id: '3',
      type: 'access',
      title: 'Production Database Access',
      subtitle: 'Elevated Permissions',
      requester: 'Maya Lin (via Ramsey AI)',
      time: '2h ago',
    }
  ]);

  const handleAction = (id: string, actionType: 'approve' | 'reject') => {
    // Trigger a smooth native collapse animation
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    // Remove the item from the list
    setActions((prev) => prev.filter(item => item.id !== id));
  };

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
          <Text style={styles.subtitle}>Review and execute tasks</Text>
        </View>
        <View style={styles.badgeCount}>
          <Text style={styles.badgeText}>{actions.length}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {actions.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <MaterialCommunityIcons name="check-all" size={48} color="#10B981" />
            </View>
            <Text style={styles.emptyStateTitle}>You're all caught up!</Text>
            <Text style={styles.emptyStateSub}>No pending approvals at this time.</Text>
          </View>
        ) : (
          actions.map((item) => {
            const iconConfig = getIconForType(item.type);
            
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

                <View style={styles.divider} />

                <View style={styles.cardFooter}>
                  <Text style={styles.requesterText}>Requested by {item.requester}</Text>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={[styles.btn, styles.rejectBtn]} 
                      onPress={() => handleAction(item.id, 'reject')}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons name="close" size={18} color="#EF4444" />
                      <Text style={styles.rejectBtnText}>Reject</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.btn, styles.approveBtn]} 
                      onPress={() => handleAction(item.id, 'approve')}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons name="check" size={18} color="#FFFFFF" />
                      <Text style={styles.approveBtnText}>Approve</Text>
                    </TouchableOpacity>
                  </View>
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
  
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  requesterText: { fontSize: 13, color: '#64748B', flex: 1, paddingRight: 10 },
  
  actionButtons: { flexDirection: 'row', gap: 8 },
  btn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12 },
  rejectBtn: { backgroundColor: '#FEF2F2' },
  rejectBtnText: { color: '#EF4444', fontWeight: '600', marginLeft: 4, fontSize: 14 },
  approveBtn: { backgroundColor: '#10B981', shadowColor: '#10B981', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
  approveBtnText: { color: '#FFFFFF', fontWeight: '600', marginLeft: 4, fontSize: 14 },

  // Empty State Styling
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyIconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#D1FAE5', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  emptyStateTitle: { fontSize: 22, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  emptyStateSub: { fontSize: 16, color: '#64748B', textAlign: 'center' }
});