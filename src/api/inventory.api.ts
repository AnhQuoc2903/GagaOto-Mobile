import API from "./axios";

// ================= GET ALL =================
export const getInventories = async (page = 1, keyword = "") => {
  const res = await API.get("/inventory", {
    params: {
      page,
      keyword,
    },
  });

  return res.data;
};

// ================= GET LOW STOCK =================
export const getLowStock = async () => {
  const res = await API.get("/inventory/low-stock");
  return res.data;
};

// ================= GET LOGS =================
export const getInventoryLogs = async () => {
  const res = await API.get("/inventory/logs");
  return res.data;
};

// ================= CREATE =================
export const createInventory = async (data: {
  name: string;
  price?: number;
  minStock?: number;
}) => {
  const res = await API.post("/inventory", data);
  return res.data;
};

// ================= UPDATE =================
export const updateInventory = async (id: string, data: any) => {
  const res = await API.put(`/inventory/${id}`, data);
  return res.data;
};

// ================= DELETE =================
export const deleteInventory = async (id: string) => {
  const res = await API.delete(`/inventory/${id}`);
  return res.data;
};

// ================= EXPORT =================
export const exportInventory = async (
  id: string,
  data: {
    quantity: number;
    reason?: string;
  },
) => {
  const res = await API.post(`/inventory/${id}/export`, data);

  return res.data;
};

// ================= ADJUST =================
export const adjustInventory = async (
  id: string,
  data: {
    quantity: number;
    reason?: string;
  },
) => {
  const res = await API.post(`/inventory/${id}/adjust`, data);

  return res.data;
};
