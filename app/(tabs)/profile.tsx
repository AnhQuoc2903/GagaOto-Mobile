import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";

import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { getMeApi } from "../../src/api/auth.api";
import {
  changePassword,
  updateProfile,
  uploadAvatar,
} from "../../src/api/user.api";

const { width } = Dimensions.get("window");

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    fetchMe();
  }, []);

  const fetchMe = async () => {
    try {
      const res = await getMeApi();
      setUser(res);
      setName(res.name);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({ name });
      Alert.alert("Success", "Profile updated successfully!");
      fetchMe();
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || "Update failed");
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return Alert.alert("Error", "Please fill all password fields");
    }

    if (newPassword.length < 6) {
      return Alert.alert("Error", "Password must be at least 6 characters");
    }

    if (newPassword !== confirmPassword) {
      return Alert.alert("Error", "Confirm password does not match");
    }

    try {
      await changePassword({ oldPassword, newPassword });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      Alert.alert("Success", "Password changed successfully!");
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Change password failed",
      );
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled) return;

    const image = result.assets[0];
    const formData = new FormData();
    formData.append("image", {
      uri: image.uri,
      type: "image/jpeg",
      name: "avatar.jpg",
    } as any);

    try {
      await uploadAvatar(formData);
      Alert.alert("Success", "Avatar uploaded successfully!");
      fetchMe();
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || "Upload failed");
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          router.replace("/login");
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Background */}
        <LinearGradient
          colors={["#6366f1", "#8b5cf6", "#a855f7"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          {/* Avatar Section */}
          <View style={styles.avatarContainer}>
            <TouchableOpacity
              style={styles.avatarWrapper}
              onPress={handlePickImage}
              activeOpacity={0.8}
            >
              {user?.avatar?.url ? (
                <Image
                  source={{ uri: user.avatar.url }}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={60} color="#fff" />
                </View>
              )}
              <View style={styles.editIcon}>
                <Ionicons name="camera" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={styles.userName}>
              {name || user?.email?.split("@")[0]}
            </Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>
                {user?.role === "admin"
                  ? "Administrator"
                  : user?.role || "Member"}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Content */}
        <View style={styles.content}>
          {/* Tab Bar */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "profile" && styles.activeTab]}
              onPress={() => setActiveTab("profile")}
            >
              <Ionicons
                name="person-outline"
                size={22}
                color={activeTab === "profile" ? "#6366f1" : "#94a3b8"}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === "profile" && styles.activeTabText,
                ]}
              >
                Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "password" && styles.activeTab]}
              onPress={() => setActiveTab("password")}
            >
              <Ionicons
                name="lock-closed-outline"
                size={22}
                color={activeTab === "password" ? "#6366f1" : "#94a3b8"}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === "password" && styles.activeTabText,
                ]}
              >
                Security
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === "profile" && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons
                  name="person-circle-outline"
                  size={24}
                  color="#6366f1"
                />
                <Text style={styles.cardTitle}>Personal Information</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color="#94a3b8"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                    placeholderTextColor="#cbd5e1"
                    style={styles.input}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleUpdateProfile}
              >
                <LinearGradient
                  colors={["#6366f1", "#8b5cf6"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === "password" && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={24}
                  color="#6366f1"
                />
                <Text style={styles.cardTitle}>Change Password</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Current Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="key-outline"
                    size={20}
                    color="#94a3b8"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    secureTextEntry={!showPassword}
                    placeholder="Enter current password"
                    placeholderTextColor="#cbd5e1"
                    value={oldPassword}
                    onChangeText={setOldPassword}
                    style={styles.input}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>New Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#94a3b8"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    secureTextEntry={!showPassword}
                    placeholder="Enter new password"
                    placeholderTextColor="#cbd5e1"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    style={styles.input}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="checkmark-done-outline"
                    size={20}
                    color="#94a3b8"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    secureTextEntry={!showPassword}
                    placeholder="Confirm new password"
                    placeholderTextColor="#cbd5e1"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    style={styles.input}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.showPasswordButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#6366f1"
                />
                <Text style={styles.showPasswordText}>
                  {showPassword ? "Hide Password" : "Show Password"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.changePasswordButton}
                onPress={handleChangePassword}
              >
                <LinearGradient
                  colors={["#ef4444", "#f43f5e"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.saveButtonText}>Update Password</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#ef4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    alignItems: "center",
  },
  avatarWrapper: {
    position: "relative",
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#fff",
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#fff",
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#6366f1",
    borderRadius: 20,
    padding: 8,
    borderWidth: 3,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginTop: 16,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    marginTop: -20,
    paddingHorizontal: 20,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 6,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  activeTab: {
    backgroundColor: "#eef2ff",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#94a3b8",
  },
  activeTabText: {
    color: "#6366f1",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
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
  saveButton: {
    marginTop: 8,
    borderRadius: 14,
    overflow: "hidden",
  },
  changePasswordButton: {
    marginTop: 8,
    borderRadius: 14,
    overflow: "hidden",
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  showPasswordButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  showPasswordText: {
    color: "#6366f1",
    fontSize: 14,
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#fee2e2",
  },
  logoutText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "600",
  },
  versionText: {
    textAlign: "center",
    color: "#cbd5e1",
    fontSize: 12,
    marginBottom: 30,
  },
});
