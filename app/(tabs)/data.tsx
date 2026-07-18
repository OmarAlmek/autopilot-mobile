import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function DataScreen() {
  const connectedSources = [
    { id: '1', name: 'Stripe', type: 'Payment Gateway', status: 'Connected', lastSync: '10 mins ago', icon: 'credit-card', color: '#635BFF', bg: '#EEECFF' },
    { id: '2', name: 'QuickBooks', type: 'Accounting', status: 'Connected', lastSync: '1 hour ago', icon: 'finance', color: '#2CA01C', bg: '#EAF5E8' },
    { id: '3', name: 'AWS S3', type: 'Cloud Storage', status: 'Syncing...', lastSync: 'In progress', icon: 'aws', color: '#FF9900', bg: '#FFF5E5' },
  ];

  const recentDocuments = [
    { id: '1', name: 'Q3_Financial_Report.pdf', size: '2.4 MB', date: 'Oct 12' },
    { id: '2', name: 'Employee_Handbook_2026.docx', size: '1.1 MB', date: 'Oct 10' },
    { id: '3', name: 'Vendor_Contracts_Archive.zip', size: '14.8 MB', date: 'Oct 05' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Data & Context</Text>
          <Text style={styles.subtitle}>Manage Eden Mea's AI knowledge base</Text>
        </View>
        <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
          <MaterialCommunityIcons name="plus" size={24} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Storage / Memory Capacity Card */}
        <View style={styles.storageCard}>
          <View style={styles.storageHeader}>
            <View style={styles.storageIconBox}>
              <MaterialCommunityIcons name="brain" size={24} color="#8B5CF6" />
            </View>
            <View style={styles.storageTextContainer}>
              <Text style={styles.storageTitle}>Workspace Memory</Text>
              <Text style={styles.storageSubtitle}>45.2 GB / 100 GB Used</Text>
            </View>
          </View>
          
          {/* Custom Progress Bar representation */}
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: '45%' }]} />
          </View>
          <Text style={styles.storageFootnote}>Your AI agents have processed 12,402 data points this month.</Text>
        </View>

        {/* Connected Integrations Section */}
        <Text style={styles.sectionTitle}>Connected Integrations</Text>
        <View style={styles.cardGroup}>
          {connectedSources.map((source, index) => (
            <View key={source.id}>
              <TouchableOpacity style={styles.row} activeOpacity={0.7}>
                <View style={[styles.iconBox, { backgroundColor: source.bg }]}>
                  <MaterialCommunityIcons name={source.icon as any} size={24} color={source.color} />
                </View>
                <View style={styles.rowCenter}>
                  <Text style={styles.itemName}>{source.name}</Text>
                  <Text style={styles.itemSubtitle}>{source.type}</Text>
                </View>
                <View style={styles.rowRight}>
                  <Text style={[styles.statusText, source.status === 'Syncing...' && { color: '#F59E0B' }]}>
                    {source.status}
                  </Text>
                  <Text style={styles.syncText}>Sync: {source.lastSync}</Text>
                </View>
              </TouchableOpacity>
              {index < connectedSources.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Uploaded Documents Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Trained Documents</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardGroup}>
          {recentDocuments.map((doc, index) => (
            <View key={doc.id}>
              <TouchableOpacity style={styles.row} activeOpacity={0.7}>
                <View style={[styles.iconBox, { backgroundColor: '#F1F5F9' }]}>
                  <MaterialCommunityIcons name="file-document-outline" size={24} color="#64748B" />
                </View>
                <View style={styles.rowCenter}>
                  <Text style={styles.itemName}>{doc.name}</Text>
                  <Text style={styles.itemSubtitle}>{doc.size} • Uploaded {doc.date}</Text>
                </View>
                <MaterialCommunityIcons name="dots-vertical" size={20} color="#94A3B8" />
              </TouchableOpacity>
              {index < recentDocuments.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 40, paddingBottom: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  title: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  subtitle: { fontSize: 15, color: '#64748B', marginTop: 4 },
  addButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  
  content: { padding: 20 },
  
  // Storage Card
  storageCard: { backgroundColor: '#1E293B', borderRadius: 24, padding: 20, marginBottom: 32, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
  storageHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  storageIconBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#2dd4bf15', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  storageTextContainer: { flex: 1 },
  storageTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  storageSubtitle: { fontSize: 14, color: '#94A3B8', marginTop: 4 },
  progressBarTrack: { height: 8, backgroundColor: '#334155', borderRadius: 4, overflow: 'hidden', marginBottom: 16 },
  progressBarFill: { height: '100%', backgroundColor: '#8B5CF6', borderRadius: 4 },
  storageFootnote: { fontSize: 13, color: '#94A3B8', lineHeight: 20 },

  // Sections
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 8 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 12, paddingLeft: 4 },
  viewAllText: { fontSize: 13, fontWeight: '600', color: '#8B5CF6' },
  
  // Lists
  cardGroup: { backgroundColor: '#FFFFFF', borderRadius: 20, paddingHorizontal: 16, marginBottom: 24, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  iconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  rowCenter: { flex: 1, paddingRight: 12 },
  itemName: { fontSize: 16, fontWeight: '600', color: '#0F172A', marginBottom: 4 },
  itemSubtitle: { fontSize: 13, color: '#64748B' },
  rowRight: { alignItems: 'flex-end' },
  statusText: { fontSize: 13, fontWeight: '600', color: '#10B981', marginBottom: 4 },
  syncText: { fontSize: 11, color: '#94A3B8' },
  
  divider: { height: 1, backgroundColor: '#F1F5F9', marginLeft: 60 },
});