import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    router.push('/dashboard');
  };

  return (
    <View style={styles.outer}>
      <View style={styles.container}>

        {/* Logo */}
        <View style={styles.logoContainer}>
       <View style={styles.iconBox}>
  <MaterialCommunityIcons name="lightning-bolt" size={28} color="#00C48C" />
</View>
          <Text style={styles.welcome}>Welcome to Autopilot</Text>
          <Text style={styles.tagline}>Cash Control for Growing Businesses</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="you@company.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity>
            <Text style={styles.forgot}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Sign In  →</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={styles.googleButton} onPress={handleLogin}>
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.demoButton} onPress={handleLogin}>
  <Text style={styles.demoText}>Continue with Demo Account</Text>
</TouchableOpacity>

          <Text style={styles.demoSubtext}>
            Explore the app with the demo account — no signup required
          </Text>
        </View>

        <Text style={styles.signup}>Don't have an account? <Text style={styles.signupLink}>Sign up</Text></Text>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh' as any,
  },
  container: {
    width: '100%',
    maxWidth: 420,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconBox: {
  width: 56,
  height: 56,
  backgroundColor: '#E0F5EE',
  borderRadius: 14,
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 16,
  borderWidth: 1,
  borderColor: '#B8ECD9',
},
 welcome: {
  fontSize: 24,
  fontWeight: '300',
  color: '#1A1A2E',
  marginBottom: 6,
  letterSpacing: 0.5,
},
  tagline: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    marginTop: 14,
  },
 inputRow: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#DEDEDE',
  paddingHorizontal: 12,
},
  inputIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  input: {
    flex: 1,
    padding: 14,
    fontSize: 15,
    color: '#1A1A2E',
  },
  forgot: {
    color: '#888',
    textAlign: 'right',
    marginTop: 10,
    fontSize: 13,
  },
button: {
  backgroundColor: '#1A1A2E',
  borderRadius: 8,
  padding: 15,
  alignItems: 'center',
  marginTop: 20,
},
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  orText: {
    marginHorizontal: 12,
    color: '#999',
    fontSize: 13,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#FFFFFF',
  },
  googleIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4285F4',
    marginRight: 8,
  },
  googleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  demoButton: {
    alignItems: 'center',
    marginTop: 14,
  },
  demoText: {
    color: '#00C48C',
    fontSize: 14,
    fontWeight: '500',
  },
  demoSubtext: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
  },
  signup: {
    textAlign: 'center',
    marginTop: 24,
    color: '#888',
    fontSize: 14,
  },
  signupLink: {
    color: '#1A1A2E',
    fontWeight: '600',
  },
});