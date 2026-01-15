import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Edit({ visible, data, onClose, onUpdated }) {
  const [form, setForm] = useState({
    title: data.source,
    amount: String(data.amount),
  });

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");

      await axios.put(
        `https://finance-manager-backend-iyuj.onrender.com/api/Transaction/edit/${data.id}`,
        {
          title: form.title,
          amount: Number(form.amount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-user-id": userId,
          },
        }
      );

      onUpdated();
    } catch {
      Alert.alert("Error", "Update failed");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>Edit Income</Text>

          <TextInput
            value={form.title}
            onChangeText={v => setForm({ ...form, title: v })}
            style={styles.input}
            placeholder="Source Title"
          />

          <TextInput
            value={form.amount}
            onChangeText={v => setForm({ ...form, amount: v })}
            style={styles.input}
            keyboardType="numeric"
            placeholder="Amount"
          />

          <View style={styles.row}>
            <TouchableOpacity style={styles.cancel} onPress={onClose}>
              <Text>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.save} onPress={handleUpdate}>
              <Text style={{ color: "#fff" }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  box: {
    width: "88%",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 14,
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  cancel: { padding: 10 },
  save: { backgroundColor: "#22c55e", padding: 10, borderRadius: 8 },
});
