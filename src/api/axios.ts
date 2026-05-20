/* eslint-disable import/no-named-as-default-member */
import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";

import { jwtDecode } from "jwt-decode";

const API = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

let isRefreshing = false;

// ================= CHECK EXPIRED =================

const isExpired = (token: string) => {
  try {
    const decoded: any = jwtDecode(token);

    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// ================= REQUEST =================

API.interceptors.request.use(
  async (config) => {
    let accessToken = await AsyncStorage.getItem("accessToken");

    const refreshToken = await AsyncStorage.getItem("refreshToken");

    // TOKEN EXPIRED
    if (
      typeof accessToken === "string" &&
      refreshToken &&
      isExpired(accessToken) &&
      !isRefreshing
    ) {
      try {
        isRefreshing = true;

        const response = await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`,
          {
            refreshToken,
          },
        );

        accessToken = response.data.accessToken as string;

        // SAVE TOKENS
        await AsyncStorage.setItem("accessToken", accessToken);

        await AsyncStorage.setItem("refreshToken", response.data.refreshToken);
      } catch {
        console.log("REFRESH FAILED");

        await AsyncStorage.clear();
      } finally {
        isRefreshing = false;
      }
    }

    // ATTACH TOKEN
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },

  (error) => Promise.reject(error),
);

// ================= RESPONSE =================

API.interceptors.response.use(
  (res) => res,

  async (error) => {
    const originalRequest = error.config;

    const isAuthPage =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh");

    if (isAuthPage) {
      return Promise.reject(error);
    }

    // TOKEN EXPIRED
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");

        if (!refreshToken) {
          await AsyncStorage.clear();

          return Promise.reject(error);
        }

        const response = await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`,
          {
            refreshToken,
          },
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // SAVE TOKENS
        await AsyncStorage.setItem("accessToken", accessToken);

        await AsyncStorage.setItem("refreshToken", newRefreshToken);

        // UPDATE HEADER
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // RETRY REQUEST
        return API(originalRequest);
      } catch (err) {
        await AsyncStorage.clear();

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default API;
