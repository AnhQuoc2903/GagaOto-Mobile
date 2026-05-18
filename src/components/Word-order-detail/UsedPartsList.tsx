import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface UsedPartsListProps {
  usedParts: any[];
  onRemovePart: (partId: string) => void;
}

export default function UsedPartsList({
  usedParts,
  onRemovePart,
}: UsedPartsListProps) {
  if (usedParts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cube-outline" size={48} color="#cbd5e1" />
        <Text style={styles.emptyText}>No parts used</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="cube-outline" size={24} color="#3b82f6" />
        <Text style={styles.title}>Used Parts</Text>
        <Text style={styles.count}>{usedParts.length} items</Text>
      </View>

      {usedParts.map((item: any) => (
        <View key={item._id} style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.partInfo}>
              <Text style={styles.partName}>{item.inventory?.name}</Text>
              <Text style={styles.partQuantity}>Quantity: {item.quantity}</Text>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => onRemovePart(item._id)}
            >
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.partPrice}>
              Price: {(item.inventory?.price || 0).toLocaleString()} ₫
            </Text>
            <Text style={styles.partTotal}>
              Total:{" "}
              {((item.inventory?.price || 0) * item.quantity).toLocaleString()}{" "}
              ₫
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 8,
    color: "#1e293b",
  },
  count: {
    marginLeft: "auto",
    fontSize: 14,
    color: "#64748b",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 12,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 16,
    color: "#94a3b8",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  partInfo: {
    flex: 1,
  },
  partName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  partQuantity: {
    fontSize: 14,
    color: "#64748b",
  },
  removeButton: {
    padding: 8,
    backgroundColor: "#fef2f2",
    borderRadius: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  partPrice: {
    fontSize: 14,
    color: "#64748b",
  },
  partTotal: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3b82f6",
  },
});
