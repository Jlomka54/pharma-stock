import api from "./api";

export async function getStockOperations(params) {
  const res = await api.get("/stock-operations", { params });
  return res.data;
}

export async function getStockOperationById(id) {
  const res = await api.get(`/stock-operations/${id}`);
  return res.data;
}

export async function createStockOperation(payload) {
  const res = await api.post("/stock-operations", payload);
  return res.data;
}

export async function updateStockOperation(id, payload) {
  const res = await api.put(`/stock-operations/${id}`, payload);
  return res.data;
}

export async function deleteStockOperation(id) {
  const res = await api.delete(`/stock-operations/${id}`);
  return res.data;
}
