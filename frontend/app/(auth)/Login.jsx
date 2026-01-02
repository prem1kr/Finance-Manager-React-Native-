import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'All fields required');
      return;
    }

    try {
      setLoading(true);
      
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email: email.trim(),
        password: password.trim(),
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('✅ Login response:', res.data);

      if (res.status !== 200) {
        Alert.alert('Error', res.data?.message || 'Login failed');
        return;
      }

      if (res.data.token) {await AsyncStorage.setItem('token', res.data.token); }
      if (res.data.user?.id) {  await AsyncStorage.setItem('userId', res.data.user.id); }

      console.log('✅ Tokens saved, redirecting...');
      router.replace('/(main)/Dashboard');
      
    } catch (err) {
      console.log('❌ Login error:', err.response?.data || err.message);
      const message = err?.response?.data?.message || 'Something went wrong.';
      Alert.alert('Login Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/128/2721/2721374.png' }}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.heading}>Sign in to your account</Text>

      {/* Email Field */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        placeholderTextColor="#b4b4b4"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Field */}
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        placeholderTextColor="#b4b4b4"
        secureTextEntry
        autoCapitalize="none"
      />

      {/* Sign In Button */}
      <TouchableOpacity
        style={[
          styles.signInBtn,
          loading && styles.disabledBtn
        ]}
        onPress={handleSignin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.signInBtnText}>Sign In</Text>
        )}
      </TouchableOpacity>

      {/* Google OAuth */}
      <TouchableOpacity style={styles.googleBtn}>
        <Ionicons name="logo-google" size={22} color="#4285F4" style={{ marginRight: 8 }} />
        <Text style={styles.googleBtnText}>Sign in with Google</Text>
      </TouchableOpacity>

      {/* Sign Up Link */}
      <Text style={styles.bottomText}>
        Don't have an account?{' '}
        <Link href="/Signup" asChild>
          <Text style={styles.signUpLink}>Sign Up</Text>
        </Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 32,
    textAlign: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 14,
    color: '#334155',
    marginBottom: 8,
    marginTop: 0,
  },
  input: {
    width: '100%',
    height: 46,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#1e293b',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  signInBtn: {
    width: '100%',
    backgroundColor: '#10b981',
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 19,
    elevation: 2,
  },
  disabledBtn: {
    backgroundColor: '#6b7280',
  },
  signInBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  googleBtn: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 13,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  googleBtnText: {
    color: '#1e293b',
    fontWeight: '600',
    fontSize: 15,
  },
  bottomText: {
    color: '#334155',
    fontSize: 15,
    marginTop: 10,
    textAlign: 'center',
  },
  signUpLink: {
    color: '#10b981',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
