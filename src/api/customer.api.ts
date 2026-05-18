import API from "./axios";

export const getCustomersApi = async () => {
  const res = await API.get("/customers");
  return res.data;
};
