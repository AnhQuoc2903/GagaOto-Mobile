import API from "./axios";

export const getInventoriesApi = async () => {
  const res = await API.get("/inventory");
  return res.data.data;
};
