import API from "./axios";

export const getUsersApi = async () => {
  const res = await API.get("/users");
  return res.data;
};

export const updateProfile = (data: { name: string }) =>
  API.put("/users/profile", data);

// CHANGE PASSWORD
export const changePassword = (data: {
  oldPassword: string;
  newPassword: string;
}) => API.put("/users/change-password", data);

// UPLOAD AVATAR
export const uploadAvatar = (formData: FormData) =>
  API.post("/users/profile/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
