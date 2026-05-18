import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ImagesListProps {
  images: any[];
  onDeleteImage: (imageId: string) => void;
}

export default function ImagesList({ images, onDeleteImage }: ImagesListProps) {
  if (images.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="images-outline" size={48} color="#cbd5e1" />
        <Text style={styles.emptyText}>No images</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="images-outline" size={24} color="#3b82f6" />
        <Text style={styles.title}>Images</Text>
        <Text style={styles.count}>{images.length} images</Text>
      </View>

      {images.map((img: any) => (
        <View key={img._id} style={styles.card}>
          <Image source={{ uri: img.url }} style={styles.image} />
          <View style={styles.imageInfo}>
            <View style={styles.imageType}>
              <Ionicons
                name="document-attach-outline"
                size={16}
                color="#64748b"
              />
              <Text style={styles.typeText}>Type: {img.type}</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDeleteImage(img._id)}
            >
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
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
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 220,
  },
  imageInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
  },
  imageType: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  typeText: {
    fontSize: 14,
    color: "#64748b",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#fef2f2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deleteText: {
    color: "#ef4444",
    fontWeight: "600",
    fontSize: 14,
  },
});
