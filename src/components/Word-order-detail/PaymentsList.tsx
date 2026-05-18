import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface PaymentsListProps {
  payments: any[];
}

export default function PaymentsList({ payments }: PaymentsListProps) {
  if (payments.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cash-outline" size={48} color="#cbd5e1" />
        <Text style={styles.emptyText}>No payments</Text>
      </View>
    );
  }

  // Tính tổng số tiền đã thanh toán
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="cash-outline" size={24} color="#3b82f6" />
          <Text style={styles.title}>Payments</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.paymentCount}>{payments.length}</Text>
          <Text style={styles.totalPaid}>
            Total: {totalPaid.toLocaleString()} ₫
          </Text>
        </View>
      </View>

      {payments.map((p: any, index: number) => (
        <View key={p._id} style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Amount</Text>
              <Text style={styles.amountValue}>
                {p.amount.toLocaleString()} ₫
              </Text>
            </View>
            <View
              style={[
                styles.methodBadge,
                p.method === "CASH" ? styles.cashBadge : styles.bankBadge,
              ]}
            >
              <Ionicons
                name={p.method === "CASH" ? "cash-outline" : "business-outline"}
                size={14}
                color="#fff"
              />
              <Text style={styles.methodText}>{p.method}</Text>
            </View>
          </View>

          {p.note && p.note !== "-" && (
            <View style={styles.noteContainer}>
              <Ionicons
                name="document-text-outline"
                size={16}
                color="#64748b"
              />
              <Text style={styles.noteText}>Note: {p.note}</Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.cardFooter}>
            <View style={styles.footerItem}>
              <View style={styles.iconCircle}>
                <Ionicons name="person-outline" size={12} color="#3b82f6" />
              </View>
              <Text style={styles.footerText}>
                {p.createdBy?.name || "System"}
              </Text>
            </View>
            <View style={styles.footerItem}>
              <View style={styles.iconCircle}>
                <Ionicons name="time-outline" size={12} color="#3b82f6" />
              </View>
              <Text style={styles.footerText}>
                {new Date(p.createdAt).toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Hiển thị số thứ tự nếu có nhiều payment */}
          {payments.length > 1 && (
            <View style={styles.paymentIndex}>
              <Text style={styles.indexText}>#{index + 1}</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  paymentCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  totalPaid: {
    fontSize: 14,
    fontWeight: "700",
    color: "#10b981",
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginTop: 8,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#94a3b8",
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    position: "relative",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  amountContainer: {
    flex: 1,
  },
  amountLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
    fontWeight: "500",
  },
  amountValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#059669",
  },
  methodBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  cashBadge: {
    backgroundColor: "#10b981",
  },
  bankBadge: {
    backgroundColor: "#3b82f6",
  },
  methodText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  noteContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 10,
  },
  noteText: {
    fontSize: 13,
    color: "#475569",
    flex: 1,
    lineHeight: 18,
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
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  iconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  paymentIndex: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  indexText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
});
