import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useWorkspace } from '../src/context/WorkspaceContext';
import { colors, radii, shadows, spacing, typography } from '../src/theme/tokens';

export default function MessageScreen() {
  const router = useRouter();
  const { threadId } = useLocalSearchParams<{ threadId?: string }>();
  const { user, chatThreads, canAccessThread, sendChatMessage } = useWorkspace();
  const thread = chatThreads.find((item) => item.id === threadId);
  const hasAccess = thread ? canAccessThread(thread.id) : false;

  const scrollViewRef = useRef<ScrollView>(null);
  const [inputText, setInputText] = useState('');

  const handleBack = () => {
    router.navigate('/(tabs)/chat');
  };

  const handleSend = () => {
    if (!thread || !inputText.trim()) return;
    const userMessageText = inputText.trim();
    if (!sendChatMessage(thread.id, userMessageText)) return;
    setInputText('');
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  if (!thread || !hasAccess) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn} activeOpacity={0.7} accessibilityLabel="Back to messages">
            <MaterialCommunityIcons name="arrow-left" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Messages</Text>
          <View style={{ width: 32 }} />
        </View>
        <View style={styles.unavailableState}>
          <View style={styles.unavailableIcon}>
            <MaterialCommunityIcons name="message-alert-outline" size={30} color={colors.textSecondary} />
          </View>
          <Text style={styles.unavailableTitle}>Conversation unavailable</Text>
          <Text style={styles.unavailableText}>This conversation may have been removed, or you may not have access to it.</Text>
          <TouchableOpacity style={styles.returnButton} onPress={handleBack}>
            <Text style={styles.returnButtonText}>Return to Messages</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const chatTitle = thread.name;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn} activeOpacity={0.7} accessibilityLabel="Back to messages">
            <MaterialCommunityIcons name="arrow-left" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <View style={styles.headerNameRow}>
              <Text style={styles.headerTitle} numberOfLines={1}>{chatTitle}</Text>
              {thread.kind === 'agent' ? <View style={styles.aiBadge}><Text style={styles.aiBadgeText}>AI</Text></View> : null}
            </View>
            <Text style={[styles.headerStatus, !thread.online && styles.headerStatusOffline]}>{thread.kind === 'agent' ? thread.role : thread.online ? 'Online' : thread.role}</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {thread.kind === 'agent' ? (
          <View style={styles.contextStrip}>
            <MaterialCommunityIcons name="database-outline" size={15} color={colors.textSecondary} />
            <Text style={styles.contextText}>Answers use your current workspace data</Text>
          </View>
        ) : null}

        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollArea}
          contentContainerStyle={styles.chatScroll}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          <View style={styles.dateRow}><View style={styles.dateLine} /><Text style={styles.dateLabel}>Today</Text><View style={styles.dateLine} /></View>

          {thread.messages.map((item, index) => {
            const isCurrentUser = item.authorId === user.id;
            const previousMessage = thread.messages[index - 1];
            const nextMessage = thread.messages[index + 1];
            const startsGroup = previousMessage?.authorId !== item.authorId;
            const endsGroup = nextMessage?.authorId !== item.authorId;
            return (
            <View key={item.id} style={[isCurrentUser ? styles.userMessageRow : styles.agentMessageRow, startsGroup ? styles.groupStart : styles.groupContinuation]}>
              {!isCurrentUser && startsGroup ? (
                <View style={[styles.avatar, thread.kind === 'agent' ? styles.agentAvatar : styles.memberAvatar]}>
                  <MaterialCommunityIcons name={thread.kind === 'agent' ? "robot-outline" : "account-outline"} size={18} color={thread.kind === 'agent' ? colors.accent : colors.textSecondary} />
                </View>
              ) : !isCurrentUser ? <View style={styles.avatarSpacer} /> : null}
              <View style={[isCurrentUser ? styles.userBubble : styles.agentBubble, !endsGroup && (isCurrentUser ? styles.userBubbleGrouped : styles.agentBubbleGrouped)]}>
                {!isCurrentUser && startsGroup ? <Text style={styles.messageAuthor}>{item.authorName}</Text> : null}
                <Text style={isCurrentUser ? styles.messageTextLight : styles.messageTextDark}>{item.text}</Text>
                {endsGroup ? <Text style={isCurrentUser ? styles.messageTimeLight : styles.messageTimeDark}>{item.createdAt}</Text> : null}
              </View>
            </View>
          );
          })}
        </ScrollView>

        <View style={styles.inputArea}>
          <View style={styles.inputShell}>
            <TextInput
              style={styles.textInput}
              placeholder={thread.kind === 'agent' ? `Ask ${thread.name} about your workspace` : 'Write a message'}
              placeholderTextColor={colors.textTertiary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              accessibilityLabel="Message"
            />
          </View>
          <TouchableOpacity style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]} onPress={handleSend} disabled={!inputText.trim()} activeOpacity={0.8} accessibilityLabel="Send message">
            <MaterialCommunityIcons name="arrow-up" size={20} color={colors.inverse} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  keyboardAvoid: { flex: 1 },
  
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 64, paddingHorizontal: spacing[4], paddingVertical: spacing[2], backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, zIndex: 10 },
  backBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  headerTitleContainer: { alignItems: 'center', flex: 1, minWidth: 0 },
  headerNameRow: { flexDirection: 'row', alignItems: 'center', maxWidth: '100%' },
  headerTitle: { ...typography.itemTitle, color: colors.textPrimary, flexShrink: 1 },
  aiBadge: { backgroundColor: colors.accentSoft, borderRadius: radii.pill, paddingHorizontal: 7, paddingVertical: 2, marginLeft: spacing[2] },
  aiBadgeText: { fontSize: 10, color: colors.accent, fontWeight: '800' },
  headerStatus: { ...typography.micro, color: colors.success, marginTop: 2 },
  headerStatusOffline: { color: colors.textTertiary },
  headerSpacer: { width: 44 },
  contextStrip: { minHeight: 36, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing[4], backgroundColor: colors.surfaceSubtle, borderBottomWidth: 1, borderBottomColor: colors.border },
  contextText: { ...typography.micro, color: colors.textSecondary, marginLeft: spacing[2] },
  
  scrollArea: { flex: 1 },
  chatScroll: { paddingHorizontal: spacing[4], paddingBottom: spacing[5], paddingTop: spacing[4], flexGrow: 1, justifyContent: 'flex-end' },
  
  dateRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing[6] },
  dateLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dateLabel: { ...typography.micro, color: colors.textTertiary, marginHorizontal: spacing[3] },
  
  agentMessageRow: { flexDirection: 'row', alignItems: 'flex-end' },
  userMessageRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  groupStart: { marginTop: spacing[3] },
  groupContinuation: { marginTop: spacing[1] },
  avatar: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginRight: spacing[2] },
  avatarSpacer: { width: 38 },
  agentAvatar: { backgroundColor: colors.accentSoft },
  memberAvatar: { backgroundColor: colors.surfaceSubtle },
  
  agentBubble: { backgroundColor: colors.surface, paddingHorizontal: 14, paddingVertical: 11, borderRadius: radii.brand, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: colors.border, maxWidth: '78%', flexShrink: 1, ...shadows.subtle },
  agentBubbleGrouped: { borderBottomLeftRadius: radii.brand },
  messageTextDark: { ...typography.body, color: colors.textPrimary, lineHeight: 21 },
  messageAuthor: { ...typography.micro, color: colors.accent, fontWeight: '700', marginBottom: spacing[1] },
  messageTimeDark: { fontSize: 10, color: colors.textTertiary, marginTop: spacing[2] },
  userBubble: { backgroundColor: colors.accent, paddingHorizontal: 14, paddingVertical: 11, borderRadius: radii.brand, borderBottomRightRadius: 4, maxWidth: '78%', flexShrink: 1 },
  userBubbleGrouped: { borderBottomRightRadius: radii.brand },
  messageTextLight: { ...typography.body, color: colors.inverse, lineHeight: 21 },
  messageTimeLight: { fontSize: 10, color: colors.accentTextSoft, marginTop: spacing[2], textAlign: 'right' },
  inputArea: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: spacing[3], paddingVertical: spacing[2], backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
  inputShell: { flex: 1, minHeight: 44, maxHeight: 120, justifyContent: 'center', backgroundColor: colors.surfaceSubtle, borderRadius: radii.brand, borderWidth: 1, borderColor: colors.border },
  textInput: { paddingHorizontal: 14, paddingTop: 11, paddingBottom: 11, fontSize: 15, color: colors.textPrimary, minHeight: 44, maxHeight: 120 },
  sendBtn: { backgroundColor: colors.accent, width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginLeft: spacing[2] },
  sendBtnDisabled: { backgroundColor: colors.border },
  unavailableState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing[8] },
  unavailableIcon: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceSubtle, marginBottom: spacing[5] },
  unavailableTitle: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  unavailableText: { ...typography.supporting, lineHeight: 21, color: colors.textSecondary, textAlign: 'center', marginTop: spacing[2], maxWidth: 320 },
  returnButton: { backgroundColor: colors.accent, borderRadius: radii.control, paddingHorizontal: spacing[5], paddingVertical: 13, marginTop: spacing[6] },
  returnButtonText: { color: colors.inverse, ...typography.supporting, fontWeight: '700' },
});