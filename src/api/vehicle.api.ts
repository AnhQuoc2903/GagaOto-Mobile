import API from "./axios";

export const getVehiclesApi = async () => {
  const res = await API.get("/vehicles");
  return res.data;
};
