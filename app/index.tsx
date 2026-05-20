import AsyncStorage from "@react-native-async-storage/async-storage";

import { Redirect } from "expo-router";

import { useEffect, useState } from "react";

import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const [loading, setLoading] = useState(true);

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const refreshToken = await AsyncStorage.getItem("refreshToken");

    setLoggedIn(!!refreshToken);

    setLoading(false);
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return loggedIn ? (
    <Redirect href="/(tabs)/dashboard" />
  ) : (
    <Redirect href="/login" />
  );
}
