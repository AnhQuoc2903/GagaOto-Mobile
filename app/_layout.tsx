import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        {/* TABS */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* WORK ORDER */}
        <Stack.Screen
          name="work-order/create-work-order"
          options={{
            title: "Create Work Order",
            headerShown: true,
          }}
        />

        <Stack.Screen
          name="work-order/work-order-detail"
          options={{
            title: "Work Order Detail",
            headerShown: true,
          }}
        />

        {/* CUSTOMER */}
        <Stack.Screen
          name="customer/create-customers"
          options={{
            title: "Create Customer",
            headerShown: true,
          }}
        />

        <Stack.Screen
          name="customer/customer-detail"
          options={{
            title: "Customer Detail",
            headerShown: true,
          }}
        />

        <Stack.Screen
          name="customer/edit-customer"
          options={{
            title: "Edit Customer",
            headerShown: true,
          }}
        />

        <Stack.Screen
          name="inventory/inventory-detail"
          options={{
            title: "Inventory Detail",
            headerShown: true,
          }}
        />

        <Stack.Screen
          name="inventory/create-inventory"
          options={{
            title: "Create Inventory",
            headerShown: true,
          }}
        />

        <Stack.Screen
          name="inventory/edit-inventory"
          options={{
            title: "Edit Inventory",
            headerShown: true,
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
