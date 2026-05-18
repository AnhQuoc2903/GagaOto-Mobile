import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getDashboardApi } from "../src/api/dashboard.api";

import { DashboardResponse } from "../src/types/dashboard";

export default function Dashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await getDashboardApi();

      setData(res);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Monthly Revenue</Text>

        <Text style={styles.value}>${data?.monthlyRevenue}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Work Orders</Text>

        <Text style={styles.value}>{data?.workOrders}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Low Stock</Text>

        <Text style={styles.value}>{data?.lowStock}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Unpaid Debt</Text>

        <Text style={styles.value}>${data?.unpaidDebt}</Text>
      </View>

      <Text style={styles.subtitle}>Revenue Chart</Text>

      {data?.revenueChart.map((item) => (
        <View key={item.date} style={styles.chartItem}>
          <Text>{item.date}</Text>

          <Text>${item.revenue}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 30,
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,

    elevation: 3,
  },

  label: {
    fontSize: 16,
    color: "#666",
  },

  value: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },

  chartItem: {
    flexDirection: "row",
    justifyContent: "space-between",

    paddingVertical: 10,

    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
