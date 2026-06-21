import api from "./api";

export async function getSuppliers(params) {
  const res = await api.get("/suppliers", { params });
  return res;
}

export async function getSupplierById(id) {
  const res = await api.get(`/suppliers/${id}`);
  return res;
}

export async function createSupplier(payload) {
  const res = await api.post("/suppliers", payload);
  return res;
}

export async function updateSupplier(id, payload) {
  const res = await api.put(`/suppliers/${id}`, payload);
  return res;
}

export async function deleteSupplier(id) {
  const res = await api.delete(`/suppliers/${id}`);
  return res;
}
