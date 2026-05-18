import API from "./axios";
export const createPaymentApi = async (data: any) => {
  const res = await API.post("/payments", data);

  return res.data;
};

export const getPaymentsApi = async (workOrderId: string) => {
  const res = await API.get(`/payments/${workOrderId}`);

  return res.data;
};
