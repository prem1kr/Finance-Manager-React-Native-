import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ FIXED: Valid Ionicons names for EXPENSE (Red theme)
const colorfulIconOptions = [
  { name: 'wallet-outline', color: '#ef4444' },
  { name: 'cash-outline', color: '#f87171' },
  { name: 'card-outline', color: '#fb7185' },
  { name: 'pricetag-outline', color: '#f472b6' },
  { name: 'calculator-outline', color: '#ec4899' },
  { name: 'trending-down-outline', color: '#be123c' },
  { name: 'stats-chart-outline', color: '#f59e0b' },
  { name: 'pie-chart-outline', color: '#d97706' },
  { name: 'bar-chart-outline', color: '#b45309' },
  { name: 'remove-outline', color: '#dc2626' },
  { name: 'trash-outline', color: '#b91c1c' },
  { name: 'cart-outline', color: '#f59e0b' },
  { name: 'bag-handle-outline', color: '#d97706' },
  { name: 'pizza-outline', color: '#ef4444' },
  { name: 'restaurant-outline', color: '#f87171' },
  { name: 'beer-outline', color: '#f59e0b' },
  { name: 'cafe-outline', color: '#d97706' },
  { name: 'car-outline', color: '#fb7185' },
  { name: 'gas-outline', color: '#ec4899' },
  { name: 'bus-outline', color: '#be123c' },
  { name: 'train-outline', color: '#dc2626' },
  { name: 'home-outline', color: '#f59e0b' },
  { name: 'construct-outline', color: '#b45309' },
  { name: 'hammer-outline', color: '#d97706' },
  { name: 'wrench-outline', color: '#f87171' },
  { name: 'phone-portrait-outline', color: '#ef4444' },
  { name: 'laptop-outline', color: '#fb7185' },
  { name: 'book-outline', color: '#f59e0b' },
  { name: 'notebook-outline', color: '#d97706' },
  { name: 'gift-outline', color: '#ec4899' },
  { name: 'flag-outline', color: '#be123c' },
  { name: 'thumbs-down-outline', color: '#dc2626' },
  { name: 'close-outline', color: '#b91c1c' },
  { name: 'warning-outline', color: '#f59e0b' },
  { name: 'alert-circle-outline', color: '#d97706' },
  { name: 'help-circle-outline', color: '#f87171' },
  { name: 'information-circle-outline', color: '#b45309' },
];

