// app/login.tsx

import { useState } from "react";

import { Alert, Button, StyleSheet, TextInput, View } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { router } from "expo-router";

import { loginApi } from "../src/api/auth.api";

export default function Login() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const data = await loginApi(email, password);

      await AsyncStorage.setItem("token", data.token);

      Alert.alert("Login success");

      router.replace("/dashboard");
    } catch (err: any) {
      console.log(err);

      Alert.alert("Error", err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",

    padding: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",

    padding: 12,

    marginBottom: 12,

    borderRadius: 8,
  },
});
