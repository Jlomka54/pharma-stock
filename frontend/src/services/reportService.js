import api from "./api";

export async function getSummary(params) {
  const res = await api.get("/reports/summary", { params });
  return res.data;
}

export async function getLowStock(params) {
  const res = await api.get("/reports/low-stock", { params });
  return res.data;
}

export async function getExpiredProducts(params) {
  const res = await api.get("/reports/expired-products", { params });
  return res.data;
}
