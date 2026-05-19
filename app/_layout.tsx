import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen
        name="create-work-order"
        options={{
          title: "Create Work Order",
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="work-order-detail"
        options={{
          title: "Work Order Detail",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
