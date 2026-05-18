import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface HistoryListProps {
  history: any[];
}

const getActionIcon = (action: string) => {
  switch (action?.toLowerCase()) {
    case "created":
      return "add-circle";
    case "updated":
      return "create";
    case "deleted":
      return "trash";
    case "status changed":
      return "sync";
    default:
      return "time";
  }
};

export default function HistoryList({ history }: HistoryListProps) {
  if (history.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="time-outline" size={48} color="#cbd5e1" />
        <Text style={styles.emptyText}>No history</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="time-outline" size={24} color="#3b82f6" />
        <Text style={styles.title}>History</Text>
        <Text style={styles.count}>{history.length} records</Text>
      </View>

      {history.map((h: any, index: number) => (
        <View key={h._id} style={styles.timelineItem}>
          <View style={styles.timelineLeft}>
            <View style={styles.timelineIcon}>
              <Ionicons
                name={getActionIcon(h.action)}
                size={20}
                color="#3b82f6"
              />
            </View>
            {index < history.length - 1 && <View style={styles.timelineLine} />}
          </View>
          <View style={styles.timelineContent}>
            <View style={styles.historyCard}>
              <Text style={styles.actionText}>{h.action}</Text>
              <Text style={styles.userText}>
                <Ionicons name="person-outline" size={12} />{" "}
                {h.user?.name || "System"}
              </Text>
              <Text style={styles.timeText}>
                {new Date(h.time).toLocaleString()}
              </Text>
            </View>
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
  timelineItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  timelineLeft: {
    width: 40,
    alignItems: "center",
    position: "relative",
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  timelineLine: {
    position: "absolute",
    top: 32,
    width: 2,
    height: "100%",
    backgroundColor: "#e2e8f0",
  },
  timelineContent: {
    flex: 1,
    marginLeft: 8,
  },
  historyCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  userText: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 2,
  },
  timeText: {
    fontSize: 11,
    color: "#94a3b8",
  },
});
