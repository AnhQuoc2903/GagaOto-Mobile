import { useCallback, useEffect, useState } from "react";

import {
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import { getWorkOrdersApi } from "../../src/api/workOrder.api";

import {
  getPaymentStatusColor,
  getPriorityColor,
  getStatusBgColor,
  getStatusColor,
} from "../../src/utils/StatusColor";

export default function WorkOrders() {
  const [data, setData] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterWorkOrders();
  }, [searchQuery, data]);

  const fetchData = async () => {
    try {
      const res = await getWorkOrdersApi();
      setData(res);
      setFilteredData(res);
    } catch (err) {
      console.log(err);
    }
  };

  const filterWorkOrders = () => {
    if (!searchQuery.trim()) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter(
      (item) =>
        item.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customer?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.vehicle?.plate?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredData(filtered);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  const getPriorityIcon = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case "HIGH":
        return "alert-circle";
      case "MEDIUM":
        return "warning";
      case "LOW":
        return "information-circle";
      default:
        return "flag-outline";
    }
  };

  const renderWorkOrderCard = ({ item }: { item: any }) => (
    <Pressable
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/work-order/work-order-detail",
          params: {
            id: item._id,
          },
        })
      }
    >
      <View style={styles.cardHeader}>
        <View style={styles.codeContainer}>
          <LinearGradient
            colors={["#3b82f6", "#2563eb"]}
            style={styles.iconGradient}
          >
            <Ionicons name="receipt-outline" size={20} color="#fff" />
          </LinearGradient>
          <Text style={styles.code}>{item.code}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusBgColor(item.status) },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          />
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="person-outline" size={16} color="#64748b" />
            <Text style={styles.infoLabel}>Customer:</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {item.customer?.name}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="car-outline" size={16} color="#64748b" />
            <Text style={styles.infoLabel}>Vehicle:</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {item.vehicle?.plate}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons
              name={getPriorityIcon(item.priority)}
              size={16}
              color={getPriorityColor(item.priority)}
            />
            <Text style={styles.infoLabel}>Priority:</Text>
            <Text
              style={[
                styles.priorityValue,
                { color: getPriorityColor(item.priority) },
              ]}
            >
              {item.priority || "NORMAL"}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons
              name="cash-outline"
              size={16}
              color={getPaymentStatusColor(item.paymentStatus)}
            />
            <Text style={styles.infoLabel}>Payment:</Text>
            <Text
              style={[
                styles.paymentValue,
                { color: getPaymentStatusColor(item.paymentStatus) },
              ]}
            >
              {item.paymentStatus}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardFooter}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>
            {item.total?.toLocaleString() || 0} ₫
          </Text>
        </View>
        <View style={styles.arrowIcon}>
          <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* Header Gradient */}
      <LinearGradient
        colors={["#3b82f6", "#2563eb", "#1d4ed8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Work Orders</Text>
            <Text style={styles.headerSubtitle}>
              {filteredData.length}{" "}
              {filteredData.length === 1 ? "order" : "orders"} total
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#94a3b8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by code, customer or vehicle..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#94a3b8" />
              </Pressable>
            )}
          </View>
        </View>

        <Pressable
          style={styles.createBtn}
          onPress={() => router.push("/work-order/create-work-order")}
        >
          <LinearGradient
            colors={["#3b82f6", "#2563eb"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.createGradient}
          >
            <Ionicons name="add-circle-outline" size={24} color="#fff" />
            <Text style={styles.createText}>Create New Work Order</Text>
          </LinearGradient>
        </Pressable>

        {filteredData.length === 0 && !refreshing && (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={80} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>No work orders found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? "Try adjusting your search"
                : "Create your first work order to get started"}
            </Text>
          </View>
        )}

        <FlatList
          data={filteredData}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#3b82f6"
            />
          }
          renderItem={renderWorkOrderCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
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

  headerGradient: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  header: {
    paddingHorizontal: 20,
  },

  headerTitle: {
    fontSize: 34,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },

  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },

  content: {
    flex: 1,
    marginTop: -20,
    paddingHorizontal: 16,
  },

  searchWrapper: {
    marginBottom: 12,
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

  createBtn: {
    borderRadius: 16,
    overflow: "hidden",
    marginVertical: 12,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  createGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 8,
  },

  createText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  listContainer: {
    paddingBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  iconGradient: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  code: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },

  infoSection: {
    marginBottom: 12,
    gap: 8,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },

  infoLabel: {
    fontSize: 13,
    color: "#64748b",
  },

  infoValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1e293b",
    flex: 1,
  },

  priorityValue: {
    fontSize: 13,
    fontWeight: "600",
  },

  paymentValue: {
    fontSize: 13,
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 12,
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalContainer: {
    flex: 1,
  },

  totalLabel: {
    fontSize: 11,
    color: "#64748b",
    marginBottom: 2,
  },

  totalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3b82f6",
  },

  arrowIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginTop: 16,
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
  },
});
