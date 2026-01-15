import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BackButton from '@/components/BackButton';
import { useTheme } from '@/constants/ThemeContext.js';
import { LineChart } from 'react-native-chart-kit';
import AddExpense from '../../components/AddExpanse';
import Edit from "../../components/Edit.jsx";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

const screenWidth = Dimensions.get('window').width;

export default function Expense() {

  const router = useRouter();
  const { isDark } = useTheme();

  const bg = isDark ? "#181A20" : "#f3f4f6";
  const card = isDark ? "#222734" : "#fff";
  const text = isDark ? "#F4F7FA" : "#111827";
  const subText = isDark ? "#98A7B6" : "#6b7280";
  const divider = isDark ? "#232a36" : "#d1d5db";
  const accent = isDark ? "#A78BFA" : "#d946ef";
  const red = "#ef4444";
  const purple = "#A78BFA";
  const iconBg = isDark ? "#283045" : "#e0e7ff";

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [editVisible, setEditVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openEdit = (item) => {
    setSelectedItem(item);
    setEditVisible(true);
  };

  // ✅ Fetch Expenses
  const fetchExpenseData = async () => {
    try {
      setLoading(true);

      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');

      const response = await axios.get(
        "https://finance-manager-backend-iyuj.onrender.com/api/Transaction/get",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-user-id": userId,
          },
          params: { type: "expense" }
        }
      );

      const transformedData = response.data.data.map(item => ({
        id: item._id,
        source: item.title,
        icon: <Ionicons name={item.icon} size={22} color={purple} />,
        date: new Date(item.date).toLocaleDateString("en-IN"),
        amount: item.amount,
        type: item.type
      }));

      setExpenseData(transformedData);

    } catch (err) {
      Alert.alert("Error", "Failed to fetch expense data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenseData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchExpenseData();
    setRefreshing(false);
  };

  const handleAddExpense = () => {
    setShowAddExpense(false);
    fetchExpenseData();
  };

  // 🗑️ ===========================
  //     DELETE EXPENSE
  // =============================
  const handleDelete = async (id) => {

    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this expense?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {

            try {
              const userId = await AsyncStorage.getItem("userId");
              const token = await AsyncStorage.getItem("token");

              await axios.delete(
                `https://finance-manager-backend-iyuj.onrender.com/api/Transaction/delete/${id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "x-user-id": userId,
                  }
                }
              );

              Alert.alert("Deleted", "Expense removed successfully.");
              fetchExpenseData();

            } catch (err) {
              Alert.alert("Error", "Delete failed. Please try again.");
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={accent} />
        <Text style={{ color: text, marginTop: 10 }}>Loading expense data...</Text>
      </View>
    );
  }

  const chartLabels = expenseData.slice(0, 7).map(i => i.date);
  const chartValues = expenseData.slice(0, 7).map(i => i.amount);

  const chartData = {
    labels: chartLabels,
    datasets: [{ data: chartValues, color: () => purple, strokeWidth: 3 }],
  };

  const chartConfig = {
    backgroundGradientFrom: card,
    backgroundGradientTo: card,
    decimalPlaces: 0,
    color: () => purple,
    labelColor: () => subText,
    propsForDots: { r: "7", strokeWidth: "2", stroke: accent },
    propsForBackgroundLines: { stroke: divider }
  };

  return (
    <ScrollView
      style={{ backgroundColor: bg, flex: 1 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={accent} />}
    >

      <BackButton onPress={() => router.back()} isDark={isDark} />

      {/* Expense Overview */}
      <View style={[styles.panel, { backgroundColor: card, borderColor: divider }]}>

        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: text }]}>Expense Overview</Text>

          <TouchableOpacity style={[styles.addBtn, { backgroundColor: red }]} onPress={() => setShowAddExpense(true)}>
            <Text style={styles.addBtnText}>+ Add Expense</Text>
          </TouchableOpacity>
        </View>

        <LineChart
          data={chartData}
          width={screenWidth * 0.92}
          height={260}
          chartConfig={chartConfig}
          bezier
          style={{ borderRadius: 20 }}
          fromZero
        />
      </View>

      {/* Expense List */}
      <View style={[styles.panel, { backgroundColor: card, borderColor: divider }]}>

        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: text }]}>
            All Expenses ({expenseData.length})
          </Text>
        </View>

        <View style={styles.listRow}>
          {expenseData.length === 0 ? (
            <Text style={{ color: subText, textAlign: "center", padding: 40 }}>
              No expenses yet — add one 💸
            </Text>
          ) : (
            expenseData.map(item => (
              <ExpenseCard
                key={item.id}
                {...item}
                isDark={isDark}
                card={card}
                iconBg={iconBg}
                text={text}
                subText={subText}
                divider={divider}
                onEdit={() => openEdit(item)}
                onDelete={() => handleDelete(item.id)}
              />
            ))
          )}
        </View>
      </View>

      {/* Add Modal */}
      <AddExpense
        visible={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        onSubmit={handleAddExpense}
        type="expense"
      />

      {/* Edit Modal */}
      {selectedItem && (
        <Edit
          visible={editVisible}
          data={selectedItem}
          onClose={() => setEditVisible(false)}
          onUpdated={() => {
            setEditVisible(false);
            fetchExpenseData();
          }}
        />
      )}

    </ScrollView>
  );
}

function ExpenseCard({
  isDark,
  icon,
  source,
  date,
  amount,
  card,
  iconBg,
  text,
  subText,
  divider,
  onEdit,
  onDelete
}) {

  return (
    <View style={[expenseStyles.card, { backgroundColor: card, borderColor: divider }]}>
      
      <View style={[expenseStyles.iconCircle, { backgroundColor: iconBg }]}>
        {icon}
      </View>

      <View style={expenseStyles.infoCol}>
        <Text style={[expenseStyles.source, { color: text }]}>{source}</Text>
        <Text style={[expenseStyles.date, { color: subText }]}>{date}</Text>
      </View>

      <Text style={[expenseStyles.amount, { color: "#ef4444" }]}>
        - ₹{amount.toLocaleString()}
      </Text>

      {/* ✏️ Edit */}
      <TouchableOpacity style={expenseStyles.iconBtn} onPress={onEdit}>
        <Ionicons name="create-outline" size={18} color={text} />
      </TouchableOpacity>

      {/* 🗑️ Delete */}
      {/* <TouchableOpacity style={[expenseStyles.iconBtn, { marginLeft: 8 }]} onPress={onDelete}>
        <Ionicons name="trash-outline" size={18} color="#ef4444" />
      </TouchableOpacity> */}

    </View>
  );
}

const styles = StyleSheet.create({
  panel: { margin: 14, borderRadius: 18, padding: 16, borderWidth: 1 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  title: { fontSize: 23, fontWeight: "bold" },
  addBtn: { borderRadius: 7, paddingHorizontal: 16, paddingVertical: 8 },
  addBtnText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  listRow: { gap: 14, marginTop: 4 },
});

const expenseStyles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", padding: 17, borderRadius: 15, gap: 13, borderWidth: 1 },
  iconCircle: { width: 43, height: 43, borderRadius: 21, justifyContent: "center", alignItems: "center" },
  infoCol: { flex: 1 },
  source: { fontSize: 16, fontWeight: "700" },
  date: { fontSize: 13, marginTop: 2 },
  amount: { fontWeight: "bold", fontSize: 17 },
  iconBtn: { borderRadius: 999, padding: 6, backgroundColor: "rgba(0,0,0,0.14)" }
});
