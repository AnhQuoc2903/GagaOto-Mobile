import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { LinearGradient } from "expo-linear-gradient";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { deleteInventory, getInventories } from "../../src/api/inventory.api";

const { width } = Dimensions.get("window");

export default function InventoryScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    try {
      const res = await getInventories();
      const data = res.data || [];
      setItems(data);
      setFilteredItems(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setFilteredItems(items);
    } else {
      const filtered = items.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredItems(filtered);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    Alert.alert("Delete Item", `Are you sure you want to delete "${name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteInventory(id);
            const updatedItems = items.filter((x) => x._id !== id);
            setItems(updatedItems);
            setFilteredItems(updatedItems);
            Alert.alert("Success", "Item deleted successfully");
          } catch (err) {
            Alert.alert("Error", "Failed to delete item");
          }
        },
      },
    ]);
  };

  const getStockStatus = (quantity: number, minStock: number) => {
    if (quantity <= 0)
      return {
        label: "Out of Stock",
        color: "#ef4444",
        gradient: ["#ef4444", "#dc2626"],
      };
    if (quantity <= minStock)
      return {
        label: "Low Stock",
        color: "#f59e0b",
        gradient: ["#f59e0b", "#d97706"],
      };
    return {
      label: "In Stock",
      color: "#10b981",
      gradient: ["#10b981", "#059669"],
    };
  };

  const renderInventoryCard = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => {
    const stockStatus = getStockStatus(item.quantity, item.minStock);
    const totalValue = item.quantity * item.price;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() =>
          router.push({
            pathname: "/inventory/inventory-detail",
            params: { id: item._id },
          })
        }
      >
        <LinearGradient
          colors={["#ffffff", "#fefefe"]}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Status Indicator Line */}
          <View
            style={[styles.statusLine, { backgroundColor: stockStatus.color }]}
          />

          <View style={styles.cardContent}>
            {/* Header */}
            <View style={styles.cardHeader}>
              <View style={styles.iconWrapper}>
                <LinearGradient
                  colors={["#3b82f6", "#2563eb"]}
                  style={styles.iconGradient}
                >
                  <Ionicons name="cube" size={24} color="#fff" />
                </LinearGradient>
              </View>
              <View style={styles.nameSection}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.name}
                </Text>
                <View
                  style={[
                    styles.stockBadge,
                    { backgroundColor: stockStatus.color + "15" },
                  ]}
                >
                  <Text
                    style={[styles.stockText, { color: stockStatus.color }]}
                  >
                    {stockStatus.label}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => handleDelete(item._id, item.name)}
                style={styles.deleteBtn}
              >
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <View style={styles.statIconBg}>
                  <Ionicons name="layers-outline" size={18} color="#3b82f6" />
                </View>
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
                <View style={styles.statIconBg}>
                  <Ionicons name="cash-outline" size={18} color="#10b981" />
                </View>
                <Text style={styles.statLabel}>Price</Text>
                <Text style={styles.statValue}>
                  {item.price?.toLocaleString()}đ
                </Text>
              </View>

              <View style={styles.statBox}>
                <View style={styles.statIconBg}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={18}
                    color="#f59e0b"
                  />
                </View>
                <Text style={styles.statLabel}>Min Stock</Text>
                <Text style={styles.statValue}>{item.minStock}</Text>
              </View>
            </View>

            {/* Total Value */}
            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>Total Value</Text>
              <Text style={styles.totalValue}>
                {totalValue?.toLocaleString()}đ
              </Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#3b82f6", "#2563eb", "#1d4ed8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Inventory</Text>
            <Text style={styles.subtitle}>
              {filteredItems.length}{" "}
              {filteredItems.length === 1 ? "item" : "items"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push("/inventory/create-inventory")}
          >
            <Ionicons name="add" size={28} color="#3b82f6" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#94a3b8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery !== "" && (
              <TouchableOpacity onPress={() => handleSearch("")}>
                <Ionicons name="close-circle" size={20} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <LinearGradient
            colors={["#eff6ff", "#dbeafe"]}
            style={styles.statsCard}
          >
            <Ionicons name="cube-outline" size={28} color="#3b82f6" />
            <Text style={styles.statsNumber}>{items.length}</Text>
            <Text style={styles.statsLabel}>Total Items</Text>
          </LinearGradient>

          <LinearGradient
            colors={["#fef3c7", "#fde68a"]}
            style={styles.statsCard}
          >
            <Ionicons name="warning-outline" size={28} color="#d97706" />
            <Text style={styles.statsNumber}>
              {
                items.filter(
                  (item) => item.quantity <= item.minStock && item.quantity > 0,
                ).length
              }
            </Text>
            <Text style={styles.statsLabel}>Low Stock</Text>
          </LinearGradient>

          <LinearGradient
            colors={["#fee2e2", "#fecaca"]}
            style={styles.statsCard}
          >
            <Ionicons name="close-circle-outline" size={28} color="#dc2626" />
            <Text style={styles.statsNumber}>
              {items.filter((item) => item.quantity === 0).length}
            </Text>
            <Text style={styles.statsLabel}>Out of Stock</Text>
          </LinearGradient>
        </View>

        {/* List */}
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#3b82f6"
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="cube-outline" size={80} color="#cbd5e1" />
              <Text style={styles.emptyTitle}>No items found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery
                  ? "Try a different search term"
                  : "Tap + to add your first item"}
              </Text>
            </View>
          }
          renderItem={renderInventoryCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </View>
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

  headerGradient: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#fff",
  },

  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },

  addBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },

  content: {
    flex: 1,
    marginTop: -20,
    paddingHorizontal: 16,
  },

  searchWrapper: {
    marginBottom: 16,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderRadius: 16,
    height: 50,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1f2937",
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },

  statsCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 16,
    gap: 6,
  },

  statsNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1f2937",
  },

  statsLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#475569",
  },

  listContent: {
    paddingBottom: 20,
  },

  card: {
    borderRadius: 20,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  statusLine: {
    height: 4,
    width: "100%",
  },

  cardContent: {
    padding: 16,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },

  iconWrapper: {
    borderRadius: 14,
    overflow: "hidden",
  },

  iconGradient: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  nameSection: {
    flex: 1,
    gap: 4,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
  },

  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: "flex-start",
  },

  stockText: {
    fontSize: 10,
    fontWeight: "700",
  },

  deleteBtn: {
    padding: 6,
    backgroundColor: "#fef2f2",
    borderRadius: 10,
  },

  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },

  statBox: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingVertical: 10,
    borderRadius: 12,
    gap: 4,
  },

  statIconBg: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  statLabel: {
    fontSize: 10,
    color: "#94a3b8",
    fontWeight: "500",
  },

  statValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1f2937",
  },

  warningText: {
    color: "#f59e0b",
  },

  dangerText: {
    color: "#ef4444",
  },

  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },

  totalLabel: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "500",
  },

  totalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3b82f6",
  },

  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#64748b",
    marginTop: 16,
  },

  emptySubtitle: {
    fontSize: 14,
    color: "#94a3b8",
    marginTop: 6,
    textAlign: "center",
  },
});
