import api from "./api";

export async function getCategories(params) {
  const res = await api.get("/categories", { params });
  return res.data;
}

export async function getCategoryById(id) {
  const res = await api.get(`/categories/${id}`);
  return res.data;
}

export async function createCategory(payload) {
  const res = await api.post("/categories", payload);
  return res.data;
}

export async function updateCategory(id, payload) {
  const res = await api.put(`/categories/${id}`, payload);
  return res.data;
}

export async function deleteCategory(id) {
  const res = await api.delete(`/categories/${id}`);
  return res.data;
}
