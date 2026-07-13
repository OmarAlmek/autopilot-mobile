import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface Message { id: string; sender: 'user' | 'agent'; text: string; }

export default function MessageScreen() {
  const router = useRouter();
  const { title, online } = useLocalSearchParams();
  const chatTitle = title || 'Sarah (Finance AI)';
  const isOnline = online === 'true';

  const scrollViewRef = useRef<ScrollView>(null);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'agent', text: `Hi there! I'm ready to assist you. Let me know what you need help with today.` }
  ]);

  const handleBack = () => {
    router.navigate('/(tabs)/chat');
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const userMessageText = inputText.trim();
    setMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'user', text: userMessageText }]);
    setInputText('');
    
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 50);
    }, 600);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), sender: 'agent', text: "Got it. I've logged that request to the current workspace session and will process the data accordingly." }]);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }, 2000);
  };

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
            <Text style={[styles.headerStatus, !isOnline && { color: '#94A3B8' }]}>
              {isOnline ? 'Online' : 'Offline'}
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

          {messages.map((item) => (
            <View key={item.id} style={item.sender === 'agent' ? styles.agentMessageRow : styles.userMessageRow}>
              {item.sender === 'agent' && (
                <View style={[styles.avatar, chatTitle.includes('AI') ? { backgroundColor: '#EDE9FE' } : { backgroundColor: '#F1F5F9' }]}>
                  <MaterialCommunityIcons name={chatTitle.includes('AI') ? "robot-outline" : "account-outline"} size={20} color={chatTitle.includes('AI') ? "#8B5CF6" : "#64748B"} />
                </View>
              )}
              <View style={item.sender === 'agent' ? styles.agentBubble : styles.userBubble}>
                <Text style={item.sender === 'agent' ? styles.messageTextDark : styles.messageTextLight}>{item.text}</Text>
              </View>
            </View>
          ))}

          {isTyping && (
            <View style={styles.agentMessageRow}>
              <View style={[styles.avatar, { backgroundColor: '#EDE9FE' }]}><MaterialCommunityIcons name="robot-outline" size={20} color="#8B5CF6" /></View>
              <View style={styles.typingBubble}><Text style={styles.typingText}>typing...</Text></View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputArea}>
          <TouchableOpacity style={styles.attachBtn}><MaterialCommunityIcons name="paperclip" size={24} color="#64748B" /></TouchableOpacity>
          
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
          
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend} activeOpacity={0.8}>
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

  userMessageRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 16 },
  
  // 🟢 Added flexShrink: 1 to prevent user bubble clipping
  userBubble: { backgroundColor: '#8B5CF6', padding: 16, borderRadius: 20, borderBottomRightRadius: 4, maxWidth: '80%', flexShrink: 1, shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4 },
  messageTextLight: { fontSize: 15, color: '#FFFFFF', lineHeight: 22 },

  typingBubble: { backgroundColor: '#F1F5F9', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, borderBottomLeftRadius: 4 },
  typingText: { fontSize: 13, color: '#64748B', fontStyle: 'italic' },

  inputArea: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  attachBtn: { padding: 8, marginRight: 4, paddingBottom: 10 },
  
  // 🟢 Allowed text input to grow with multiline
  textInput: { flex: 1, backgroundColor: '#F1F5F9', borderRadius: 20, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, fontSize: 15, color: '#0F172A', minHeight: 44, maxHeight: 120 },
  sendBtn: { backgroundColor: '#8B5CF6', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginLeft: 12, marginBottom: 4 },
});