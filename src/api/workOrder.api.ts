import API from "./axios";

// =========================
// GET ALL
// =========================
export const getWorkOrdersApi = async () => {
  const res = await API.get("/work-orders");

  return res.data;
};

// =========================
// GET ONE
// =========================
export const getWorkOrderApi = async (id: string) => {
  const res = await API.get(`/work-orders/${id}`);

  return res.data;
};

// =========================
// CREATE
// =========================
export const createWorkOrderApi = async (data: any) => {
  const res = await API.post("/work-orders", data);

  return res.data;
};

// =========================
// UPDATE STATUS
// =========================
export const updateStatusApi = async (id: string, status: string) => {
  const res = await API.put(`/work-orders/${id}/status`, {
    status,
  });

  return res.data;
};

// =========================
// CANCEL
// =========================
export const cancelWorkOrderApi = async (id: string) => {
  const res = await API.put(`/work-orders/${id}/cancel`);

  return res.data;
};

// =========================
// ASSIGN TECHNICIAN
// =========================
export const assignTechnicianApi = async (id: string, technician: string) => {
  const res = await API.put(`/work-orders/${id}/assign`, {
    technician,
  });

  return res.data;
};

// =========================
// ADD PART
// =========================
export const addPartApi = async (
  id: string,
  inventory: string,
  quantity: number,
) => {
  const res = await API.post(`/work-orders/${id}/parts`, {
    inventory,
    quantity,
  });

  return res.data;
};

// =========================
// REMOVE PART
// =========================
export const removePartApi = async (id: string, partId: string) => {
  const res = await API.delete(`/work-orders/${id}/parts/${partId}`);

  return res.data;
};

// =========================
// UPLOAD IMAGES
// =========================
export const uploadImagesApi = async (
  id: string,
  files: any[],
  type = "ISSUE",
) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", {
      uri: file.uri,
      name: file.name || "image.jpg",
      type: file.mimeType || "image/jpeg",
    } as any);
  });

  formData.append("type", type);

  const res = await API.post(`/work-orders/${id}/images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// =========================
// DELETE IMAGE
// =========================
export const deleteImageApi = async (id: string, imageId: string) => {
  const res = await API.delete(`/work-orders/${id}/images/${imageId}`);

  return res.data;
};

// =========================
// EXPORT INVOICE
// =========================
export const getInvoiceUrl = (id: string) => {
  return `http://192.168.1.224:5000/api/work-orders/${id}/invoice`;
};
