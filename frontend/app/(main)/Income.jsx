import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import BackButton from "../../components/BackButton.jsx";
import { useRouter } from "expo-router";
import { useTheme } from "@/constants/ThemeContext.js";
import AddIncome from "../../components/AddIncome.jsx";
import Edit from "../../components/Edit.jsx";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const screenWidth = Dimensions.get("window").width;

/* ---------------- PLATFORM SAFE CHART IMPORT ---------------- */
let ChartKitBarChart;
let GiftedBarChart;

if (Platform.OS === "web") {
  ChartKitBarChart = require("react-native-chart-kit").BarChart;
} else {
  GiftedBarChart = require("react-native-gifted-charts").BarChart;
}

export default function Income() {
  const router = useRouter();
  const { isDark } = useTheme();

  // Colors
  const bg = isDark ? "#181A20" : "#f3f4f6";
  const card = isDark ? "#222734" : "#ffffff";
  const text = isDark ? "#F4F7FA" : "#111827";
  const accent = isDark ? "#A78BFA" : "#d946ef";
  const green = "#22c55e";
  const divider = isDark ? "#232a36" : "#e5e7eb";
  const subText = isDark ? "#98A7B6" : "#6b7280";
  const iconBg = isDark ? "#283045" : "#e0e7ff";

  const [showAddIncome, setShowAddIncome] = useState(false);
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [editVisible, setEditVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openEdit = (item) => {
    setSelectedItem(item);
    setEditVisible(true);
  };

  /* ---------------- FETCH DATA ---------------- */
  const fetchIncomeData = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("token");

      const res = await axios.get(
        "https://finance-manager-backend-iyuj.onrender.com/api/Transaction/get",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-user-id": userId,
          },
          params: { type: "income" },
        }
      );

      const transformed = res.data.data.map((item) => ({
        id: item._id,
        source: item.title,
        date: new Date(item.date).toLocaleDateString("en-IN"),
        amount: item.amount,
        type: item.type,
        icon: (
          <Ionicons
            name={item.icon || "wallet-outline"}
            size={22}
            color={accent}
          />
        ),
      }));

      setIncomeData(transformed);
    } catch {
      Alert.alert("Error", "Failed to fetch income data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomeData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchIncomeData();
    setRefreshing(false);
  };

  /* ---------------- CHART DATA ---------------- */

  // Mobile (Gifted Charts)
  const mobileBarData = incomeData.slice(0, 5).map((item) => ({
    label: item.source,
    stacks: [
      { value: item.amount, color: accent },
      { value: Math.round(item.amount * 0.7), color: "#2563EB" },
    ],
  }));

  // Web (Chart Kit)
  const webChartData = {
    labels: incomeData.slice(0, 5).map((i) => i.source),
    datasets: [{ data: incomeData.slice(0, 5).map((i) => i.amount) }],
  };

  const webChartConfig = {
    backgroundGradientFrom: card,
    backgroundGradientTo: card,
    decimalPlaces: 0,
    color: () => accent,
    labelColor: () => subText,
    propsForBackgroundLines: { stroke: divider },
  };

  /* ---------------- PDF EXPORT ---------------- */
  const handleDownloadIncomePDF = async () => {
    if (!incomeData.length) return;

    const rows = incomeData
      .map(
        (i, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${i.source}</td>
        <td>${i.date}</td>
        <td>₹${i.amount}</td>
        <td>${i.type}</td>
      </tr>`
      )
      .join("");

    const html = `
    <html>
    <body>
      <h2 style="text-align:center;">Income Report</h2>
      <table border="1" width="100%">
        <tr>
          <th>#</th><th>Source</th><th>Date</th><th>Amount</th><th>Type</th>
        </tr>
        ${rows}
      </table>
    </body>
    </html>`;

    const { uri } = await Print.printToFileAsync({ html });
    const pdfPath = FileSystem.documentDirectory + "Income_Report.pdf";
    await FileSystem.moveAsync({ from: uri, to: pdfPath });

    Platform.OS === "web"
      ? window.open(pdfPath)
      : await Sharing.shareAsync(pdfPath);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", backgroundColor: bg }}>
        <ActivityIndicator size="large" color={accent} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: bg }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <BackButton onPress={() => router.back()} isDark={isDark} />

      {/* ---------------- OVERVIEW ---------------- */}
      <View style={[styles.panel, { backgroundColor: card, borderColor: divider }]}>
        <Text style={[styles.title, { color: text }]}>Income Overview</Text>

        {Platform.OS === "web" ? (
          <ChartKitBarChart
            data={webChartData}
            width={screenWidth - 40}
            height={260}
            fromZero
            chartConfig={webChartConfig}
            style={{ borderRadius: 16 }}
          />
        ) : (
          <GiftedBarChart
            data={mobileBarData}
            barWidth={26}
            spacing={42}
            noOfSections={5}
            yAxisLabelPrefix="₹"
            showValuesOnTopOfBars
            valueTextStyle={{ color: text, fontSize: 11 }}
            xAxisLabelTextStyle={{ color: subText, fontSize: 11 }}
            rulesColor={divider}
            backgroundColor={card}
            roundedTop
            isAnimated
          />
        )}

        <TouchableOpacity
          style={styles.addIncomeBtn}
          onPress={() => setShowAddIncome(true)}
        >
          <Text style={styles.addIncomeText}>+ Add Income</Text>
        </TouchableOpacity>
      </View>

      {/* ---------------- LIST ---------------- */}
      <View style={[styles.panel, { backgroundColor: card, borderColor: divider }]}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: text }]}>
            Income Sources ({incomeData.length})
          </Text>

          <TouchableOpacity style={styles.downloadBtn} onPress={handleDownloadIncomePDF}>
            <Ionicons name="download-outline" size={20} color={text} />
            <Text style={{ color: text }}>Download PDF</Text>
          </TouchableOpacity>
        </View>

        {incomeData.map((item) => (
          <IncomeCard
            key={item.id}
            {...item}
            card={card}
            text={text}
            subText={subText}
            divider={divider}
            iconBg={iconBg}
            amountColor={green}
            onEdit={() => openEdit(item)}
          />
        ))}
      </View>

      <AddIncome
        visible={showAddIncome}
        onClose={() => setShowAddIncome(false)}
        onSubmit={fetchIncomeData}
        type="income"
      />

      {selectedItem && (
        <Edit
          visible={editVisible}
          data={selectedItem}
          onClose={() => setEditVisible(false)}
          onUpdated={fetchIncomeData}
        />
      )}
    </ScrollView>
  );
}

/* ---------------- CARD ---------------- */
function IncomeCard({
  icon,
  source,
  date,
  amount,
  amountColor,
  card,
  iconBg,
  text,
  subText,
  divider,
  onEdit,
}) {
  return (
    <View style={[incomeStyles.card, { backgroundColor: card, borderColor: divider }]}>
      <View style={[incomeStyles.iconCircle, { backgroundColor: iconBg }]}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={[incomeStyles.source, { color: text }]}>{source}</Text>
        <Text style={[incomeStyles.date, { color: subText }]}>{date}</Text>
      </View>
      <Text style={[incomeStyles.amount, { color: amountColor }]}>₹{amount}</Text>
      <TouchableOpacity onPress={onEdit}>
        <Ionicons name="create-outline" size={20} color={text} />
      </TouchableOpacity>
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  panel: { margin: 14, padding: 16, borderRadius: 16, borderWidth: 1 },
  title: { fontSize: 20, fontWeight: "bold" },
  headerRow: { flexDirection: "row", justifyContent: "space-between" },
  addIncomeBtn: {
    position: "absolute",
    right: 16,
    top: 16,
    backgroundColor: "#A78BFA",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addIncomeText: { color: "#fff", fontWeight: "bold" },
  downloadBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
});

const incomeStyles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  source: { fontWeight: "700" },
  date: { fontSize: 12 },
  amount: { fontWeight: "bold", marginRight: 10 },
});
