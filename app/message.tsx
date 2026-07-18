import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { useWorkspace } from '../src/context/WorkspaceContext';

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
            <MaterialCommunityIcons name="arrow-left" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Messages</Text>
          <View style={{ width: 32 }} />
        </View>
        <View style={styles.unavailableState}>
          <View style={styles.unavailableIcon}>
            <MaterialCommunityIcons name="message-alert-outline" size={30} color="#64748B" />
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

  const chatTitle = thread.kind === 'agent' ? `${thread.name} (${thread.role})` : thread.name;

  return (
    <SafeAreaView style={styles.container}>
      {/* 🟢 Wrap the ENTIRE view so the ScrollView resizes when the keyboard opens */}
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn} activeOpacity={0.7}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{chatTitle}</Text>
            <Text style={[styles.headerStatus, !thread.online && { color: '#94A3B8' }]}>
              {thread.kind === 'agent' ? 'Workspace AI' : thread.online ? 'Online' : thread.role}
            </Text>
          </View>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollArea}
          contentContainerStyle={styles.chatScroll}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled" // 🟢 Ensures buttons inside scrollview still work when keyboard is open
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          <Text style={styles.dateChip}>Today</Text>

          {thread.messages.map((item) => {
            const isCurrentUser = item.authorId === user.id;
            return (
            <View key={item.id} style={isCurrentUser ? styles.userMessageRow : styles.agentMessageRow}>
              {!isCurrentUser && (
                <View style={[styles.avatar, thread.kind === 'agent' ? { backgroundColor: '#EDE9FE' } : { backgroundColor: '#F1F5F9' }]}>
                  <MaterialCommunityIcons name={thread.kind === 'agent' ? "robot-outline" : "account-outline"} size={20} color={thread.kind === 'agent' ? "#8B5CF6" : "#64748B"} />
                </View>
              )}
              <View style={isCurrentUser ? styles.userBubble : styles.agentBubble}>
                {!isCurrentUser && <Text style={styles.messageAuthor}>{item.authorName}</Text>}
                <Text style={isCurrentUser ? styles.messageTextLight : styles.messageTextDark}>{item.text}</Text>
                <Text style={isCurrentUser ? styles.messageTimeLight : styles.messageTimeDark}>{item.createdAt}</Text>
              </View>
            </View>
          );
          })}
        </ScrollView>

        <View style={styles.inputArea}>
          <TouchableOpacity style={styles.attachBtn} disabled accessibilityLabel="Attachments are not available yet"><MaterialCommunityIcons name="paperclip" size={24} color="#CBD5E1" /></TouchableOpacity>
          
          {/* 🟢 Multiline input that grows smoothly */}
          <TextInput 
            style={styles.textInput} 
            placeholder="Write a message..." 
            placeholderTextColor="#94A3B8" 
            value={inputText} 
            onChangeText={setInputText}
            multiline={true}
            maxLength={500}
          />
          
          <TouchableOpacity style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]} onPress={handleSend} disabled={!inputText.trim()} activeOpacity={0.8} accessibilityLabel="Send message">
            <MaterialCommunityIcons name="arrow-up" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  keyboardAvoid: { flex: 1 }, // 🟢 Crucial for pushing the whole layout
  
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', zIndex: 10 },
  backBtn: { padding: 4 },
  headerTitleContainer: { alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  headerStatus: { fontSize: 12, color: '#10B981', fontWeight: '500', marginTop: 2 },
  
  scrollArea: { flex: 1 },
  chatScroll: { padding: 20, flexGrow: 1, justifyContent: 'flex-end' },
  
  dateChip: { alignSelf: 'center', backgroundColor: '#E2E8F0', color: '#475569', fontSize: 11, fontWeight: '600', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, overflow: 'hidden', marginBottom: 24 },
  
  agentMessageRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 16 },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#EDE9FE', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  
  // 🟢 Added flexShrink: 1 to ensure text wraps and never exceeds maxWidth
  agentBubble: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 20, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 2, maxWidth: '85%', flexShrink: 1 },
  messageTextDark: { fontSize: 15, color: '#0F172A', lineHeight: 22 },
  messageAuthor: { fontSize: 11, color: '#8B5CF6', fontWeight: '700', marginBottom: 4 },
  messageTimeDark: { fontSize: 10, color: '#94A3B8', marginTop: 6 },

  userMessageRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 16 },
  
  // 🟢 Added flexShrink: 1 to prevent user bubble clipping
  userBubble: { backgroundColor: '#8B5CF6', padding: 16, borderRadius: 20, borderBottomRightRadius: 4, maxWidth: '80%', flexShrink: 1, shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4 },
  messageTextLight: { fontSize: 15, color: '#FFFFFF', lineHeight: 22 },
  messageTimeLight: { fontSize: 10, color: '#DDD6FE', marginTop: 6, textAlign: 'right' },

  typingBubble: { backgroundColor: '#F1F5F9', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, borderBottomLeftRadius: 4 },
  typingText: { fontSize: 13, color: '#64748B', fontStyle: 'italic' },

  inputArea: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  attachBtn: { padding: 8, marginRight: 4, paddingBottom: 10 },
  
  // 🟢 Allowed text input to grow with multiline
  textInput: { flex: 1, backgroundColor: '#F1F5F9', borderRadius: 20, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, fontSize: 15, color: '#0F172A', minHeight: 44, maxHeight: 120 },
  sendBtn: { backgroundColor: '#8B5CF6', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginLeft: 12, marginBottom: 4 },
  sendBtnDisabled: { backgroundColor: '#CBD5E1' },
  unavailableState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  unavailableIcon: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F5F9', marginBottom: 20 },
  unavailableTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A', textAlign: 'center' },
  unavailableText: { fontSize: 14, lineHeight: 21, color: '#64748B', textAlign: 'center', marginTop: 8, maxWidth: 320 },
  returnButton: { backgroundColor: '#8B5CF6', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 13, marginTop: 24 },
  returnButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});