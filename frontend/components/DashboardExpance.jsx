import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/constants/ThemeContext.js";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

// same colorful icon config as elsewhere
const colorfulIconOptions = [
  { name: "cash-outline", color: "#10B981" },
  { name: "card-outline", color: "#3B82F6" },
  { name: "wallet-outline", color: "#F59E0B" },
  { name: "briefcase-outline", color: "#8B5CF6" },
  { name: "trending-up-outline", color: "#EF4444" },
  { name: "gift-outline", color: "#FBBF24" },
  { name: "star-outline", color: "#EC4899" },
  { name: "home-outline", color: "#06B6D4" },
  { name: "school-outline", color: "#10B981" },
  { name: "rocket-outline", color: "#F97316" },
  { name: "pizza-outline", color: "#EF4444" },
  { name: "car-outline", color: "#F59E0B" },
  { name: "shirt-outline", color: "#8B5CF6" },
  { name: "game-controller-outline", color: "#3B82F6" },
  { name: "musical-notes-outline", color: "#EC4899" },
  { name: "film-outline", color: "#10B981" },
  { name: "book-outline", color: "#FBBF24" },
  { name: "heart-outline", color: "#EF4444" },
  { name: "airplane-outline", color: "#06B6D4" },
  { name: "basketball-outline", color: "#F97316" },
  { name: "beer-outline", color: "#8B5CF6" },
  { name: "cafe-outline", color: "#F59E0B" },
  { name: "fast-food-outline", color: "#10B981" },
  { name: "restaurant-outline", color: "#EC4899" },
  { name: "wine-outline", color: "#3B82F6" },
  { name: "gas-outline", color: "#F97316" },
  { name: "bus-outline", color: "#06B6D4" },
  { name: "train-outline", color: "#8B5CF6" },
  { name: "bicycle-outline", color: "#10B981" },
  { name: "walk-outline", color: "#FBBF24" },
  { name: "cart-outline", color: "#EF4444" },
  { name: "bag-handle-outline", color: "#F59E0B" },
  { name: "pricetag-outline", color: "#3B82F6" },
  { name: "receipt-outline", color: "#8B5CF6" },
  { name: "calculator-outline", color: "#10B981" },
  { name: "phone-portrait-outline", color: "#EC4899" },
  { name: "tablet-portrait-outline", color: "#F97316" },
  { name: "laptop-outline", color: "#06B6D4" },
  { name: "desktop-outline", color: "#FBBF24" },
  { name: "glasses-outline", color: "#EF4444" },
  { name: "medkit-outline", color: "#10B981" },
  { name: "bandage-outline", color: "#3B82F6" },
  { name: "barbell-outline", color: "#F59E0B" },
  { name: "construct-outline", color: "#8B5CF6" },
  { name: "hammer-outline", color: "#EC4899" },
  { name: "trash-outline", color: "#EF4444" },
  { name: "battery-charging-outline", color: "#10B981" },
  { name: "wifi-outline", color: "#3B82F6" },
  { name: "bluetooth-outline", color: "#F59E0B" },
  { name: "headset-outline", color: "#8B5CF6" },
  { name: "volume-high-outline", color: "#EC4899" },
  { name: "bulb-outline", color: "#FBBF24" },
  { name: "flashlight-outline", color: "#F97316" },
  { name: "battery-dead-outline", color: "#EF4444" },
  { name: "sunny-outline", color: "#F59E0B" },
  { name: "cloudy-night-outline", color: "#06B6D4" },
  { name: "rainy-outline", color: "#3B82F6" },
  { name: "snow-outline", color: "#10B981" },
  { name: "Partly-sunny-outline", color: "#8B5CF6" },
  { name: "chatbubble-ellipses-outline", color: "#EC4899" },
  { name: "mail-outline", color: "#F97316" },
  { name: "person-outline", color: "#06B6D4" },
  { name: "people-outline", color: "#FBBF24" },
  { name: "woman-outline", color: "#EF4444" },
  { name: "man-outline", color: "#10B981" },
  { name: "accessibility-outline", color: "#3B82F6" },
  { name: "happy-outline", color: "#F59E0B" },
  { name: "sad-outline", color: "#8B5CF6" },
  { name: "paw-outline", color: "#EC4899" },
  { name: "flower-outline", color: "#F97316" },
  { name: "leaf-outline", color: "#06B6D4" },
  { name: "water-outline", color: "#10B981" },
  { name: "earth-outline", color: "#3B82F6" },
  { name: "globe-outline", color: "#F59E0B" },
  { name: "navigate-outline", color: "#8B5CF6" },
  { name: "location-outline", color: "#EC4899" },
  { name: "pin-outline", color: "#F97316" },
  { name: "compass-outline", color: "#06B6D4" },
  { name: "timer-outline", color: "#FBBF24" },
  { name: "alarm-outline", color: "#EF4444" },
  { name: "stopwatch-outline", color: "#10B981" },
  { name: "hourglass-outline", color: "#3B82F6" },
  { name: "settings-outline", color: "#F59E0B" },
  { name: "help-circle-outline", color: "#8B5CF6" },
  { name: "information-circle-outline", color: "#EC4899" },
];

