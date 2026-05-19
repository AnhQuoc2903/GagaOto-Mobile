import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getInventoriesApi } from "../../src/api/inventory.api";
import { createPaymentApi, getPaymentsApi } from "../../src/api/payment.api";
import {
  addPartApi,
  deleteImageApi,
  getInvoiceUrl,
  getWorkOrderApi,
  removePartApi,
  updateStatusApi,
  uploadImagesApi,
} from "../../src/api/workOrder.api";

// Import components
import AddPartModal from "../../src/components/Word-order-detail/AddPartModal";
import HistoryList from "../../src/components/Word-order-detail/HistoryList";
import ImagesList from "../../src/components/Word-order-detail/ImagesList";
import PaymentModal from "../../src/components/Word-order-detail/PaymentModal";
import PaymentsList from "../../src/components/Word-order-detail/PaymentsList";
import UsedPartsList from "../../src/components/Word-order-detail/UsedPartsList";
import WorkOrderInfo from "../../src/components/Word-order-detail/WorkOrderInfo";

export default function WorkOrderDetail() {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState<any>();
  const [inventories, setInventories] = useState<any[]>([]);
  const [showAddPartModal, setShowAddPartModal] = useState(false);
  const [partForm, setPartForm] = useState({
    inventory: "",
    quantity: "1",
  });
  const [payments, setPayments] = useState<any[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    method: "CASH",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const statusOptions = ["PENDING", "IN_PROGRESS", "DONE", "CANCELLED"];
  const paidAmount = data?.paidAmount || 0;
  const totalAmount = data?.total || 0;
  const remainingAmount = totalAmount - paidAmount;
  const isLocked = data?.status === "DONE" || data?.status === "CANCELLED";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "#f59e0b";
      case "IN_PROGRESS":
        return "#3b82f6";
      case "DONE":
        return "#10b981";
      case "CANCELLED":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getWorkOrderApi(id as string);
      const invRes = await getInventoriesApi();
      const payRes = await getPaymentsApi(id as string);
      setData(res);
      setInventories(invRes);
      setPayments(payRes);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleUpdateStatus = async (status: string) => {
    try {
      if (status === data?.status) return;
      setLoading(true);
      await updateStatusApi(id as string, status);
      await fetchData();
    } catch (err: any) {
      console.log(err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPart = async () => {
    try {
      if (!partForm.inventory) return;
      setLoading(true);
      await addPartApi(
        id as string,
        partForm.inventory,
        Number(partForm.quantity),
      );
      setShowAddPartModal(false);
      setPartForm({ inventory: "", quantity: "1" });
      await fetchData();
    } catch (err: any) {
      console.log(err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePart = async (partId: string) => {
    try {
      setLoading(true);
      await removePartApi(id as string, partId);
      await fetchData();
    } catch (err: any) {
      console.log(err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.7,
        allowsMultipleSelection: true,
      });
      if (result.canceled) return;
      setLoading(true);
      await uploadImagesApi(id as string, result.assets, "ISSUE");
      await fetchData();
    } catch (err: any) {
      console.log(err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      setLoading(true);
      await deleteImageApi(id as string, imageId);
      await fetchData();
    } catch (err: any) {
      console.log(err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const openInvoice = async () => {
    try {
      const url = getInvoiceUrl(id as string);
      await Linking.openURL(url);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreatePayment = async () => {
    try {
      const amount = Number(paymentForm.amount);
      if (amount > remainingAmount) {
        alert("Amount exceeds remaining");
        return;
      }
      setLoading(true);
      await createPaymentApi({
        workOrderId: id,
        amount: Number(paymentForm.amount),
        method: paymentForm.method,
        note: paymentForm.note,
      });
      setShowPaymentModal(false);
      setPaymentForm({ amount: "", method: "CASH", note: "" });
      await fetchData();
    } catch (err: any) {
      console.log(err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header với Status Badge */}
      <View style={styles.header}>
        <Text style={styles.title}>{data?.code}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(data?.status) },
          ]}
        >
          <Text style={styles.statusText}>{data?.status}</Text>
        </View>
      </View>

      <WorkOrderInfo
        data={data}
        paidAmount={paidAmount}
        remainingAmount={remainingAmount}
      />

      {/* Update Status Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Ionicons name="refresh-circle" size={24} color="#3b82f6" />
          <Text style={styles.section}>Update Status</Text>
        </View>
        <View style={styles.pickerContainer}>
          <Picker
            enabled={data?.status !== "DONE" && data?.status !== "CANCELLED"}
            selectedValue={data?.status}
            onValueChange={handleUpdateStatus}
            style={styles.picker}
            dropdownIconColor="#3b82f6"
          >
            <Picker.Item
              label={data?.status || "PENDING"}
              value={data?.status || "PENDING"}
            />
            {statusOptions.map((s: string) => (
              <Picker.Item key={s} label={s} value={s} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.addPartButton,
            isLocked && styles.disabledButton,
          ]}
          disabled={isLocked}
          onPress={() => setShowAddPartModal(true)}
        >
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>ADD PART</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.uploadButton,
            isLocked && styles.disabledButton,
          ]}
          disabled={isLocked}
          onPress={handleUploadImage}
        >
          <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>UPLOAD IMAGE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.invoiceButton]}
          onPress={openInvoice}
        >
          <Ionicons name="document-text-outline" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>OPEN INVOICE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            data?.paymentStatus === "PAID"
              ? styles.paidButton
              : styles.paymentButton,
            isLocked && styles.disabledButton,
          ]}
          disabled={data?.paymentStatus === "PAID" || isLocked}
          onPress={() => setShowPaymentModal(true)}
        >
          <Ionicons
            name={
              data?.paymentStatus === "PAID"
                ? "checkmark-circle"
                : "card-outline"
            }
            size={24}
            color="#fff"
          />
          <Text style={styles.actionButtonText}>
            {data?.paymentStatus === "PAID" ? "FULLY PAID" : "CREATE PAYMENT"}
          </Text>
        </TouchableOpacity>
      </View>

      <AddPartModal
        visible={showAddPartModal}
        onClose={() => setShowAddPartModal(false)}
        onAdd={handleAddPart}
        inventories={inventories}
        partForm={partForm}
        setPartForm={setPartForm}
      />

      <PaymentModal
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPay={handleCreatePayment}
        remainingAmount={remainingAmount}
        paymentForm={paymentForm}
        setPaymentForm={setPaymentForm}
      />

      <UsedPartsList
        usedParts={data?.usedParts || []}
        onRemovePart={handleRemovePart}
        isLocked={isLocked}
      />

      <ImagesList
        images={data?.images || []}
        onDeleteImage={handleDeleteImage}
        isLocked={isLocked}
      />

      <HistoryList history={data?.history || []} />

      <PaymentsList payments={payments} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1e293b",
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 0.5,
  },
  sectionContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  section: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 8,
    color: "#1e293b",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  picker: {
    backgroundColor: "#fff",
    height: 50,
  },
  actionButtons: {
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  addPartButton: {
    backgroundColor: "#3b82f6",
  },
  uploadButton: {
    backgroundColor: "#8b5cf6",
  },
  invoiceButton: {
    backgroundColor: "#10b981",
  },
  paymentButton: {
    backgroundColor: "#f59e0b",
  },
  paidButton: {
    backgroundColor: "#6b7280",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
