import API from "./axios";

import { DashboardResponse } from "../types/dashboard.type";

export const getDashboardApi = async (): Promise<DashboardResponse> => {
  const res = await API.get("/reports/dashboard");

  return res.data;
};
