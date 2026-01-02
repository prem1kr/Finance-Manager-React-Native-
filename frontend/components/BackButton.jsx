// BackButton.jsx
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function BackButton({ isDark = false, onPress }) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back(); 
    }
  };

  const iconColor = isDark ? '#fff' : '#111827';

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.button}
      activeOpacity={0.7}
    >
      <Ionicons name="arrow-back" size={24} color={iconColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 6, 
    paddingTop:20,
  },
});
