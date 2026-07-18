import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = () => {
    if (!email || !password) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)/dashboard');
    }, 800);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.content}>
        
        {/* Brand Header */}
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            {/* The exact lightning bolt logo in white */}
            <MaterialCommunityIcons name="lightning-bolt" size={36} color="#FFFFFF" />
          </View>
          <Text style={styles.brandName}>Autopilot</Text>
          <Text style={styles.brandTagline}>Autonomous capital management.</Text>
        </View>

        {/* Auth Form */}
        <View style={styles.formContainer}>
          <Text style={styles.inputLabel}>Email address</Text>
          <TextInput
            style={styles.input}
            placeholder="name@company.com"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginButton, (!email || !password) && styles.loginButtonDisabled]} 
            onPress={handleSignIn}
            disabled={!email || !password || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have an account? <Text style={styles.footerLink}>Request access</Text>
          </Text>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 32, maxWidth: 440, width: '100%', alignSelf: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 48 },
  logoBox: {
    width: 64,
    height: 64,
    backgroundColor: '#10B981', // Brand Green matching the web UI
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  brandName: { fontSize: 28, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  brandTagline: { fontSize: 15, color: '#64748B' },
  formContainer: {
    backgroundColor: '#FFFFFF', padding: 32, borderRadius: 24, borderWidth: 1, borderColor: '#E2E8F0',
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 12,
  },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 },
  input: {
    backgroundColor: '#F8F9FB', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 16,
    paddingVertical: 14, fontSize: 15, color: '#0F172A', marginBottom: 20,
  },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 24, marginTop: -8 },
  forgotText: { fontSize: 13, fontWeight: '600', color: '#10B981' }, // Brand green link
  loginButton: {
    backgroundColor: '#0F172A', // Dark navy matching the web "+ New" buttons
    borderRadius: 12, paddingVertical: 16, alignItems: 'center', justifyContent: 'center',
  },
  loginButtonDisabled: { backgroundColor: '#64748B' },
  loginButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  footer: { marginTop: 32, alignItems: 'center' },
  footerText: { fontSize: 14, color: '#64748B' },
  footerLink: { fontWeight: '600', color: '#10B981' },
});