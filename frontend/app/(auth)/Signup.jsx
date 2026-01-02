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

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSignup = async () => {
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Missing fields', 'Please fill all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        'https://finance-manager-backend-iyuj.onrender.com/api/auth/signup',
        {
          name: fullName.trim(),
          email: email.trim(),
          password: password.trim(),
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (res.status < 200 || res.status >= 300) {
        const message = res.data?.message || 'Signup failed, please try again.';
        Alert.alert('Error', message);
        return;
      }

      Alert.alert('Success', 'Account created successfully!', [
        {
          text: 'OK',
          onPress: () => router.replace('/Login'),
        },
      ]);
    } catch (err) {
      const message =
        err?.response?.data?.message || 'Something went wrong. Please try again.';
      Alert.alert('Error', message);
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

      <Text style={styles.heading}>Create your account</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
        placeholder="Your Name"
        placeholderTextColor="#b4b4b4"
      />

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

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="••••••••"
        placeholderTextColor="#b4b4b4"
        secureTextEntry
        autoCapitalize="none"
      />

      {/* Sign Up Button */}
      <TouchableOpacity
        style={[styles.signUpBtn, loading && { opacity: 0.7 }]}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.signUpBtnText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      {/* Google OAuth */}
      <TouchableOpacity style={styles.googleBtn}>
        <Ionicons
          name="logo-google"
          size={22}
          color="#4285F4"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.googleBtnText}>Sign in with Google</Text>
      </TouchableOpacity>

      {/* Log In Link */}
      <Text style={styles.bottomText}>
        Already have an account?{' '}
        <Link href="/Login">
          <Text style={styles.logInLink}>Login</Text>
        </Link>
      </Text>
    </View>
  );
}

// your styles stay the same


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
    marginBottom: 20,
  },
  heading: {
    fontSize: 23,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 33,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 14,
    color: '#334155',
    marginBottom: 7,
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
  signUpBtn: {
    width: '100%',
    backgroundColor: '#10b981',
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 19,
    elevation: 2,
  },
  signUpBtnText: {
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
  logInLink: {
    color: '#10b981',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
