import React, { useDeferredValue, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '../../src/components/common/ScreenHeader';
import { useWorkspace } from '../../src/context/WorkspaceContext';
import { colors, radii, spacing, typography } from '../../src/theme/tokens';

export default function ChatHubScreen() {
  const router = useRouter();
  const { chatThreads, can, canAccessThread, addTeamMember } = useWorkspace();
  const [modalVisible, setModalVisible] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery.trim().toLowerCase());
  const accessibleThreads = chatThreads.filter((thread) => canAccessThread(thread.id));
  const filteredThreads = accessibleThreads.filter((thread) => {
    const latestMessage = thread.messages[thread.messages.length - 1];
    return !deferredSearchQuery || [thread.name, thread.role, latestMessage?.text].some((value) => value?.toLowerCase().includes(deferredSearchQuery));
  });
  const agents = filteredThreads.filter((thread) => thread.kind === 'agent');
  const teamMembers = filteredThreads.filter((thread) => thread.kind === 'teammate');
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
      <ScreenHeader
        title="Messages"
        subtitle="Your team and workspace agents"
        trailing={(
          <TouchableOpacity
            style={[styles.addButton, !canManageTeam && styles.addButtonDisabled]}
            onPress={() => setModalVisible(true)}
            disabled={!canManageTeam}
            activeOpacity={0.7}
            accessibilityLabel={canManageTeam ? 'Add team member' : 'Only admins can add team members'}
          >
            <MaterialCommunityIcons name="account-plus-outline" size={21} color={canManageTeam ? colors.accent : colors.textTertiary} />
          </TouchableOpacity>
        )}
      />

      <View style={styles.searchWrap}>
        <MaterialCommunityIcons name="magnify" size={20} color={colors.textTertiary} />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search conversations"
          placeholderTextColor={colors.textTertiary}
          returnKeyType="search"
          accessibilityLabel="Search conversations"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearch} accessibilityLabel="Clear search">
            <MaterialCommunityIcons name="close-circle" size={19} color={colors.textTertiary} />
          </TouchableOpacity>
        ) : null}
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {agents.length > 0 ? <Text style={styles.sectionTitle}>Workspace Agents</Text> : null}
        
        {agents.map((agent, index) => {
          const latestMessage = agent.messages[agent.messages.length - 1];
          return (
            <View key={agent.id}>
              <TouchableOpacity style={styles.chatRow} activeOpacity={0.7} onPress={() => openChat(agent.id)}>
                <View style={[styles.avatar, styles.agentAvatar]}><MaterialCommunityIcons name="robot-outline" size={23} color={colors.accent} />{agent.online && <View style={styles.onlineBadge} />}</View>
                <View style={styles.chatDetails}>
                  <View style={styles.chatHeader}>
                    <View style={styles.nameRow}><Text style={styles.chatName}>{agent.name}</Text><View style={styles.aiBadge}><Text style={styles.aiBadgeText}>AI</Text></View></View>
                    <Text style={styles.chatTime}>{latestMessage?.createdAt}</Text>
                  </View>
                  <Text style={styles.roleSubtext}>{agent.role}</Text>
                  <Text style={styles.chatPreview} numberOfLines={1}>{latestMessage?.text}</Text>
                </View>
              </TouchableOpacity>
              {index < agents.length - 1 && <View style={styles.divider} />}
            </View>
          );
        })}

        {teamMembers.length > 0 ? <Text style={[styles.sectionTitle, styles.teamSection]}>Company Team</Text> : null}

        {teamMembers.map((member, index) => (
          <View key={member.id}>
            <TouchableOpacity style={styles.chatRow} activeOpacity={0.7} onPress={() => openChat(member.id)}>
              <View style={[styles.avatar, styles.memberAvatar]}><MaterialCommunityIcons name="account-outline" size={23} color={colors.textSecondary} />{member.online && <View style={styles.onlineBadge} />}</View>
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

        {filteredThreads.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}><MaterialCommunityIcons name="text-search" size={27} color={colors.textSecondary} /></View>
            <Text style={styles.emptyTitle}>No conversations found</Text>
            <Text style={styles.emptyText}>Try a name, role, or phrase from a recent message.</Text>
          </View>
        ) : null}
      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalKeyboard}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Team Member</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton} accessibilityLabel="Close"><MaterialCommunityIcons name="close" size={22} color={colors.textSecondary} /></TouchableOpacity>
            </View>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput style={styles.input} placeholder="e.g. Liam Sterling" placeholderTextColor="#94A3B8" value={newMemberName} onChangeText={setNewMemberName} />
            <Text style={styles.inputLabel}>Role / Department</Text>
            <TextInput style={styles.input} placeholder="e.g. Head of Growth" placeholderTextColor="#94A3B8" value={newMemberRole} onChangeText={setNewMemberRole} />
            <TouchableOpacity style={styles.createButton} onPress={handleCreateMember}><Text style={styles.createButtonText}>Add Teammate</Text></TouchableOpacity>
          </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  addButton: { width: 44, height: 44, borderRadius: radii.control, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  addButtonDisabled: { backgroundColor: colors.surfaceSubtle },
  searchWrap: { height: 48, flexDirection: 'row', alignItems: 'center', marginHorizontal: spacing[5], marginBottom: spacing[5], paddingHorizontal: spacing[4], backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.control },
  searchInput: { flex: 1, height: '100%', marginLeft: spacing[2], color: colors.textPrimary, fontSize: 15 },
  clearSearch: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  content: { paddingBottom: spacing[8] },
  sectionTitle: { ...typography.label, color: colors.textTertiary, textTransform: 'uppercase', paddingHorizontal: spacing[5], marginBottom: spacing[2] },
  teamSection: { marginTop: spacing[6] },
  chatRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing[3], paddingHorizontal: spacing[5], minHeight: 76 },
  avatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: spacing[3], position: 'relative' },
  agentAvatar: { backgroundColor: colors.accentSoft },
  memberAvatar: { backgroundColor: colors.surfaceSubtle },
  onlineBadge: { position: 'absolute', right: 0, bottom: 0, width: 13, height: 13, borderRadius: 7, backgroundColor: colors.success, borderWidth: 2, borderColor: colors.canvas },
  chatDetails: { flex: 1, justifyContent: 'center' },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', flex: 1, minWidth: 0 },
  chatName: { ...typography.itemTitle, color: colors.textPrimary, flexShrink: 1 },
  aiBadge: { backgroundColor: colors.accentSoft, borderRadius: radii.pill, paddingHorizontal: 7, paddingVertical: 2, marginLeft: spacing[2] },
  aiBadgeText: { fontSize: 10, color: colors.accent, fontWeight: '800' },
  roleSubtext: { ...typography.micro, color: colors.textTertiary, marginTop: 1 },
  chatTime: { ...typography.micro, color: colors.textTertiary, marginLeft: spacing[2] },
  chatPreview: { ...typography.supporting, color: colors.textSecondary, paddingRight: spacing[3], marginTop: 3 },
  divider: { height: 1, backgroundColor: colors.divider, marginLeft: 80, marginRight: spacing[5] },
  emptyState: { alignItems: 'center', paddingHorizontal: spacing[8], paddingTop: spacing[10] },
  emptyIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.surfaceSubtle, alignItems: 'center', justifyContent: 'center', marginBottom: spacing[4] },
  emptyTitle: { ...typography.itemTitle, color: colors.textPrimary, textAlign: 'center' },
  emptyText: { ...typography.supporting, color: colors.textSecondary, textAlign: 'center', marginTop: spacing[2], lineHeight: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'flex-end' },
  modalKeyboard: { width: '100%' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: radii.feature, borderTopRightRadius: radii.feature, padding: spacing[6], minHeight: 380 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[6] },
  modalTitle: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  closeButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceSubtle, alignItems: 'center', justifyContent: 'center' },
  inputLabel: { ...typography.micro, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', marginBottom: spacing[2] },
  input: { backgroundColor: colors.surfaceSubtle, borderRadius: radii.control, padding: 14, fontSize: 16, color: colors.textPrimary, marginBottom: spacing[5] },
  createButton: { backgroundColor: colors.accent, borderRadius: radii.control, paddingVertical: spacing[4], alignItems: 'center', marginTop: spacing[2] },
  createButtonText: { color: colors.inverse, fontSize: 16, fontWeight: '700' },
});