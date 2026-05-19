import API from "./axios";

export const getCustomersApi = async () => {
  const res = await API.get("/customers");
  return res.data;
};

export const getCustomerById = (id: string) => API.get(`/customers/${id}`);

export const createCustomer = (data: {
  name: string;
  phone: string;
  address?: string;
  note?: string;
}) => API.post("/customers", data);

export const updateCustomer = (id: string, data: any) =>
  API.put(`/customers/${id}`, data);

export const deleteCustomer = (id: string) => API.delete(`/customers/${id}`);

export const getCustomerDebt = (id: string) => API.get(`/customers/${id}/debt`);
