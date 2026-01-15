import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/constants/ThemeContext.js";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

// same icon config you use when adding income
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

const labelFromIcon = (iconName = "") =>
  iconName.replace("outline", "").replace(/-/g, " ").trim();

const findIconColor = (iconName) => {
  const found = colorfulIconOptions.find((o) => o.name === iconName);
  return found?.color;
};

export default function DashboardIncome() {
  const { isDark } = useTheme();

  const bg = isDark ? "#111827" : "#f3f4f6";
  const cardBg = isDark ? "#1f2937" : "#ffffff";
  const innerCard = isDark ? "#2d3b52" : "#e5e7eb";
  const text = isDark ? "#f3f4f6" : "#111827";
  const subText = isDark ? "#9CA3AF" : "#6b7280";

  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIncome = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("token");

      if (!userId || !token) {
        Alert.alert("Error", "Please login again");
        return;
      }

      const res = await axios.get("https://finance-manager-backend-iyuj.onrender.com/api/Transaction/get", {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-user-id": userId,
        },
        params: { type: "income" },
      });

      const allIncome = res.data.data
        .map((item, idx) => {
          const iconName = item.icon || "cash-outline";
          const iconColor =
            findIconColor(iconName) ||
            colorfulIconOptions[idx % colorfulIconOptions.length].color;

          return {
            id: item._id,
            name: item.title || "Income",
            amount: item.amount,
            date: new Date(item.date).toLocaleDateString("en-IN"),
            icon: iconName,
            color: iconColor,
          };
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      // ✅ Show up to 10 transactions (at least 5 visible + scrollable)
      setIncomeData(allIncome.slice(0, 10));
    } catch (err) {
      console.log("❌ Income dashboard error:", err.response?.data || err);
      Alert.alert("Error", "Failed to load income data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchIncome();
    }, [])
  );

  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);

  const pieData = incomeData.map((item) => ({
    name: item.name,
    population: item.amount,
    color: item.color,
    legendFontColor: text,
    legendFontSize: 14,
  }));

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: bg, justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#22c55e" />
        <Text style={{ color: subText, marginTop: 12 }}>
          Loading income overview...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: bg }]}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.wrapper}>
        {/* Pie Chart Card */}
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <Text style={[styles.sectionTitle, { color: text }]}>
            Last 60 Days Income
          </Text>

          {pieData.length === 0 ? (
            <Text
              style={{ color: subText, textAlign: "center", marginVertical: 40 }}
            >
              No income data yet.
            </Text>
          ) : (
            <>
              <PieChart
                data={pieData}
                width={screenWidth - 30}
                height={260}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"0"}
                center={[0, 0]}
                hasLegend={false}
                chartConfig={{
                  color: () => (isDark ? "#fff" : "#000"),
                }}
              />

              <View style={styles.centerText}>
                <Text style={[styles.totalLabel, { color: subText }]}>
                  Total Income
                </Text>
                <Text style={[styles.totalAmount, { color: text }]}>
                  ₹{totalIncome.toLocaleString()}
                </Text>
              </View>

              <View style={styles.legendRow}>
                {incomeData.map((item) => (
                  <View key={item.id} style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendDot,
                        { backgroundColor: item.color },
                      ]}
                    />
                    <Text style={[styles.legendText, { color: text }]}>
                      {labelFromIcon(item.icon) || item.name}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>

        {/* ✅ Recent Income - Scrollable (5+ visible, invisible scrollbar) */}
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <Text style={[styles.sectionTitle, { color: text }]}>
            Recent Income ({incomeData.length})
          </Text>

          {incomeData.length === 0 ? (
            <Text
              style={{ color: subText, textAlign: "center", marginVertical: 30 }}
            >
              No income yet. Add your first income 🙂
            </Text>
          ) : (
            <ScrollView
              style={styles.listContainer}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false} // ✅ Invisible scrollbar
            >
              {incomeData.map((item) => (
                <View
                  key={item.id}
                  style={[styles.incomeItem, { backgroundColor: innerCard }]}
                >
                  <View style={styles.row}>
                    <View
                      style={[
                        styles.iconCircle,
                        { backgroundColor: cardBg },
                      ]}
                    >
                      <Ionicons
                        name={item.icon}
                        size={24}
                        color={item.color}
                      />
                    </View>

                    <View>
                      <Text style={[styles.itemTitle, { color: text }]}>
                        {item.name}
                      </Text>
                      <Text style={[styles.itemDate, { color: subText }]}>
                        {item.date}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.amountPositive}>
                    + ₹{item.amount.toLocaleString()} ↑
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  wrapper: { padding: 15 },

  card: {
    padding: 20,
    borderRadius: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },

  sectionTitle: { fontSize: 20, fontWeight: "700", marginBottom: 20 },

  centerText: {
    position: "absolute",
    top: 140,
    alignSelf: "center",
    alignItems: "center",
  },

  totalLabel: { fontSize: 16 },
  totalAmount: { fontSize: 28, fontWeight: "bold" },

  legendRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
    flexWrap: "wrap",
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 6,
  },
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },
  legendText: { fontSize: 14 },

  // ✅ Scrollable list container (shows ~5 items + scroll)
  listContainer: {
    maxHeight: 300,
  },

  incomeItem: {
    padding: 15,
    borderRadius: 14,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 4,
  },

  row: { flexDirection: "row", alignItems: "center" },

  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  itemTitle: { fontSize: 16, fontWeight: "600" },
  itemDate: { fontSize: 13 },

  amountPositive: { color: "#22c55e", fontSize: 16, fontWeight: "700" },
});
