// app/(tabs)/customers.tsx

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { deleteCustomer, getCustomersApi } from "../../src/api/customer.api";

export default function CustomersScreen() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCustomers = async () => {
    try {
      const data = await getCustomersApi();
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (err) {
      Alert.alert("Error", "Failed to delete customer");

      if (__DEV__) {
        console.error("Delete customer error:", err);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCustomers();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchCustomers();
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(text.toLowerCase()) ||
          customer.phone.includes(text),
      );
      setFilteredCustomers(filtered);
    }
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      "Delete Customer",
      `Are you sure you want to delete "${name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCustomer(id);
              const updatedCustomers = customers.filter((x) => x._id !== id);
              setCustomers(updatedCustomers);
              setFilteredCustomers(updatedCustomers);
              Alert.alert("Success", "Customer deleted successfully");
            } catch {
              Alert.alert("Error", "Failed to delete customer");
            }
          },
        },
      ],
    );
  };

  const renderCustomerCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() =>
        router.push({
          pathname: "/customer/customer-detail",
          params: { id: item._id },
        })
      }
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.iconWrapper}>
            <LinearGradient
              colors={["#3b82f6", "#2563eb"]}
              style={styles.iconGradient}
            >
              <Ionicons name="person" size={24} color="#fff" />
            </LinearGradient>
          </View>
          <View style={styles.nameSection}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.phoneContainer}>
              <Ionicons name="call-outline" size={12} color="#6b7280" />
              <Text style={styles.phone}>{item.phone}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => handleDelete(item._id, item.name)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>

        {item.address ? (
          <View style={styles.addressContainer}>
            <Ionicons name="location-outline" size={14} color="#9ca3af" />
            <Text style={styles.address} numberOfLines={1}>
              {item.address}
            </Text>
          </View>
        ) : null}

        {item.note ? (
          <View style={styles.noteContainer}>
            <Ionicons name="document-text-outline" size={14} color="#9ca3af" />
            <Text style={styles.note} numberOfLines={1}>
              {item.note}
            </Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

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
            <Text style={styles.title}>Customers</Text>
            <Text style={styles.subtitle}>
              {filteredCustomers.length}{" "}
              {filteredCustomers.length === 1 ? "customer" : "customers"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push("/customer/create-customers")}
          >
            <Ionicons name="add" size={28} color="#3b82f6" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Content */}
      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#94a3b8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or phone..."
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

        {/* Stats Summary */}
        <View style={styles.statsRow}>
          <LinearGradient
            colors={["#eff6ff", "#dbeafe"]}
            style={styles.statsCard}
          >
            <Ionicons name="people-outline" size={28} color="#3b82f6" />
            <Text style={styles.statNumber}>{customers.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </LinearGradient>

          <LinearGradient
            colors={["#fef3c7", "#fde68a"]}
            style={styles.statsCard}
          >
            <Ionicons name="location-outline" size={28} color="#d97706" />
            <Text style={styles.statNumber}>
              {customers.filter((c) => c.address && c.address.trim()).length}
            </Text>
            <Text style={styles.statLabel}>Has Address</Text>
          </LinearGradient>

          <LinearGradient
            colors={["#f3e8ff", "#e9d5ff"]}
            style={styles.statsCard}
          >
            <Ionicons name="document-text-outline" size={28} color="#9333ea" />
            <Text style={styles.statNumber}>
              {customers.filter((c) => c.note && c.note.trim()).length}
            </Text>
            <Text style={styles.statLabel}>Has Note</Text>
          </LinearGradient>
        </View>

        {/* Customer List */}
        <FlatList
          data={filteredCustomers}
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
              <Ionicons name="people-outline" size={80} color="#cbd5e1" />
              <Text style={styles.emptyTitle}>No customers found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery
                  ? "Try a different search term"
                  : "Tap + to add your first customer"}
              </Text>
            </View>
          }
          renderItem={renderCustomerCard}
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

  statNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1f2937",
  },

  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#475569",
  },

  listContent: {
    paddingBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  cardContent: {
    flex: 1,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
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

  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  phone: {
    fontSize: 12,
    color: "#6b7280",
  },

  deleteButton: {
    padding: 6,
    backgroundColor: "#fef2f2",
    borderRadius: 10,
  },

  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },

  address: {
    fontSize: 13,
    color: "#6b7280",
    flex: 1,
  },

  noteContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  note: {
    fontSize: 12,
    color: "#9ca3af",
    flex: 1,
    fontStyle: "italic",
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
