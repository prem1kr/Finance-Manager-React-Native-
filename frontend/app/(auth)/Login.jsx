import React, { useState, useEffect } from 'react';
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
  const [checkingAuth, setCheckingAuth] = useState(true);

  const router = useRouter();

  // ✅ CHECK IF ALREADY LOGGED IN
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (token) {
          router.replace('/(main)/Dashboard');
        }
      } catch (err) {
        console.log('Auth check error:', err);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  // ⏳ Loader while checking auth
  if (checkingAuth) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  const handleSignin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'All fields required');
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        'https://finance-manager-backend-iyuj.onrender.com/api/auth/login',
        {
          email: email.trim(),
          password: password.trim(),
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (res.status !== 200) {
        Alert.alert('Error', res.data?.message || 'Login failed');
        return;
      }

      if (res.data.token) {
        await AsyncStorage.setItem('token', res.data.token);
      }

      if (res.data.user?.id) {
        await AsyncStorage.setItem('userId', res.data.user.id);
      }

      router.replace('/(main)/Dashboard');

    } catch (err) {
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

      <TouchableOpacity
        style={[styles.signInBtn, loading && styles.disabledBtn]}
        onPress={handleSignin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.signInBtnText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleBtn}>
        <Ionicons name="logo-google" size={22} color="#4285F4" />
        <Text style={styles.googleBtnText}>Sign in with Google</Text>
      </TouchableOpacity>

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
  logo: { width: 60, height: 60, marginBottom: 24 },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 32,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 14,
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 46,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 15,
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
    marginBottom: 19,
  },
  disabledBtn: { backgroundColor: '#6b7280' },
  signInBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  googleBtn: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 13,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  googleBtnText: { fontWeight: '600', fontSize: 15 },
  bottomText: { fontSize: 15 },
  signUpLink: {
    color: '#10b981',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
