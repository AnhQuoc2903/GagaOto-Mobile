// app/inventory/inventory-detail.tsx

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import { LinearGradient } from "expo-linear-gradient";
import {
  ActivityIndicator,
  Alert,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  adjustInventory,
  exportInventory,
  getInventories,
  getInventoryLogs,
} from "../../src/api/inventory.api";

export default function InventoryDetailScreen() {
  const { id } = useLocalSearchParams();

  const [item, setItem] = useState<any>(null);
  const [exportQty, setExportQty] = useState("");
  const [adjustQty, setAdjustQty] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exportReason, setExportReason] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [logs, setLogs] = useState<any[]>([]);

  const fetchItem = async () => {
    try {
      const res = await getInventories();
      const found = res.data.find((x: any) => x._id === id);
      setItem(found);

      const logRes = await getInventoryLogs();
      const filteredLogs = logRes.filter((x: any) => x.inventory?._id === id);
      setLogs(filteredLogs);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchItem();
  };

  const handleExport = async () => {
    if (!exportQty || Number(exportQty) <= 0) {
      Alert.alert("Error", "Please enter a valid quantity");
      return;
    }
    if (!exportReason.trim()) {
      Alert.alert("Error", "Please enter a reason");
      return;
    }

    try {
      await exportInventory(id as string, {
        quantity: Number(exportQty),
        reason: exportReason,
      });
      Alert.alert("Success", "Export successful");
      setExportQty("");
      setExportReason("");
      fetchItem();
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message);
    }
  };

  const handleAdjust = async () => {
    if (!adjustQty || Number(adjustQty) < 0) {
      Alert.alert("Error", "Please enter a valid quantity");
      return;
    }
    if (!adjustReason.trim()) {
      Alert.alert("Error", "Please enter a reason");
      return;
    }

    try {
      await adjustInventory(id as string, {
        quantity: Number(adjustQty),
        reason: adjustReason,
      });
      Alert.alert("Success", "Adjustment successful");
      setAdjustQty("");
      setAdjustReason("");
      fetchItem();
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message);
    }
  };

  const getStockStatus = (quantity: number, minStock: number) => {
    if (quantity <= 0)
      return { label: "Out of Stock", color: "#ef4444", bg: "#fee2e2" };
    if (quantity <= minStock)
      return { label: "Low Stock", color: "#f59e0b", bg: "#fed7aa" };
    return { label: "In Stock", color: "#10b981", bg: "#d1fae5" };
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.center}>
        <Ionicons name="cube-outline" size={64} color="#cbd5e1" />
        <Text style={styles.emptyText}>Item not found</Text>
      </View>
    );
  }

  const stockStatus = getStockStatus(item.quantity, item.minStock);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#3b82f6"
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/inventory/edit-inventory",
              params: { id: item._id },
            })
          }
          style={styles.editButton}
        >
          <Ionicons name="create-outline" size={22} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {/* Product Info Card */}
      <View style={styles.productCard}>
        <View style={styles.productHeader}>
          <LinearGradient
            colors={["#3b82f6", "#2563eb"]}
            style={styles.productIcon}
          >
            <Ionicons name="cube" size={32} color="#fff" />
          </LinearGradient>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.name}</Text>
            <View
              style={[styles.statusBadge, { backgroundColor: stockStatus.bg }]}
            >
              <Text style={[styles.statusText, { color: stockStatus.color }]}>
                {stockStatus.label}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Quantity</Text>
            <Text
              style={[
                styles.statValue,
                item.quantity <= item.minStock &&
                  item.quantity > 0 &&
                  styles.warningText,
                item.quantity === 0 && styles.dangerText,
              ]}
            >
              {item.quantity}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Price</Text>
            <Text style={styles.statValue}>
              {item.price?.toLocaleString()}₫
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Min Stock</Text>
            <Text style={styles.statValue}>{item.minStock}</Text>
          </View>
        </View>

        <View style={styles.totalValueBox}>
          <Text style={styles.totalLabel}>Total Value</Text>
          <Text style={styles.totalValue}>
            {(item.quantity * item.price)?.toLocaleString()}₫
          </Text>
        </View>
      </View>

      {/* Export Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="download-outline" size={22} color="#ef4444" />
          <Text style={styles.sectionTitle}>Export Stock</Text>
        </View>
        <View style={styles.inputWrapper}>
          <Ionicons
            name="layers-outline"
            size={20}
            color="#9ca3af"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            value={exportQty}
            onChangeText={setExportQty}
            placeholder="Quantity"
            placeholderTextColor="#9ca3af"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputWrapper}>
          <Ionicons
            name="document-text-outline"
            size={20}
            color="#9ca3af"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            value={exportReason}
            onChangeText={setExportReason}
            placeholder="Reason for export"
            placeholderTextColor="#9ca3af"
          />
        </View>
        <TouchableOpacity style={styles.exportBtn} onPress={handleExport}>
          <LinearGradient
            colors={["#ef4444", "#dc2626"]}
            style={styles.gradientBtn}
          >
            <Ionicons name="arrow-down-outline" size={20} color="#fff" />
            <Text style={styles.btnText}>Export Stock</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Adjust Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="sync-outline" size={22} color="#3b82f6" />
          <Text style={styles.sectionTitle}>Adjust Stock</Text>
        </View>
        <View style={styles.inputWrapper}>
          <Ionicons
            name="layers-outline"
            size={20}
            color="#9ca3af"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            value={adjustQty}
            onChangeText={setAdjustQty}
            placeholder="New quantity"
            placeholderTextColor="#9ca3af"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputWrapper}>
          <Ionicons
            name="document-text-outline"
            size={20}
            color="#9ca3af"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            value={adjustReason}
            onChangeText={setAdjustReason}
            placeholder="Reason for adjustment"
            placeholderTextColor="#9ca3af"
          />
        </View>
        <TouchableOpacity style={styles.adjustBtn} onPress={handleAdjust}>
          <LinearGradient
            colors={["#3b82f6", "#2563eb"]}
            style={styles.gradientBtn}
          >
            <Ionicons name="refresh-outline" size={20} color="#fff" />
            <Text style={styles.btnText}>Adjust Stock</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Logs Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="time-outline" size={22} color="#6b7280" />
          <Text style={styles.sectionTitle}>Inventory Logs</Text>
          <Text style={styles.logCount}>{logs.length} records</Text>
        </View>

        {logs.length === 0 ? (
          <View style={styles.emptyLogs}>
            <Ionicons name="document-text-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyLogsText}>No logs available</Text>
          </View>
        ) : (
          logs.map((log: any) => (
            <View key={log._id} style={styles.logCard}>
              <View style={styles.logHeader}>
                <View
                  style={[
                    styles.logType,
                    log.type === "EXPORT"
                      ? styles.logTypeExport
                      : styles.logTypeAdjust,
                  ]}
                >
                  <Text style={styles.logTypeText}>{log.type}</Text>
                </View>
                <Text style={styles.logDate}>
                  {new Date(log.createdAt).toLocaleString()}
                </Text>
              </View>
              <View style={styles.logDetails}>
                <View style={styles.logRow}>
                  <Text style={styles.logLabel}>Quantity:</Text>
                  <Text style={styles.logValue}>{log.quantity}</Text>
                </View>
                <View style={styles.logRow}>
                  <Text style={styles.logLabel}>Before → After:</Text>
                  <Text style={styles.logValue}>
                    {log.before ?? 0} → {log.after ?? 0}
                  </Text>
                </View>
                <View style={styles.logRow}>
                  <Text style={styles.logLabel}>Reason:</Text>
                  <Text style={styles.logValue}>{log.note || "-"}</Text>
                </View>
                <View style={styles.logRow}>
                  <Text style={styles.logLabel}>User:</Text>
                  <Text style={styles.logValue}>{log.user?.name || "-"}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
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
    gap: 12,
  },

  emptyText: {
    fontSize: 16,
    color: "#94a3b8",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: "#f8fafc",
  },

  backButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },

  editButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#eff6ff",
  },

  productCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  productHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },

  productIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  productInfo: {
    flex: 1,
    gap: 6,
  },

  productName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },

  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },

  statBox: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    gap: 4,
  },

  statLabel: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "500",
  },

  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },

  warningText: {
    color: "#f59e0b",
  },

  dangerText: {
    color: "#ef4444",
  },

  totalValueBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },

  totalLabel: {
    fontSize: 13,
    color: "#64748b",
  },

  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3b82f6",
  },

  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    flex: 1,
  },

  logCount: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "500",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 16,
    minHeight: 50,
    marginBottom: 12,
  },

  inputIcon: {
    marginRight: 12,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#1f2937",
    paddingVertical: 12,
  },

  exportBtn: {
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 4,
  },

  adjustBtn: {
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 4,
  },

  gradientBtn: {
    flexDirection: "row",
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  emptyLogs: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#fff",
    borderRadius: 16,
    gap: 8,
  },

  emptyLogsText: {
    fontSize: 14,
    color: "#94a3b8",
  },

  logCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  logHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  logType: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  logTypeExport: {
    backgroundColor: "#fee2e2",
  },

  logTypeAdjust: {
    backgroundColor: "#dbeafe",
  },

  logTypeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },

  logDate: {
    fontSize: 11,
    color: "#94a3b8",
  },

  logDetails: {
    gap: 6,
  },

  logRow: {
    flexDirection: "row",
    gap: 8,
  },

  logLabel: {
    fontSize: 13,
    color: "#64748b",
    width: 90,
  },

  logValue: {
    fontSize: 13,
    color: "#1f2937",
    fontWeight: "500",
    flex: 1,
  },
});
