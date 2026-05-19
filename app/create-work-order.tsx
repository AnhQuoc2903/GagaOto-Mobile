import { useEffect, useState } from "react";

import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";

import { Picker } from "@react-native-picker/picker";

import DateTimePicker from "@react-native-community/datetimepicker";

import { router } from "expo-router";

import { getCustomersApi } from "../src/api/customer.api";
import { getUsersApi } from "../src/api/user.api";
import { getVehiclesApi } from "../src/api/vehicle.api";

import { createWorkOrderApi } from "../src/api/workOrder.api";

export default function CreateWorkOrder() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [form, setForm] = useState({
    customer: "",
    vehicle: "",
    technician: "",
    description: "",
    priority: "MEDIUM",
    laborCost: "",
    deadline: null as any,
  });

  useEffect(() => {
    loadRefs();
  }, []);

  const loadRefs = async () => {
    try {
      const cRes = await getCustomersApi();
      const vRes = await getVehiclesApi();
      const uRes = await getUsersApi();

      setCustomers(cRes);
      setVehicles(vRes);
      setUsers(uRes);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreate = async () => {
    try {
      if (!form.customer || !form.vehicle) {
        Alert.alert("Error", "Missing customer or vehicle");
        return;
      }

      await createWorkOrderApi({
        customer: form.customer,
        vehicle: form.vehicle,
        technician: form.technician || null,
        description: form.description,
        priority: form.priority,
        laborCost: Number(form.laborCost || 0),
        deadline: form.deadline,
      });

      Alert.alert("Success", "Work order created");

      router.back();
    } catch (err: any) {
      console.log(err?.response?.data || err.message);

      Alert.alert("Error", err?.response?.data?.message || "Create failed");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 120,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Create Work Order</Text>

      {/* CUSTOMER */}
      <Text style={styles.label}>Customer</Text>

      <Picker
        selectedValue={form.customer}
        onValueChange={(val) => setForm({ ...form, customer: val })}
        style={styles.input}
      >
        <Picker.Item label="Select customer" value="" />

        {customers.map((c) => (
          <Picker.Item key={c._id} label={c.name} value={c._id} />
        ))}
      </Picker>

      {/* VEHICLE */}
      <Text style={styles.label}>Vehicle</Text>

      <Picker
        selectedValue={form.vehicle}
        onValueChange={(val) => setForm({ ...form, vehicle: val })}
        style={styles.input}
      >
        <Picker.Item label="Select vehicle" value="" />

        {vehicles.map((v) => (
          <Picker.Item key={v._id} label={v.plate} value={v._id} />
        ))}
      </Picker>

      {/* TECHNICIAN */}
      <Text style={styles.label}>Technician</Text>

      <Picker
        selectedValue={form.technician}
        onValueChange={(val) => setForm({ ...form, technician: val })}
        style={styles.input}
      >
        <Picker.Item label="Assign technician" value="" />

        {users
          .filter((u) => u.role === "TECHNICIAN")
          .map((u) => (
            <Picker.Item key={u._id} label={u.name} value={u._id} />
          ))}
      </Picker>

      {/* PRIORITY */}
      <Text style={styles.label}>Priority</Text>

      <Picker
        selectedValue={form.priority}
        onValueChange={(val) => setForm({ ...form, priority: val })}
        style={styles.input}
      >
        <Picker.Item label="LOW" value="LOW" />
        <Picker.Item label="MEDIUM" value="MEDIUM" />
        <Picker.Item label="HIGH" value="HIGH" />
      </Picker>

      {/* LABOR COST */}
      <Text style={styles.label}>Labor Cost</Text>

      <TextInput
        value={form.laborCost}
        onChangeText={(text) => setForm({ ...form, laborCost: text })}
        keyboardType="numeric"
        placeholder="0"
        style={styles.input}
      />

      {/* DEADLINE */}
      <Text style={styles.label}>Deadline</Text>

      <Pressable style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text>
          {form.deadline
            ? new Date(form.deadline).toLocaleDateString()
            : "Select deadline"}
        </Text>
      </Pressable>

      {showDatePicker && (
        <DateTimePicker
          value={form.deadline ? new Date(form.deadline) : new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);

            if (selectedDate) {
              setForm({
                ...form,
                deadline: selectedDate.toISOString(),
              });
            }
          }}
        />
      )}

      {/* DESCRIPTION */}
      <Text style={styles.label}>Description</Text>

      <TextInput
        value={form.description}
        onChangeText={(text) => setForm({ ...form, description: text })}
        multiline
        placeholder="Repair description"
        style={[
          styles.input,
          {
            height: 120,
            textAlignVertical: "top",
            paddingTop: 12,
          },
        ]}
      />

      {/* BUTTON */}
      <Pressable
        style={[
          styles.button,
          (!form.customer || !form.vehicle) && {
            opacity: 0.5,
          },
        ]}
        disabled={!form.customer || !form.vehicle}
        onPress={handleCreate}
      >
        <Text style={styles.buttonText}>CREATE</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f7fb",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    marginTop: 40,
    marginBottom: 20,
  },

  label: {
    fontWeight: "700",
    marginTop: 15,
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 30,
    marginBottom: 40,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
