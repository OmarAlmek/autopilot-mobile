import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useWorkspace, type WorkspaceRole } from '../src/context/WorkspaceContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, setRole } = useWorkspace();

  const settingsOptions = [
    { icon: 'account-outline', title: 'Personal Information', subtitle: user.name },
    { icon: 'shield-check-outline', title: 'Security', subtitle: 'Password, 2FA, Biometrics' },
    { icon: 'bell-outline', title: 'Notifications', subtitle: 'Push & Email alerts' },
    { icon: 'credit-card-outline', title: 'Billing & Plans', subtitle: 'Pro Workspace', adminOnly: true },
  ].filter((option) => !option.adminOnly || user.role === 'admin');

  const roles: { label: string; value: WorkspaceRole }[] = [
    { label: 'Workspace Admin', value: 'admin' },
    { label: 'Team Member', value: 'member' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header matching the Message screen design */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</Text>
          </View>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileRole}>{user.role === 'admin' ? 'Workspace Admin' : 'Team Member'}</Text>
        </View>

        <Text style={styles.sectionLabel}>Demo Access</Text>
        <View style={styles.roleControl}>
          {roles.map((role) => {
            const selected = user.role === role.value;
            return <TouchableOpacity
              key={role.value}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              activeOpacity={0.7}
              onPress={() => setRole(role.value)}
              style={[styles.roleOption, selected && styles.roleOptionSelected]}
            >
              <Text style={[styles.roleOptionText, selected && styles.roleOptionTextSelected]}>{role.label}</Text>
            </TouchableOpacity>;
          })}
        </View>
        <Text style={styles.roleHelp}>Switch roles to verify financial visibility and approval permissions.</Text>

        {/* Settings List */}
        <Text style={styles.sectionLabel}>Account</Text>
        <View style={styles.settingsGroup}>
          {settingsOptions.map((option, index) => (
            <View key={index}>
              <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
                <View style={styles.settingIconBox}>
                  <MaterialCommunityIcons name={option.icon as any} size={22} color="#64748B" />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>{option.title}</Text>
                  <Text style={styles.settingSubtitle}>{option.subtitle}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#CBD5E1" />
              </TouchableOpacity>
              {index < settingsOptions.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  backBtn: { padding: 4 },
  
  // MATCHING TYPOGRAPHY:
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  
  content: { padding: 20 },
  
  profileCard: { alignItems: 'center', marginBottom: 32, paddingTop: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EDE9FE', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  avatarText: { fontSize: 28, fontWeight: '700', color: '#8B5CF6' },
  profileName: { fontSize: 24, fontWeight: '800', color: '#0F172A' },
  profileRole: { fontSize: 15, color: '#64748B', marginTop: 4 },

  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 12, paddingLeft: 4 },
  roleControl: { flexDirection: 'row', backgroundColor: '#E2E8F0', borderRadius: 12, padding: 4 },
  roleOption: { flex: 1, minHeight: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 10, paddingHorizontal: 8 },
  roleOptionSelected: { backgroundColor: '#FFFFFF' },
  roleOptionText: { fontSize: 13, fontWeight: '600', color: '#64748B', textAlign: 'center' },
  roleOptionTextSelected: { color: '#0F172A' },
  roleHelp: { fontSize: 13, color: '#64748B', lineHeight: 19, marginTop: 8, marginBottom: 24, paddingHorizontal: 4 },

  settingsGroup: { backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  settingIconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  settingTextContainer: { flex: 1 },
  settingTitle: { fontSize: 16, fontWeight: '600', color: '#0F172A' },
  settingSubtitle: { fontSize: 13, color: '#64748B', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginLeft: 72 },

  logoutButton: { marginTop: 32, paddingVertical: 16, borderRadius: 16, backgroundColor: '#FEF2F2', alignItems: 'center' },
  logoutText: { color: '#EF4444', fontSize: 16, fontWeight: '700' },
});