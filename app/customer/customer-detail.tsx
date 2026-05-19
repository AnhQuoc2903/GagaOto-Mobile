// app/customer-detail.tsx

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getCustomerById, getCustomerDebt } from "../../src/api/customer.api";

export default function CustomerDetailScreen() {
  const { id } = useLocalSearchParams();

  const [customer, setCustomer] = useState<any>(null);
  const [debt, setDebt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [customerRes, debtRes] = await Promise.all([
        getCustomerById(id as string),
        getCustomerDebt(id as string),
      ]);

      setCustomer(customerRes.data);
      setDebt(debtRes.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerSection}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{customer.name}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              router.push({
                pathname: "/customer/edit-customer",
                params: { id: customer._id },
              })
            }
          >
            <Ionicons name="create-outline" size={22} color="#3b82f6" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Contact Information */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Contact Information</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="call-outline" size={20} color="#3b82f6" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>{customer.phone}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="location-outline" size={20} color="#3b82f6" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>
                {customer.address || "Not provided"}
              </Text>
            </View>
          </View>

          {customer.note && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons
                    name="document-text-outline"
                    size={20}
                    color="#3b82f6"
                  />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Note</Text>
                  <Text style={styles.infoValue}>{customer.note}</Text>
                </View>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Debt Summary */}
      <View style={styles.debtSection}>
        <Text style={styles.sectionTitle}>Financial Summary</Text>

        <View style={styles.debtCards}>
          <View style={[styles.debtCard, styles.totalCard]}>
            <Text style={styles.debtCardLabel}>Total Debt</Text>
            <Text style={styles.debtCardValue}>
              {debt?.total?.toLocaleString()}đ
            </Text>
          </View>

          <View style={[styles.debtCard, styles.paidCard]}>
            <Text style={styles.debtCardLabel}>Paid</Text>
            <Text style={[styles.debtCardValue, styles.paidValue]}>
              {debt?.paid?.toLocaleString()}đ
            </Text>
          </View>

          <View style={[styles.debtCard, styles.remainingCard]}>
            <Text style={styles.debtCardLabel}>Remaining</Text>
            <Text
              style={[
                styles.debtCardValue,
                debt?.remaining > 0 ? styles.remainingValue : styles.zeroValue,
              ]}
            >
              {debt?.remaining?.toLocaleString()}đ
            </Text>
          </View>
        </View>
      </View>

      {/* Orders List */}
      <View style={styles.ordersSection}>
        <View style={styles.ordersHeader}>
          <Text style={styles.sectionTitle}>Order History</Text>
          <View style={styles.orderCount}>
            <Text style={styles.orderCountText}>
              {debt?.details?.length || 0} orders
            </Text>
          </View>
        </View>

        {debt?.details?.length > 0 ? (
          debt.details.map((item: any, index: number) => (
            <TouchableOpacity
              key={item._id}
              style={styles.orderCard}
              activeOpacity={0.7}
              onPress={() => {
                // Navigate to order detail if needed
                console.log("Order pressed:", item._id);
              }}
            >
              <View style={styles.orderHeader}>
                <View style={styles.orderNumber}>
                  <Text style={styles.orderNumberText}>Order #{index + 1}</Text>
                </View>
              </View>

              <View style={styles.orderDetails}>
                <View style={styles.orderRow}>
                  <View style={styles.orderLabelContainer}>
                    <Ionicons name="car-outline" size={16} color="#6b7280" />
                    <Text style={styles.orderLabel}>Vehicle:</Text>
                  </View>
                  <Text style={styles.orderValue}>{item.vehicle || "N/A"}</Text>
                </View>

                <View style={styles.orderRow}>
                  <View style={styles.orderLabelContainer}>
                    <Ionicons name="cash-outline" size={16} color="#6b7280" />
                    <Text style={styles.orderLabel}>Total:</Text>
                  </View>
                  <Text style={styles.orderValue}>
                    {item.total?.toLocaleString()}đ
                  </Text>
                </View>

                <View style={styles.orderRow}>
                  <View style={styles.orderLabelContainer}>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={16}
                      color="#6b7280"
                    />
                    <Text style={styles.orderLabel}>Paid:</Text>
                  </View>
                  <Text style={styles.orderValue}>
                    {item.paid?.toLocaleString()}đ
                  </Text>
                </View>

                <View style={styles.orderRow}>
                  <View style={styles.orderLabelContainer}>
                    <Ionicons
                      name="alert-circle-outline"
                      size={16}
                      color="#6b7280"
                    />
                    <Text style={styles.orderLabel}>Remaining:</Text>
                  </View>
                  <Text
                    style={[
                      styles.orderValue,
                      item.remaining > 0
                        ? styles.remainingText
                        : styles.zeroText,
                    ]}
                  >
                    {item.remaining?.toLocaleString()}đ
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyOrders}>
            <Ionicons name="receipt-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyOrdersText}>No orders found</Text>
            <Text style={styles.emptyOrdersSubtext}>
              This customer hasn&apos;t placed any orders yet
            </Text>
          </View>
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
  },

  headerSection: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f2937",
    flex: 1,
  },

  editButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#eff6ff",
  },

  infoSection: {
    padding: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 12,
  },

  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 2,
  },

  infoValue: {
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "500",
  },

  divider: {
    height: 1,
    backgroundColor: "#f3f4f6",
    marginVertical: 12,
  },

  debtSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  debtCards: {
    flexDirection: "row",
    gap: 12,
  },

  debtCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  totalCard: {
    backgroundColor: "#fff",
  },

  paidCard: {
    backgroundColor: "#fff",
  },

  remainingCard: {
    backgroundColor: "#fff",
  },

  debtCardLabel: {
    fontSize: 11,
    color: "#6b7280",
    marginBottom: 6,
  },

  debtCardValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1f2937",
  },

  paidValue: {
    color: "#10b981",
  },

  remainingValue: {
    color: "#ef4444",
  },

  zeroValue: {
    color: "#10b981",
  },

  ordersSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  ordersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  orderCount: {
    backgroundColor: "#eff6ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  orderCountText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3b82f6",
  },

  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },

  orderNumber: {
    flexDirection: "row",
    alignItems: "center",
  },

  orderNumberText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },

  orderDetails: {
    padding: 12,
  },

  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  orderLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  orderLabel: {
    fontSize: 13,
    color: "#6b7280",
  },

  orderValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1f2937",
  },

  remainingText: {
    color: "#ef4444",
    fontWeight: "700",
  },

  zeroText: {
    color: "#10b981",
  },

  emptyOrders: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#fff",
    borderRadius: 16,
  },

  emptyOrdersText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
    marginTop: 12,
  },

  emptyOrdersSubtext: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 4,
  },
});
