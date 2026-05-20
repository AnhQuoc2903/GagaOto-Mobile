import API from "./axios";

export const loginApi = async (email: string, password: string) => {
  const res = await API.post("/auth/login", {
    email,
    password,
  });

  return res.data;
};

export const getMeApi = async () => {
  const res = await API.get("/auth/me");

  return res.data;
};

export const refreshTokenAPI = (refreshToken: string) =>
  API.post("/auth/refresh", {
    refreshToken,
  });

// 🔥 NEW
export const logoutAPI = (refreshToken: string) =>
  API.post("/auth/logout", {
    refreshToken,
  });
