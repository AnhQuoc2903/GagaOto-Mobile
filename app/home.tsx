import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Home() {
  const menuItems = [
    {
      id: 1,
      title: "Dashboard",
      description: "Revenue, stock, report",
      icon: "bar-chart-outline",
      route: "/dashboard",
      color: "#3b82f6",
      gradient: ["#3b82f6", "#2563eb"] as const,
    },
    {
      id: 2,
      title: "Work Orders",
      description: "Manage repair orders",
      icon: "construct-outline",
      route: "/work-orders",
      color: "#8b5cf6",
      gradient: ["#8b5cf6", "#7c3aed"] as const,
    },
    {
      id: 3,
      title: "Inventory",
      description: "Manage parts & supplies",
      icon: "cube-outline",
      route: "/inventory",
      color: "#10b981",
      gradient: ["#10b981", "#059669"] as const,
    },
    {
      id: 4,
      title: "Customers",
      description: "Manage customer info",
      icon: "people-outline",
      route: "/customers",
      color: "#f59e0b",
      gradient: ["#f59e0b", "#d97706"] as const,
    },
  ];

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800",
      }}
      style={styles.background}
      blurRadius={3}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={["#3b82f6", "#8b5cf6"]}
                style={styles.logoGradient}
              >
                <Ionicons name="build-outline" size={40} color="#fff" />
              </LinearGradient>
            </View>
            <Text style={styles.title}>GARA MOBILE</Text>
            <Text style={styles.subtitle}>Professional Auto Care</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="today-outline" size={24} color="#3b82f6" />
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Active Orders</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="people-outline" size={24} color="#8b5cf6" />
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>Happy Clients</Text>
            </View>
          </View>

          <View style={styles.menuGrid}>
            {menuItems.map((item) => (
              <Pressable
                key={item.id}
                style={styles.card}
                onPress={() => router.push(item.route)}
              >
                <LinearGradient
                  colors={item.gradient}
                  style={styles.cardGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.iconContainer}>
                    <Ionicons name={item.icon as any} size={32} color="#fff" />
                  </View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDesc}>{item.description}</Text>
                  <View style={styles.arrowContainer}>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                  </View>
                </LinearGradient>
              </Pressable>
            ))}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Version 1.0.0</Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  logoContainer: {
    marginBottom: 16,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#cbd5e1",
    textAlign: "center",
    letterSpacing: 1,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1e293b",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  menuGrid: {
    flex: 1,
    gap: 16,
  },
  card: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  cardGradient: {
    padding: 20,
    position: "relative",
  },
  iconContainer: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
    opacity: 0.9,
  },
  arrowContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#94a3b8",
  },
});
