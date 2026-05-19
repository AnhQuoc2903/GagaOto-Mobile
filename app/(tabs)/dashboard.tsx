import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

import { getDashboardApi } from "../../src/api/dashboard.api";
import { DashboardResponse } from "../../src/types/dashboard.type";

const { width } = Dimensions.get("window");

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

  const statsCards = [
    {
      title: "Monthly Revenue",
      value: `$${data?.monthlyRevenue?.toLocaleString() || 0}`,
      icon: "cash-outline",
      gradient: ["#3b82f6", "#2563eb"] as const,
      color: "#3b82f6",
    },
    {
      title: "Work Orders",
      value: data?.workOrders?.toLocaleString() || "0",
      icon: "construct-outline",
      gradient: ["#8b5cf6", "#7c3aed"] as const,
      color: "#8b5cf6",
    },
    {
      title: "Low Stock Items",
      value: data?.lowStock?.toLocaleString() || "0",
      icon: "cube-outline",
      gradient: ["#f59e0b", "#d97706"] as const,
      color: "#f59e0b",
    },
    {
      title: "Unpaid Debt",
      value: `$${data?.unpaidDebt?.toLocaleString() || 0}`,
      icon: "warning-outline",
      gradient: ["#ef4444", "#dc2626"] as const,
      color: "#ef4444",
    },
  ];

  // Prepare chart data
  const chartLabels = data?.revenueChart?.map((item) => item.date) || [];
  const chartData = data?.revenueChart?.map((item) => item.revenue) || [];

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>
          Welcome back! Here&apos;s your overview
        </Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {statsCards.map((stat, index) => (
          <View key={index} style={styles.statCardWrapper}>
            <LinearGradient
              colors={stat.gradient}
              style={styles.statCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.statIconContainer}>
                <Ionicons name={stat.icon as any} size={24} color="#fff" />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </LinearGradient>
          </View>
        ))}
      </View>

      {/* Revenue Chart */}
      {chartData.length > 0 && (
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View style={styles.chartTitleContainer}>
              <Ionicons name="trending-up" size={20} color="#3b82f6" />
              <Text style={styles.chartTitle}>Revenue Trend</Text>
            </View>
            <View style={styles.chartBadge}>
              <Text style={styles.chartBadgeText}>Last 7 days</Text>
            </View>
          </View>

          <LineChart
            data={{
              labels: chartLabels,
              datasets: [{ data: chartData }],
            }}
            width={width - 40}
            height={220}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#3b82f6",
              },
            }}
            bezier
            style={styles.chart}
            formatYLabel={(value: string) =>
              `$${parseInt(value).toLocaleString()}`
            }
          />
        </View>
      )}

      {/* Revenue Details */}
      <View style={styles.detailsCard}>
        <View style={styles.detailsHeader}>
          <Ionicons name="calendar" size={20} color="#3b82f6" />
          <Text style={styles.detailsTitle}>Daily Revenue Details</Text>
        </View>

        {data?.revenueChart?.map((item, index) => (
          <View
            key={item.date}
            style={[
              styles.detailItem,
              index === (data.revenueChart?.length || 0) - 1 &&
                styles.lastDetailItem,
            ]}
          >
            <View style={styles.dateContainer}>
              <View style={styles.dateBadge}>
                <Text style={styles.dateText}>{item.date}</Text>
              </View>
            </View>
            <View style={styles.revenueContainer}>
              <Ionicons name="cash-outline" size={16} color="#10b981" />
              <Text style={styles.revenueText}>
                ${item.revenue?.toLocaleString() || 0}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: "#f8fafc",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748b",
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
  },
  statsGrid: {
    marginBottom: 24,
    gap: 16,
  },

  statCardWrapper: {
    width: "100%",
  },
  statCard: {
    borderRadius: 24,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  chartTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  chartBadge: {
    backgroundColor: "#eff6ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  chartBadgeText: {
    fontSize: 11,
    color: "#3b82f6",
    fontWeight: "600",
  },
  chart: {
    borderRadius: 16,
    marginLeft: -20,
  },
  detailsCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  detailsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  lastDetailItem: {
    borderBottomWidth: 0,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateBadge: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1e293b",
  },
  revenueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  revenueText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#10b981",
  },
});
