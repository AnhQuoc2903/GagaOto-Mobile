// app/login.tsx

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { loginApi } from "../src/api/auth.api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Error", "Please enter your password");
      return;
    }

    setLoading(true);
    try {
      const data = await loginApi(email, password);
      await AsyncStorage.setItem("accessToken", data.accessToken);

      await AsyncStorage.setItem("refreshToken", data.refreshToken);

      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      Alert.alert("Success", "Login successful!");
      router.replace("/(tabs)/dashboard");
    } catch (err: any) {
      Alert.alert("Error", err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Gradient */}
          <LinearGradient
            colors={["#3b82f6", "#2563eb", "#1d4ed8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Ionicons name="storefront-outline" size={60} color="#fff" />
              </View>
              <Text style={styles.appName}>Welcome Back</Text>
              <Text style={styles.appSubtitle}>Sign in to continue</Text>
            </View>
          </LinearGradient>

          {/* Form Container */}
          <View style={styles.formContainer}>
            <View style={styles.formCard}>
              {/* Email Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color="#9ca3af"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Enter your email"
                    placeholderTextColor="#cbd5e1"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={styles.input}
                  />
                </View>
              </View>

              {/* Password Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#9ca3af"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Enter your password"
                    placeholderTextColor="#cbd5e1"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#9ca3af"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={loading}
              >
                <LinearGradient
                  colors={["#3b82f6", "#2563eb"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  {loading ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <Text style={styles.loginButtonText}>Sign In</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Demo Credentials */}
            </View>

            {/* Sign Up Link */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  scrollContent: {
    flexGrow: 1,
  },

  header: {
    paddingTop: Platform.OS === "ios" ? 80 : 60,
    paddingBottom: 60,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  logoContainer: {
    alignItems: "center",
  },

  logo: {
    width: 100,
    height: 100,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  appName: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },

  appSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },

  formContainer: {
    flex: 1,
    marginTop: -30,
    paddingHorizontal: 20,
  },

  formCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },

  inputGroup: {
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginLeft: 4,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 16,
  },

  inputIcon: {
    marginRight: 12,
  },

  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1e293b",
  },

  eyeIcon: {
    padding: 8,
  },

  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },

  forgotPasswordText: {
    color: "#3b82f6",
    fontSize: 14,
    fontWeight: "600",
  },

  loginButton: {
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 20,
  },

  gradientButton: {
    paddingVertical: 16,
    alignItems: "center",
  },

  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  demoContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },

  demoTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  demoCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },

  demoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});
