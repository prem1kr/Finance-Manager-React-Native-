import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/constants/ThemeContext.js";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; // ✅

export default function DashboardHome() {
  const { isDark } = useTheme(); 

  const bg = isDark ? "#111827" : "#f3f4f6";
  const text = isDark ? "#f3f4f6" : "#111827";
  const cardBg = isDark ? "#1f2937" : "#ffffff";
  const innerCard = isDark ? "#263447" : "#e5e7eb";
  const amountBg = isDark ? "#8d1d1d" : "#fee2e2";
  const subText = isDark ? "#9CA3AF" : "#6b7280";
  const barBack = isDark ? "#374151" : "#E5E7EB";

  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balanceData, setBalanceData] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("token");

      if (!userId || !token) {
        Alert.alert("Error", "Please login again");
        return;
      }

      const response = await axios.get(
        "https://finance-manager-backend-iyuj.onrender.com/api/Transaction/get",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-user-id": userId,
          },
        }
      );

      const allTransactions = response.data.data
        .map((item) => ({
          id: item._id,
          name: item.title,
          amount: item.type === "income" ? item.amount : -item.amount,
          date: new Date(item.date).toLocaleDateString("en-IN"),
          icon: item.icon || "card-outline",
          type: item.type,
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      const totalIncome = allTransactions
        .filter((tx) => tx.amount > 0)
        .reduce((sum, tx) => sum + tx.amount, 0);

      const totalExpense = Math.abs(
        allTransactions
          .filter((tx) => tx.amount < 0)
          .reduce((sum, tx) => sum + tx.amount, 0)
      );

      const totalBalance = totalIncome - totalExpense;

      setRecentTransactions(allTransactions.slice(0, 5));
      setBalanceData({
        totalBalance: Math.round(totalBalance),
        totalIncome: Math.round(totalIncome),
        totalExpense: Math.round(totalExpense),
      });
    } catch (error) {
      console.log("❌ Dashboard fetch error:", error.response?.data || error);
      Alert.alert("Error", "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial load (first mount)
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ✅ Refetch whenever screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Do not show big loader here; just refresh quietly
      fetchDashboardData();
    }, [])
  );

  // ✅ Overview percentage (uses income as budget)
  const budgetBase = balanceData.totalIncome || 1;
  let budgetPercentage =
    (balanceData.totalExpense / budgetBase) * 100;

  if (balanceData.totalExpense > 0 && budgetPercentage < 3) {
    budgetPercentage = 3;
  }
  if (budgetPercentage > 100) budgetPercentage = 100;
  if (budgetPercentage < 0) budgetPercentage = 0;

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: bg, justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={{ color: subText, marginTop: 16, fontSize: 16 }}>
          Loading dashboard...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.hello, { color: subText }]}>Hello,</Text>
          <Text style={[styles.username, { color: text }]}>
            Prem Kumar 👋
          </Text>
        </View>

        {/* <Image
          source={{ uri: "https://i.pravatar.cc/150" }}
          style={styles.avatar}
        /> */}
      </View>

      {/* Balance Card */}
      <LinearGradient
        colors={isDark ? ["#3C3B92", "#2E2B6B"] : ["#5A60FF", "#7B5CFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.balanceCard}
      >
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>
          ₹ {balanceData.totalBalance.toLocaleString()}
        </Text>

        <View style={styles.balanceRow}>
          <View>
            <Text style={styles.incomeLabel}>Income</Text>
            <Text style={styles.incomeValue}>
              ₹ {balanceData.totalIncome.toLocaleString()}
            </Text>
          </View>

          <View>
            <Text style={styles.expenseLabel}>Expense</Text>
            <Text style={styles.expenseValue}>
              ₹ {balanceData.totalExpense.toLocaleString()}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Overview */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: text }]}>Overview</Text>

        <View style={[styles.overviewCard, { backgroundColor: cardBg }]}>
          <View style={[styles.barBack, { backgroundColor: barBack }]}>
            <View
              style={[
                styles.barFront,
                { width: `${budgetPercentage}%` },
              ]}
            />
          </View>
          <Text style={[styles.overviewText, { color: subText }]}>
            {Math.round(budgetPercentage)}% of monthly budget used
          </Text>
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={[styles.shadowCard, { backgroundColor: cardBg }]}>
        <Text style={[styles.sectionTitle, { color: text }]}>
          Recent Transactions ({recentTransactions.length})
        </Text>

        <View style={styles.fixedHeightBox}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {recentTransactions.length === 0 ? (
              <Text style={[styles.noDataText, { color: subText }]}>
                No transactions yet. Add your first one! ✨
              </Text>
            ) : (
              recentTransactions.map((item) => {
                const isIncome = item.amount > 0;
                return (
                  <View
                    key={item.id}
                    style={[
                      styles.expenseCard,
                      { backgroundColor: innerCard },
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={26}
                      color={text}
                      style={{ marginRight: 12 }}
                    />

                    <View style={{ flex: 1 }}>
                      <Text
                        style={[styles.expenseName, { color: text }]}
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={[styles.expenseDate, { color: subText }]}
                      >
                        {item.date}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.amountBox,
                        {
                          backgroundColor: isIncome ? "#d1f7e0" : amountBg,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.amountText,
                          { color: isIncome ? "#059669" : "#dc2626" },
                        ]}
                      >
                        {isIncome ? "+" : "-"}₹
                        {Math.abs(item.amount).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
}



const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  header: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hello: { fontSize: 16 },
  username: { fontSize: 22, fontWeight: "700" },
  avatar: { width: 42, height: 42, borderRadius: 50 },

  balanceCard: {
    marginTop: 25,
    padding: 24,
    borderRadius: 18,
  },
  balanceLabel: { fontSize: 14, color: "rgba(255,255,255,0.85)" },
  balanceAmount: {
    fontSize: 34,
    fontWeight: "700",
    color: "#FFFFFF",
    marginVertical: 10,
  },
  balanceRow: { flexDirection: "row", justifyContent: "space-between" },
  incomeLabel: { color: "#22c55e", fontSize: 14, fontWeight: "600" },
  incomeValue: {
    fontSize: 18,
    color: "#dcfce7",
    fontWeight: "700",
  },
  expenseLabel: { color: "#ef4444", fontSize: 14, fontWeight: "600" },
  expenseValue: {
    fontSize: 18,
    color: "#fee2e2",
    fontWeight: "700",
  },

  section: { marginTop: 30 },
  sectionTitle: { fontSize: 20, fontWeight: "700" },

  overviewCard: { padding: 15, borderRadius: 12 },
  barBack: {
    width: "100%",
    height: 12,
    borderRadius: 6,
    marginBottom: 6,
    overflow: "hidden",
  },
  barFront: { height: "100%", backgroundColor: "#6366F1", borderRadius: 6 },
  overviewText: { fontSize: 12, textAlign: "center" },

  shadowCard: {
    marginTop: 30,
    padding: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },

  fixedHeightBox: { height: 300, marginTop: 10 },

  expenseCard: {
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  expenseName: { fontSize: 16, fontWeight: "600" },
  expenseDate: { fontSize: 12 },

  amountBox: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 10,
    minWidth: 80,
    alignItems: "center",
  },
  amountText: { fontWeight: "bold", fontSize: 14 },

  noDataText: {
    textAlign: "center",
    paddingVertical: 40,
    fontSize: 16,
    fontStyle: "italic",
  },
    fixedHeightBox: { 
    height: 380,  // ⬅️ Increased from 300 to 380
    marginTop: 10 
  },
});
