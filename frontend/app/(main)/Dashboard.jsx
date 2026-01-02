import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ScrollView,
} from "react-native";

import DashboardHome from "@/components/DashboardHome";
import DashboardExpance from "@/components/DashboardExpance";
import DashboardIncome from "@/components/DashboardIncome";
import Sidebar from "@/components/Sidebar";
import { useTheme } from "../../constants/ThemeContext.js"; 

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useState(new Animated.Value(-280))[0];
  const { isDark } = useTheme(); 

  const toggleSidebar = () => {
    setIsOpen(!isOpen);

    Animated.timing(slideAnim, {
      toValue: isOpen ? -280 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#111827" : "#f3f4f6" },
      ]}
    >
      {/* Sidebar */}
      <Animated.View
        style={[
          styles.sidebarWrapper,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <Sidebar />
      </Animated.View>

      {/* Overlay */}
      {isOpen && <TouchableOpacity style={styles.overlay} onPress={toggleSidebar} />}

      {/* Main Content */}
      <View style={styles.mainContent}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <DashboardHome />    
          <DashboardExpance />  
          <DashboardIncome />  
        </ScrollView>

        {/* Floating Button */}
        <TouchableOpacity style={styles.fabButton} onPress={toggleSidebar}>
          <Text style={styles.fabIcon}>{isOpen ? "×" : "☰"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  sidebarWrapper: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    width: 280,
    zIndex: 20,
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 10,
  },
  mainContent: {
    flex: 1,
    zIndex: 1,
  },
  fabButton: {
    position: "absolute",
    bottom: 30,
    right: 25,
    backgroundColor: "#ec4899",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  fabIcon: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
    marginTop: -2,
  },
});
