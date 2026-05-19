// app/inventory/edit-inventory.tsx

import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { getInventories, updateInventory } from "../../src/api/inventory.api";

export default function EditInventoryScreen() {
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [form, setForm] = useState<any>({
    name: "",
    price: "",
    minStock: "",
  });

  const fetchItem = async () => {
    try {
      const res = await getInventories();
      const found = res.data.find((x: any) => x._id === id);

      if (found) {
        setForm({
          name: found.name,
          price: String(found.price),
          minStock: String(found.minStock),
        });
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to load product data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, []);

  const handleUpdate = async () => {
    if (!form.name.trim()) {
      Alert.alert("Error", "Please enter product name");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      Alert.alert("Error", "Please enter a valid price");
      return;
    }

    if (!form.minStock || Number(form.minStock) < 0) {
      Alert.alert("Error", "Please enter a valid minimum stock");
      return;
    }

    setUpdating(true);
    try {
      await updateInventory(id as string, {
        name: form.name.trim(),
        price: Number(form.price),
        minStock: Number(form.minStock),
      });

      Alert.alert("Success", "Product updated successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Form */}
        <View style={styles.form}>
          {/* Name Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Product Name <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="cube-outline"
                size={20}
                color="#9ca3af"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={(v) => setForm({ ...form, name: v })}
                placeholder="Enter product name"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          {/* Price Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Price <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="cash-outline"
                size={20}
                color="#9ca3af"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={form.price}
                onChangeText={(v) => setForm({ ...form, price: v })}
                placeholder="Enter price"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
              />
              <Text style={styles.currencyText}>₫</Text>
            </View>
          </View>

          {/* Min Stock Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Minimum Stock <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="alert-circle-outline"
                size={20}
                color="#9ca3af"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={form.minStock}
                onChangeText={(v) => setForm({ ...form, minStock: v })}
                placeholder="Enter minimum stock level"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
              />
              <Text style={styles.unitText}>units</Text>
            </View>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#3b82f6"
            />
            <Text style={styles.infoText}>
              Minimum stock is the threshold that triggers a low stock alert
            </Text>
          </View>
        </View>

        {/* Update Button */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.updateButton, updating && styles.buttonDisabled]}
            onPress={handleUpdate}
            disabled={updating}
          >
            <LinearGradient
              colors={["#3b82f6", "#2563eb"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              {updating ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Ionicons name="save-outline" size={20} color="#fff" />
                  <Text style={styles.updateButtonText}>Update Product</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },

  form: {
    paddingHorizontal: 20,
    marginTop: 20,
  },

  fieldContainer: {
    marginBottom: 24,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginLeft: 4,
  },

  required: {
    color: "#ef4444",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 16,
    minHeight: 54,
  },

  inputIcon: {
    marginRight: 12,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#1f2937",
    paddingVertical: 14,
  },

  currencyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3b82f6",
    marginLeft: 8,
  },

  unitText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 8,
  },

  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    gap: 12,
  },

  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#3b82f6",
    lineHeight: 18,
  },

  actionContainer: {
    paddingHorizontal: 20,
    marginTop: 32,
  },

  updateButton: {
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  gradientButton: {
    flexDirection: "row",
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  updateButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
