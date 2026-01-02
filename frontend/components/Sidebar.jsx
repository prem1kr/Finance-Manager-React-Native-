import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/constants/ThemeContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Sidebar() {
  const { isDark, setIsDark } = useTheme();
  const router = useRouter();
  const rotateAnim = new Animated.Value(isDark ? 1 : 0);

  const Logout = async() => {
      try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userId');
      router.replace('/(auth)/Login');
    } catch (error) {
      console.log('Logout error:', error);
    }
  }

  const animateIcon = () => {
    Animated.timing(rotateAnim, {
      toValue: isDark ? 0 : 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    animateIcon();
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const bg = isDark ? "#111827" : "#f3f4f6";
  const card = isDark ? "#1f2937" : "#ffffff";
  const text = isDark ? "#ffffff" : "#111827";
  const divider = isDark ? "#374151" : "#d1d5db";

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>

      {/* Profile + Theme Toggle */}
      <View style={styles.topRow}>
        <View style={{ alignItems: "center", flex: 1 }}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/4333/4333609.png",
            }}
            style={styles.avatar}
          />
          <Text style={[styles.name, { color: text }]}>Prem Kumar</Text>
        </View>

        <TouchableOpacity onPress={toggleTheme} style={styles.themeBtn}>
          <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
            <Ionicons
              name={isDark ? "moon" : "sunny"}
              size={28}
              color={isDark ? "#facc15" : "#fbbf24"}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>

      <View style={[styles.divider, { backgroundColor: divider }]} />

      {/* Menu */}
      <View style={styles.menuContainer}>
        <LinearGradient colors={["#d946ef", "#ec4899"]} style={styles.activeMenu}>
          <TouchableOpacity onPress={() => router.push("/")} style={{flex: 1}}>
            <View style={styles.menuRow}>
              <Ionicons name="grid-outline" size={22} color="#fff" />
              <Text style={styles.activeMenuText}>Dashboard</Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: card }]}
          onPress={() => router.push("/(main)/Income")}
        >
          <View style={styles.menuRow}>
            <FontAwesome5 name="dollar-sign" size={20} color="#22c55e" />
            <Text style={[styles.menuText, { color: text }]}>Income</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: card }]}
          onPress={() => router.push("/(main)/Expanse")}
        >
          <View style={styles.menuRow}>
            <MaterialIcons name="receipt-long" size={22} color="#f87171" />
            <Text style={[styles.menuText, { color: text }]}>Expense</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: card }]}
          onPress={() => router.push("/(main)/AllTransaction")}
        >
          <View style={styles.menuRow}>
            <FontAwesome5 name="list-alt" size={20} color="#fb923c" />
            <Text style={[styles.menuText, { color: text }]}>
              All Transaction
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutWrapper} onPress={Logout} >
        <LinearGradient colors={["#f43f5e", "#fb7185"]} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={22} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: "100%",
    paddingVertical: 40,
    paddingHorizontal: 15,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  themeBtn: { padding: 10 },
  avatar: { width: 90, height: 90, borderRadius: 50 },
  name: { marginTop: 10, fontSize: 20, fontWeight: "600" },
  divider: { height: 1, marginVertical: 20 },
  menuContainer: { gap: 12 },
  menuRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  activeMenu: { padding: 15, borderRadius: 12 },
  activeMenuText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  menuItem: { padding: 15, borderRadius: 12 },
  menuText: { fontSize: 16, fontWeight: "500" },
  logoutWrapper: { marginTop: "auto" },
  logoutBtn: {
    flexDirection: "row",
    gap: 10,
    padding: 15,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontSize: 17, fontWeight: "600" },
});
