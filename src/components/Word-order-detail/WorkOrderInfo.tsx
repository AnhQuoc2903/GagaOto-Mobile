import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface WorkOrderInfoProps {
  data: any;
  paidAmount: number;
  remainingAmount: number;
}

export default function WorkOrderInfo({
  data,
  paidAmount,
  remainingAmount,
}: WorkOrderInfoProps) {
  const infoItems = [
    { icon: "person-outline", label: "Customer", value: data?.customer?.name },
    { icon: "car-outline", label: "Vehicle", value: data?.vehicle?.plate },
    {
      icon: "construct-outline",
      label: "Technician",
      value: data?.technician?.name || "Not assigned",
    },
    { icon: "flag-outline", label: "Priority", value: data?.priority },
    {
      icon: "cash-outline",
      label: "Payment Status",
      value: data?.paymentStatus,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.costRow}>
          <View style={styles.costItem}>
            <Text style={styles.costLabel}>Labor Cost</Text>
            <Text style={styles.costValue}>{data?.laborCost || 0} ₫</Text>
          </View>
          <View style={styles.costDivider} />
          <View style={styles.costItem}>
            <Text style={styles.costLabel}>Parts Total</Text>
            <Text style={styles.costValue}>{data?.partsTotal || 0} ₫</Text>
          </View>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>{data?.total || 0} ₫</Text>
        </View>

        <View style={styles.paymentProgress}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(paidAmount / (data?.total || 1)) * 100}%` },
              ]}
            />
          </View>
          <View style={styles.paymentDetails}>
            <View style={styles.paymentInfo}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={styles.paidText}>
                Paid: {paidAmount.toLocaleString()} ₫
              </Text>
            </View>
            <View style={styles.paymentInfo}>
              <Ionicons name="alert-circle" size={16} color="#ef4444" />
              <Text style={styles.remainingText}>
                Remaining: {remainingAmount.toLocaleString()} ₫
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {infoItems.map((item, index) => (
          <View key={index} style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name={item.icon as any} size={20} color="#3b82f6" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  costRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  costItem: {
    flex: 1,
    alignItems: "center",
  },
  costLabel: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 4,
  },
  costValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  costDivider: {
    width: 1,
    backgroundColor: "#e2e8f0",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#eff6ff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2563eb",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1e40af",
  },
  paymentProgress: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10b981",
    borderRadius: 4,
  },
  paymentDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  paymentInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  paidText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10b981",
  },
  remainingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ef4444",
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
});