export default function AddExpense({ visible, onClose, onSubmit, type = 'expense' }) {
  const [selectedIcon, setSelectedIcon] = useState(colorfulIconOptions[0]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePickIcon = (iconObj) => {
    setSelectedIcon(iconObj);
    setShowIconPicker(false);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !amount.trim()) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      setLoading(true);

      // ✅ Get userId and token from AsyncStorage
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');

      if (!userId || !token) {
        Alert.alert('Error', 'Please login again');
        return;
      }

      // ✅ Backend API call - SAME as AddIncome
      const response = await axios.post(
        'http://localhost:5000/api/Transaction/add', 
        {
          title: name.trim(),     
          amount: parseFloat(amount),
          type: type,             // 'expense'
          date: date.toISOString(), 
          icon: selectedIcon.name,
          category: type,         // 'expense'
          note: '',             
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
            'x-user-id': userId,    
          },
        }
      );

      console.log('✅ Expense added to database:', response.data);

      // ✅ Call parent onSubmit with data (title instead of name for consistency)
      onSubmit?.({ 
        icon: selectedIcon.name, 
        iconColor: selectedIcon.color,
        title: name.trim(),     // ✅ Matches database field
        amount: parseFloat(amount), 
        date,
        type,
        id: response.data.data._id 
      });

      // ✅ Reset form & close
      setSelectedIcon(colorfulIconOptions[0]);
      setName('');
      setAmount('');
      setDate(new Date());
      onClose();

      Alert.alert('Success', 'Expense added successfully! 💸');

    } catch (error) {
      console.log('❌ Add expense error:', error.response?.data);
      const message = error.response?.data?.message || 
                     'Failed to add expense. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const renderIconItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.iconBtn,
        selectedIcon.name === item.name && styles.selectedIconBtn
      ]}
      onPress={() => handlePickIcon(item)}
    >
      <Ionicons name={item.name} size={26} color={item.color} />
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Close Modal */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={24} color="#A78BFA" />
          </TouchableOpacity>

          {/* Heading */}
          <Text style={styles.heading}>
            Add {type.charAt(0).toUpperCase() + type.slice(1)} 💸
          </Text>

          {/* Current Icon Display */}
          <TouchableOpacity 
            style={styles.currentIconContainer} 
            onPress={() => setShowIconPicker(true)}
          >
            <Ionicons 
              name={selectedIcon.name} 
              size={36} 
              color={selectedIcon.color} 
            />
            <Text style={[styles.changeIconText, { color: selectedIcon.color }]}>
              {selectedIcon.name.replace('ios-', '').replace('-outline', '').replace('outline', '')}
            </Text>
          </TouchableOpacity>

          {/* Name Input */}
          <TextInput
            style={styles.input}
            placeholder={`Dinner, Groceries, Transport, etc`}
            placeholderTextColor="#8B8B8B"
            value={name}
            onChangeText={setName}
          />

          {/* Amount Input */}
          <TextInput
            style={styles.input}
            placeholder="Amount"
            placeholderTextColor="#8B8B8B"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />

          {/* Date Picker */}
          <TouchableOpacity style={styles.dateRow} onPress={() => setShowPicker(true)}>
            <Text style={styles.dateText}>
              {date.toLocaleDateString()}
            </Text>
            <Ionicons name="calendar-outline" size={21} color="#bbb" />
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          {/* Action Button - With Loading */}
          <TouchableOpacity 
            style={[
              styles.addBtn, 
              loading && styles.disabledBtn
            ]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.addBtnText}>Add {type.charAt(0).toUpperCase() + type.slice(1)}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Icon Picker Modal */}
      <Modal
        visible={showIconPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowIconPicker(false)}
      >
        <TouchableOpacity 
          style={styles.iconModalOverlay} 
          activeOpacity={1}
          onPress={() => setShowIconPicker(false)}
        >
          <View style={styles.iconModalContainer}>
            <Text style={styles.iconModalTitle}>Choose Expense Icon 🔥</Text>
            
            <FlatList
              data={colorfulIconOptions}
              renderItem={renderIconItem}
              keyExtractor={(item) => item.name}
              numColumns={6}
              contentContainerStyle={styles.iconGrid}
              showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity 
              style={styles.iconModalCloseBtn} 
              onPress={() => setShowIconPicker(false)}
            >
              <Text style={styles.iconModalCloseText}>✅ Done</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(16,15,32, 0.82)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '92%',
    backgroundColor: '#171629',
    borderRadius: 17,
    padding: 22,
    shadowColor: "#A78BFA",
    shadowOpacity: 0.12,
    shadowRadius: 19,
    elevation: 14,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    right: 12,
    top: 13,
    zIndex: 2,
    padding: 6,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    marginTop: 7,
  },
  currentIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    shadowColor: '#ef4444',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  changeIconText: {
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 14,
    textTransform: 'capitalize',
  },
  input: {
    backgroundColor: '#19192d',
    color: '#f6f5fd',
    borderRadius: 7,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15.5,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: '#252047',
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#19192d',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#252047",
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 17,
    justifyContent: "space-between"
  },
  dateText: {
    color: '#e0e0e0',
    fontSize: 16,
    letterSpacing: 0.1,
  },
  addBtn: {
    backgroundColor: "#ef4444",  // Red for expenses
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  disabledBtn: {
    backgroundColor: "#6B7280",
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 0.2,
  },
  iconModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconModalContainer: {
    backgroundColor: '#171629',
    borderRadius: 17,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  iconModalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  iconGrid: {
    paddingBottom: 20,
  },
  iconBtn: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  selectedIconBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: '#fff',
    shadowColor: '#fff',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  iconModalCloseBtn: {
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  iconModalCloseText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
