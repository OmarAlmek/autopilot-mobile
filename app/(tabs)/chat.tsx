import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Modal, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useWorkspace } from '../../src/context/WorkspaceContext';

export default function ChatHubScreen() {
  const router = useRouter();
  const { chatThreads, can, canAccessThread, addTeamMember } = useWorkspace();
  const [modalVisible, setModalVisible] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const accessibleThreads = chatThreads.filter((thread) => canAccessThread(thread.id));
  const agents = accessibleThreads.filter((thread) => thread.kind === 'agent');
  const teamMembers = accessibleThreads.filter((thread) => thread.kind === 'teammate');
  const canManageTeam = can('manageTeam');

  const handleCreateMember = () => {
    const threadId = addTeamMember(newMemberName, newMemberRole);
    if (!threadId) return;
    setNewMemberName(''); setNewMemberRole(''); setModalVisible(false);
    openChat(threadId);
  };

  const openChat = (threadId: string) => {
    router.push({ pathname: '/message', params: { threadId } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity
          style={[styles.addButton, !canManageTeam && styles.addButtonDisabled]}
          onPress={() => setModalVisible(true)}
          disabled={!canManageTeam}
          activeOpacity={0.7}
          accessibilityLabel={canManageTeam ? 'Add team member' : 'Only admins can add team members'}
        >
          <MaterialCommunityIcons name="account-plus-outline" size={22} color={canManageTeam ? '#8B5CF6' : '#94A3B8'} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>AI Agents</Text>
        
        {agents.map((agent, index) => {
          const latestMessage = agent.messages[agent.messages.length - 1];
          return (
            <View key={agent.id}>
              <TouchableOpacity style={styles.chatRow} activeOpacity={0.7} onPress={() => openChat(agent.id)}>
                <View style={[styles.avatar, { backgroundColor: '#EDE9FE' }]}><MaterialCommunityIcons name="robot-outline" size={24} color="#8B5CF6" />{agent.online && <View style={styles.onlineBadge} />}</View>
                <View style={styles.chatDetails}>
                  <View style={styles.chatHeader}><Text style={styles.chatName}>{agent.name} ({agent.role})</Text><Text style={styles.chatTime}>{latestMessage?.createdAt}</Text></View>
                  <Text style={styles.chatPreview} numberOfLines={1}>{latestMessage?.text}</Text>
                </View>
              </TouchableOpacity>
              {index < agents.length - 1 && <View style={styles.divider} />}
            </View>
          );
        })}

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Company Team</Text>

        {teamMembers.map((member, index) => (
          <View key={member.id}>
            <TouchableOpacity style={styles.chatRow} activeOpacity={0.7} onPress={() => openChat(member.id)}>
              <View style={[styles.avatar, { backgroundColor: '#F1F5F9' }]}><MaterialCommunityIcons name="account-outline" size={24} color="#64748B" />{member.online && <View style={styles.onlineBadge} />}</View>
              <View style={styles.chatDetails}>
                <View style={styles.chatHeader}>
                  <View><Text style={styles.chatName}>{member.name}</Text><Text style={styles.roleSubtext}>{member.role}</Text></View>
                  <Text style={styles.chatTime}>{member.messages[member.messages.length - 1]?.createdAt}</Text>
                </View>
                <Text style={styles.chatPreview} numberOfLines={1}>{member.messages[member.messages.length - 1]?.text}</Text>
              </View>
            </TouchableOpacity>
            {index < teamMembers.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </ScrollView>

      {/* Modern Overlay Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Team Member</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}><MaterialCommunityIcons name="close" size={24} color="#64748B" /></TouchableOpacity>
            </View>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput style={styles.input} placeholder="e.g. Liam Sterling" placeholderTextColor="#94A3B8" value={newMemberName} onChangeText={setNewMemberName} />
            <Text style={styles.inputLabel}>Role / Department</Text>
            <TextInput style={styles.input} placeholder="e.g. Head of Growth" placeholderTextColor="#94A3B8" value={newMemberRole} onChangeText={setNewMemberRole} />
            <TouchableOpacity style={styles.createButton} onPress={handleCreateMember}><Text style={styles.createButtonText}>Add Teammate</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ... Keep your identical StyleSheet here
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 40, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  title: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  addButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center' },
  addButtonDisabled: { backgroundColor: '#F1F5F9' },
  content: { paddingVertical: 12 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', paddingHorizontal: 20, marginBottom: 8 },
  chatRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 20 },
  avatar: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginRight: 16, position: 'relative' },
  onlineBadge: { position: 'absolute', right: 0, bottom: 0, width: 14, height: 14, borderRadius: 7, backgroundColor: '#10B981', borderWidth: 2, borderColor: '#FFFFFF' },
  chatDetails: { flex: 1, justifyContent: 'center' },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  chatName: { fontSize: 16, fontWeight: '600', color: '#0F172A' },
  roleSubtext: { fontSize: 11, color: '#94A3B8', fontWeight: '500', marginTop: 1 },
  chatTime: { fontSize: 12, color: '#64748B' },
  chatPreview: { fontSize: 14, color: '#64748B', paddingRight: 16, marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginLeft: 86, marginRight: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 380 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A' },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: 8 },
  input: { backgroundColor: '#F1F5F9', borderRadius: 12, padding: 14, fontSize: 16, color: '#0F172A', marginBottom: 20 },
  createButton: { backgroundColor: '#8B5CF6', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 10 },
  createButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});