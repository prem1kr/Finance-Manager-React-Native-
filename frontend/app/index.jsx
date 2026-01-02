import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, Animated, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      router.replace('/(auth)/Login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [fadeAnim, router]);

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80' }}
      style={styles.background}
      resizeMode="cover"
      blurRadius={1.5}
    >
      <View style={styles.overlay} />
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/128/2721/2721374.png' }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome to Finance Tracker</Text>
        <Text style={styles.description}>
          Your personal finance dashboard. Let's keep track of what matters!
        </Text>

      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(248, 250, 252, 0.73)', // semi-white overlay for readability
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 74,
    height: 74,
    marginBottom: 29,
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: "#194148",
    marginBottom: 15,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    color: '#334155',
    marginTop: 8,
    marginBottom: 2,
    letterSpacing: 0.1,
    fontWeight: '500',
  },
});