const findIconColor = (iconName) => {
  const found = colorfulIconOptions.find((o) => o.name === iconName);
  return found?.color;
};

export default function DashboardExpance() {
  const { isDark } = useTheme();

  // THEME COLORS
  const bg = isDark ? "#111827" : "#f3f4f6";
  const cardBg = isDark ? "#1f2937" : "#ffffff";
  const innerCard = isDark ? "#263447" : "#e5e7eb";
  const text = isDark ? "#f3f4f6" : "#111827";
  const subText = isDark ? "#9CA3AF" : "#6b7280";
  const amountBg = isDark ? "#8d1d1d" : "#fee2e2";

  const [recentExpenses, setRecentExpenses] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch expense data from backend with colorful icon
  const fetchExpenseDashboard = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("token");

      if (!userId || !token) {
        Alert.alert("Error", "Please login again");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/Transaction/get", {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-user-id": userId,
        },
      });

      const allExpenses = response.data.data
        .filter((item) => item.type === "expense")
        .map((item, idx) => {
          const iconName = item.icon || "cart-outline";
          const iconColor =
            findIconColor(iconName) ||
            colorfulIconOptions[idx % colorfulIconOptions.length].color;

          return {
            id: item._id,
            name: item.title,
            amount: item.amount,
            date: new Date(item.date).toLocaleDateString("en-IN"),
            icon: iconName,
            iconColor,
          };
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      setRecentExpenses(allExpenses.slice(0, 6));

      const chartArray = allExpenses.slice(0, 12).map((e) => ({
        value: e.amount,
        label:
          e.name && e.name.length > 8 ? e.name.slice(0, 7) + "…" : e.name || "Expense",
        frontColor: isDark ? "#f87171" : "#ef4444",
      }));

      setChartData(chartArray);
    } catch (error) {
      console.log("❌ Expense dashboard error:", error.response?.data || error);
      Alert.alert("Error", "Failed to load expense dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenseDashboard();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchExpenseDashboard();
    }, [])
  );

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: bg, justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#ef4444" />
        <Text style={{ color: subText, marginTop: 12 }}>
          Loading expense overview...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: bg }]}
      showsVerticalScrollIndicator={false}
    >
      {/* RECENT EXPENSES CARD */}
      <View style={[styles.section, { backgroundColor: cardBg }]}>
        <Text style={[styles.heading, { color: text }]}>
          Recent Expenses ({recentExpenses.length})
        </Text>

        <View style={styles.fixedHeightBox}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {recentExpenses.length === 0 ? (
              <Text style={{ color: subText, textAlign: "center", marginTop: 40 }}>
                No expenses yet. Add your first expense 💸
              </Text>
            ) : (
              recentExpenses.map((item) => (
                <View
                  key={item.id}
                  style={[styles.expenseCard, { backgroundColor: innerCard }]}
                >
                  {/* LEFT SIDE with colorful icon */}
                  <View style={styles.leftRow}>
                    <View
                      style={[
                        styles.iconCircle,
                        { backgroundColor: cardBg },
                      ]}
                    >
                      <Ionicons
                        name={item.icon}
                        size={24}
                        color={item.iconColor}
                      />
                    </View>

                    <View>
                      <Text style={[styles.expenseName, { color: text }]}>
                        {item.name}
                      </Text>
                      <Text style={[styles.expenseDate, { color: subText }]}>
                        {item.date}
                      </Text>
                    </View>
                  </View>

                  {/* AMOUNT */}
                  <View style={[styles.amountBox, { backgroundColor: amountBg }]}>
                    <Text style={[styles.amountText, { color: "#dc2626" }]}>
                      -₹{item.amount.toLocaleString()}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </View>

          {/* BAR CHART SECTION */}
      <View style={[styles.section, { backgroundColor: cardBg }]}>
        <Text style={[styles.heading, { color: text }]}>
          Top Expense Categories
        </Text>

        {chartData.length === 0 ? (
          <Text style={{ color: subText, textAlign: "center", marginTop: 40 }}>
            Not enough data to show chart yet.
          </Text>
        ) : (
          <View
            style={{
              alignItems: "center",
              paddingVertical: 10,
              height: 360,          // ⬅️ increase section height here
              justifyContent: "center",
            }}
          >
            <BarChart
              barWidth={40}
              data={chartData}
              noOfSections={4}
              barBorderRadius={12}
              yAxisThickness={0}
              xAxisThickness={0}
              isAnimated
              xAxisLabelTextStyle={{ color: text, fontSize: 12 }}
              yAxisTextStyle={{ color: text }}
              labelColor={text}
              hideRules
            />
          </View>
        )}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },

  section: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },

  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },

  fixedHeightBox: { height: 320 },

  expenseCard: {
    padding: 14,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    elevation: 3,
  },

  leftRow: { flexDirection: "row", alignItems: "center" },

  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  expenseName: { fontSize: 16, fontWeight: "600" },

  expenseDate: { fontSize: 12 },

  amountBox: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 10,
    elevation: 2,
  },

  amountText: { fontWeight: "bold" },
});
