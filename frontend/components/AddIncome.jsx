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

const colorfulIconOptions = [
  // ... your existing icon array (keeping all 100+)
  { name: 'cash-outline', color: '#10B981' },      // Salary
  { name: 'card-outline', color: '#3B82F6' },      // Freelance
  { name: 'wallet-outline', color: '#F59E0B' },    // Bonus
  { name: 'briefcase-outline', color: '#8B5CF6' }, // Business
  { name: 'trending-up-outline', color: '#EF4444' }, // Investment
  { name: 'gift-outline', color: '#FBBF24' },      // Gift
  { name: 'star-outline', color: '#EC4899' },      // Reward
  { name: 'home-outline', color: '#06B6D4' },      // Rental
  { name: 'school-outline', color: '#10B981' },    // Scholarship
  { name: 'rocket-outline', color: '#F97316' },    // Startup
  { name: 'pizza-outline', color: '#EF4444' },
  { name: 'car-outline', color: '#F59E0B' },
  { name: 'shirt-outline', color: '#8B5CF6' },
  { name: 'game-controller-outline', color: '#3B82F6' },
  { name: 'musical-notes-outline', color: '#EC4899' },
  { name: 'film-outline', color: '#10B981' },
  { name: 'book-outline', color: '#FBBF24' },
  { name: 'heart-outline', color: '#EF4444' },
  { name: 'airplane-outline', color: '#06B6D4' },
  { name: 'basketball-outline', color: '#F97316' },
  { name: 'beer-outline', color: '#8B5CF6' },
  { name: 'cafe-outline', color: '#F59E0B' },
  { name: 'fast-food-outline', color: '#10B981' },
  { name: 'restaurant-outline', color: '#EC4899' },
  { name: 'wine-outline', color: '#3B82F6' },
  { name: 'gas-outline', color: '#F97316' },
  { name: 'bus-outline', color: '#06B6D4' },
  { name: 'train-outline', color: '#8B5CF6' },
  { name: 'bicycle-outline', color: '#10B981' },
  { name: 'walk-outline', color: '#FBBF24' },
  { name: 'cart-outline', color: '#EF4444' },
  { name: 'bag-handle-outline', color: '#F59E0B' },
  { name: 'pricetag-outline', color: '#3B82F6' },
  { name: 'receipt-outline', color: '#8B5CF6' },
  { name: 'calculator-outline', color: '#10B981' },
  { name: 'phone-portrait-outline', color: '#EC4899' },
  { name: 'tablet-portrait-outline', color: '#F97316' },
  { name: 'laptop-outline', color: '#06B6D4' },
  { name: 'desktop-outline', color: '#FBBF24' },
  { name: 'glasses-outline', color: '#EF4444' },
  { name: 'medkit-outline', color: '#10B981' },
  { name: 'bandage-outline', color: '#3B82F6' },
  { name: 'barbell-outline', color: '#F59E0B' },
  { name: 'construct-outline', color: '#8B5CF6' },
  { name: 'hammer-outline', color: '#EC4899' },
  { name: 'trash-outline', color: '#EF4444' },
  { name: 'battery-charging-outline', color: '#10B981' },
  { name: 'wifi-outline', color: '#3B82F6' },
  { name: 'bluetooth-outline', color: '#F59E0B' },
  { name: 'headset-outline', color: '#8B5CF6' },
  { name: 'volume-high-outline', color: '#EC4899' },
  { name: 'bulb-outline', color: '#FBBF24' },
  { name: 'flashlight-outline', color: '#F97316' },
  { name: 'battery-dead-outline', color: '#EF4444' },
  { name: 'sunny-outline', color: '#F59E0B' },
  { name: 'cloudy-night-outline', color: '#06B6D4' },
  { name: 'rainy-outline', color: '#3B82F6' },
  { name: 'snow-outline', color: '#10B981' },
  { name: 'Partly-sunny-outline', color: '#8B5CF6' },
  { name: 'chatbubble-ellipses-outline', color: '#EC4899' },
  { name: 'mail-outline', color: '#F97316' },
  { name: 'person-outline', color: '#06B6D4' },
  { name: 'people-outline', color: '#FBBF24' },
  { name: 'woman-outline', color: '#EF4444' },
  { name: 'man-outline', color: '#10B981' },
  { name: 'accessibility-outline', color: '#3B82F6' },
  { name: 'happy-outline', color: '#F59E0B' },
  { name: 'sad-outline', color: '#8B5CF6' },
  { name: 'paw-outline', color: '#EC4899' },
  { name: 'flower-outline', color: '#F97316' },
  { name: 'leaf-outline', color: '#06B6D4' },
  { name: 'water-outline', color: '#10B981' },
  { name: 'earth-outline', color: '#3B82F6' },
  { name: 'globe-outline', color: '#F59E0B' },
  { name: 'navigate-outline', color: '#8B5CF6' },
  { name: 'location-outline', color: '#EC4899' },
  { name: 'pin-outline', color: '#F97316' },
  { name: 'compass-outline', color: '#06B6D4' },
  { name: 'timer-outline', color: '#FBBF24' },
  { name: 'alarm-outline', color: '#EF4444' },
  { name: 'stopwatch-outline', color: '#10B981' },
  { name: 'hourglass-outline', color: '#3B82F6' },
  { name: 'settings-outline', color: '#F59E0B' },
  { name: 'help-circle-outline', color: '#8B5CF6' },
  { name: 'information-circle-outline', color: '#EC4899' },
];

export default function AddIncome({ visible, onClose, onSubmit, type = 'income' }) { // ✅ type prop
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

      // ✅ Backend API call
      const response = await axios.post(
        'http://localhost:5000/api/Transaction/add', 
        {
          title: name.trim(),       
          amount: parseFloat(amount),
          type: type,                
          date: date.toISOString(),  
          icon: selectedIcon.name,
          category: type,           
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

      console.log('✅ Transaction added:', response.data);

      // ✅ Call parent onSubmit with data
      onSubmit?.({ 
        icon: selectedIcon.name, 
        iconColor: selectedIcon.color,
        title: name, 
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

      Alert.alert('Success', 'Transaction added successfully!');

    } catch (error) {
      console.log('❌ Add transaction error:', error.response?.data);
      
      const message = error.response?.data?.message || 
                     'Failed to add transaction. Please try again.';
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
            Add {type.charAt(0).toUpperCase() + type.slice(1)} 😊
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
              {selectedIcon.name.replace('ios-', '').replace('-outline', '')}
            </Text>
          </TouchableOpacity>

          {/* Name Input */}
          <TextInput
            style={styles.input}
            placeholder={`Freelance, Salary${type === 'expense' ? ', Groceries' : ''}, etc`}
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
            <Text style={styles.iconModalTitle}>Choose Colorful Icon 🎨</Text>
            
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
              <Text style={styles.iconModalCloseText}>✨ Done</Text>
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
    backgroundColor: '#1B1833',
    borderRadius: 10,
    padding: 15,
    marginBottom: 18,
    borderWidth: 2,
    borderColor: '#A78BFA',
  },
  changeIconText: {
    color: '#A78BFA',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 12,
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
    backgroundColor: "#A78BFA",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 0.2,
  },
  // Icon Picker Styles
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
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    borderRadius: 10,
    backgroundColor: '#1B1833',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedIconBtn: {
    borderColor: '#A78BFA',
    backgroundColor: '#2A2540',
  },
  iconModalCloseBtn: {
    backgroundColor: '#A78BFA',
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
