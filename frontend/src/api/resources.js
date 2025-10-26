import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

// Use global axios instance with baseURL
axios.defaults.baseURL = baseURL;

export const getCategories = async () => {
  const res = await axios.get('/categories');
  return res.data;
};

export const createCategory = async (payload) => {
  const res = await axios.post('/categories', payload);
  return res.data;
};

export const deleteCategory = async (id) => {
  await axios.delete(`/categories/${id}`);
};

export const getItems = async () => {
  const res = await axios.get('/items');
  return res.data;
};

export const createItem = async (payload) => {
  const res = await axios.post('/items', payload);
  return res.data;
};

export const updateItem = async (id, payload) => {
  const res = await axios.put(`/items/${id}`, payload);
  return res.data;
};

export const deleteItem = async (id) => {
  await axios.delete(`/items/${id}`);
};

export const adjustItemStock = async (id, payload) => {
  const res = await axios.post(`/items/${id}/adjust-stock`, payload);
  return res.data;
};