import { Picker } from "@react-native-picker/picker";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  onPay: () => void;
  remainingAmount: number;
  paymentForm: {
    amount: string;
    method: string;
    note: string;
  };
  setPaymentForm: (form: any) => void;
}

export default function PaymentModal({
  visible,
  onClose,
  onPay,
  remainingAmount,
  paymentForm,
  setPaymentForm,
}: PaymentModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Create Payment</Text>
          <Text style={styles.remainingText}>
            Remaining: {remainingAmount} ₫
          </Text>

          <Text style={styles.label}>Amount</Text>

          <TextInput
            value={paymentForm.amount}
            onChangeText={(text) =>
              setPaymentForm({
                ...paymentForm,
                amount: text,
              })
            }
            keyboardType="numeric"
            style={styles.input}
          />

          <Text style={styles.label}>Method</Text>

          <Picker
            selectedValue={paymentForm.method}
            onValueChange={(value) =>
              setPaymentForm({
                ...paymentForm,
                method: value,
              })
            }
            style={styles.picker}
          >
            <Picker.Item label="CASH" value="CASH" />
            <Picker.Item label="BANK" value="BANK" />
          </Picker>

          <Text style={styles.label}>Note</Text>

          <TextInput
            value={paymentForm.note}
            onChangeText={(text) =>
              setPaymentForm({
                ...paymentForm,
                note: text,
              })
            }
            style={styles.input}
          />

          <View style={styles.modalButtons}>
            <Pressable style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.btnText}>Cancel</Text>
            </Pressable>

            <Pressable style={styles.payBtn} onPress={onPay}>
              <Text style={styles.btnText}>Pay</Text>
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
  remainingText: {
    marginBottom: 12,
    color: "red",
    fontWeight: "700",
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
  payBtn: {
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
