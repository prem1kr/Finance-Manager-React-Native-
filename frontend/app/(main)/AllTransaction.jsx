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
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const { width } = Dimensions.get('window');

export default function Transactions() {

  const router = useRouter();
  const { isDark } = useTheme(); 

  // Theme Colors
  const cardIncome = isDark ? "#14532d" : "#d1fae5"; 
  const cardExpense = isDark ? "#7f1d1d" : "#fee2e2"; 
  const amountIncome = "#22c55e";
  const amountExpense = "#ef4444";
  const bg = isDark ? "#181A20" : "#f3f4f6";
  const card = isDark ? "#222734" : "#ffffff";
  const text = isDark ? "#F4F7FA" : "#111827";
  const divider = isDark ? "#232a36" : "#e5e7eb";

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ===========================
  // ✅ FETCH ALL TRANSACTIONS
  // ===========================
  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');

      if (!userId || !token) {
        Alert.alert('Error', 'Please login again');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/Transaction/get', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-user-id': userId,
        },
      });

      const transformedData = response.data.data.map(item => ({
        id: item._id,
        type: item.type,
        source: item.title,
        icon: <Ionicons name={item.icon} size={22} />,
        date: new Date(item.date).toLocaleDateString('en-IN'),
        amount: item.amount,
      })).sort((a, b) => new Date(b.date) - new Date(a.date));

      setTransactions(transformedData);

    } catch (error) {
      console.log('❌ Fetch transactions error:', error.response?.data);
      Alert.alert('Error', 'Failed to fetch transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  // ===========================
  // ✅ DOWNLOAD AS CSV
  // ===========================
  const handleDownload = async () => {
    try {
      if (!transactions || transactions.length === 0) {
        Alert.alert("No Data", "No transactions available to download.");
        return;
      }

      const csvHeader = "Type,Title,Date,Amount\n";

      const csvRows = transactions.map(tx =>
        `${tx.type},${tx.source},${tx.date},${tx.amount}`
      );

      const csvString = csvHeader + csvRows.join("\n");

      const fileUri = FileSystem.documentDirectory + "transactions.csv";

      await FileSystem.writeAsStringAsync(fileUri, csvString, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      await Sharing.shareAsync(fileUri);

    } catch (error) {
      console.log("Download Error:", error);
      Alert.alert("Error", "Failed to download file. Try again.");
    }
  };

  // ===========================
  // ⏳ LOADING UI
  // ===========================
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#A78BFA" />
        <Text style={{ color: text, marginTop: 10 }}>Loading transactions...</Text>
      </View>
    );
  }

  // ===========================
  // 🎯 MAIN UI
  // ===========================
  return (
    <ScrollView
      style={{ backgroundColor: bg, flex: 1 }}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh} 
          tintColor="#A78BFA" 
        />
      }
    >
      <BackButton onPress={() => router.back()} isDark={isDark} />

      <View style={[styles.panel, { backgroundColor: card, borderColor: divider }]}>
        
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: text }]}>
            All Transactions ({transactions.length})
          </Text>

          {/* ✅ DOWNLOAD BUTTON */}
          <TouchableOpacity 
            style={[styles.downloadBtn, { backgroundColor: divider }]}
            onPress={handleDownload}
          >
            <Ionicons name="download-outline" size={20} color={text} />
            <Text style={[styles.downloadText, { color: text }]}>Download</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mobileColumn}>

          {transactions.length === 0 ? (
            <Text style={{ color: isDark ? "#98A7B6" : "#6b7280", textAlign: 'center', padding: 40, fontSize: 16 }}>
              No transactions yet. Add income or expenses to get started! ✨
            </Text>
          ) : (
            transactions.map((tx, idx) => (
              <TransactionCard
                key={tx.id || (tx.source + tx.date + idx)}
                {...tx}
                color={tx.type === "income" ? cardIncome : cardExpense}
                amountColor={tx.type === "income" ? amountIncome : amountExpense}
                isDark={isDark}
              />
            ))
          )}

        </View>
      </View>
    </ScrollView>
  );
}

// ===========================
// 💳 TRANSACTION CARD
// ===========================
function TransactionCard({ source, icon, date, amount, type, color, amountColor, isDark }) {

  const iconTextColor = isDark ? "#fff" : "#111827";

  return (
    <View style={[txCardStyles.card, { backgroundColor: color }]}>
      
      <View style={[txCardStyles.iconCircle, { backgroundColor: color }]}>
        {React.cloneElement(icon, { color: iconTextColor })} 
      </View>

      <View style={txCardStyles.infoCol}>
        <Text style={[txCardStyles.source, { color: iconTextColor }]}>{source}</Text>
        <Text style={[txCardStyles.date, { color: iconTextColor }]}>{date}</Text>
      </View>

      <Text style={[txCardStyles.amount, { color: amountColor }]}>
        {type === "income" ? `+ ₹${amount.toLocaleString()}` : `- ₹${amount.toLocaleString()}`}
      </Text>

    </View>
  );
}

// ===========================
// 🎨 STYLES
// ===========================
const styles = StyleSheet.create({
  panel: { 
    margin: 14,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    elevation: 10
  },
  headerRow: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18
  },
  title: { 
    fontSize: 23,
    fontWeight: 'bold'
  },
  downloadBtn: { 
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  downloadText: { 
    marginLeft: 6,
    fontSize: 15,
    fontWeight: '500'
  },
  mobileColumn: {
    flexDirection: "column",
    gap: 12,
    width: "100%"
  },
});

const txCardStyles = StyleSheet.create({
  card: { 
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    gap: 14,
    elevation: 4
  },
  iconCircle: { 
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  infoCol: { flex: 1 },
  source: { fontSize: 16, fontWeight: "700" },
  date: { fontSize: 13 },
  amount: { fontSize: 17, fontWeight: 'bold' }
});
