import api from "./api";

export async function getProducts(params) {
  const res = await api.get("/products", { params });
  return res;
}

export async function getProductById(id) {
  const res = await api.get(`/products/${id}`);
  return res;
}

export async function createProduct(payload) {
  const res = await api.post("/products", payload);
  return res;
}

export async function updateProduct(id, payload) {
  const res = await api.put(`/products/${id}`, payload);
  return res;
}

export async function deleteProduct(id) {
  const res = await api.delete(`/products/${id}`);
  return res;
}
