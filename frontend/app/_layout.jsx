import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { ThemeProvider, useTheme } from "../constants/ThemeContext.js";

function AppStack() {
  const { isDark } = useTheme(); 

  return (
    <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(main)/Dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="(main)/Income" options={{ headerShown: false }} />
        <Stack.Screen name="(main)/Expanse" options={{ headerShown: false }} />
        <Stack.Screen name="(main)/AllTransaction" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/Login" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/Signup" options={{ headerShown: false }} />
      </Stack>
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppStack />
    </ThemeProvider>
  );
}
