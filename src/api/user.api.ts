import API from "./axios";

export const getUsersApi = async () => {
  const res = await API.get("/users");
  return res.data;
};
