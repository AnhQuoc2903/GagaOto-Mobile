import { Picker } from "@react-native-picker/picker";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface AddPartModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: () => void;
  inventories: any[];
  partForm: {
    inventory: string;
    quantity: string;
  };
  setPartForm: (form: any) => void;
}

export default function AddPartModal({
  visible,
  onClose,
  onAdd,
  inventories,
  partForm,
  setPartForm,
}: AddPartModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Part</Text>

          <Text style={styles.label}>Inventory</Text>

          <Picker
            selectedValue={partForm.inventory}
            onValueChange={(value) =>
              setPartForm({
                ...partForm,
                inventory: value,
              })
            }
            style={styles.picker}
          >
            <Picker.Item label="Select Part" value="" />

            {inventories.map((i: any) => (
              <Picker.Item
                key={i._id}
                label={`${i.name} | Stock: ${i.quantity}`}
                value={i._id}
              />
            ))}
          </Picker>

          <Text style={styles.label}>Quantity</Text>

          <TextInput
            value={partForm.quantity}
            onChangeText={(text) =>
              setPartForm({
                ...partForm,
                quantity: text,
              })
            }
            keyboardType="numeric"
            style={styles.input}
          />

          <View style={styles.modalButtons}>
            <Pressable style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.btnText}>Cancel</Text>
            </Pressable>

            <Pressable style={styles.addBtn} onPress={onAdd}>
              <Text style={styles.btnText}>Add</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  label: {
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#ef4444",
    padding: 14,
    borderRadius: 12,
    marginRight: 10,
    alignItems: "center",
  },
  addBtn: {
    flex: 1,
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 12,
  },
});
