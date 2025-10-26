import axios from 'axios';

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8080/api';
axios.defaults.baseURL = API_BASE_URL;

/* ================================
   Customers (admin)
================================ */
export const getAllCustomers = () => axios.get('/admin/customers');
export const searchCustomers = (q) => axios.get('/admin/customers/search', { params: { q } });
export const deleteCustomer = (id) => axios.delete(`/admin/customers/${id}`);

/* ================================
   Bungalow History (admin)
================================ */
export const getAllHistory = () => axios.get('/admin/bungalow/history');
export const getHistoryById = (id) => axios.get(`/admin/bungalow/history/${id}`);
export const createHistory = (data) => axios.post('/admin/bungalow/history', data);
export const updateHistory = (id, data) => axios.put(`/admin/bungalow/history/${id}`, data);
export const deleteHistory = (id) => axios.delete(`/admin/bungalow/history/${id}`);

/* ================================
   FAQs
================================ */
export const getPublicFaqs = () => axios.get('/FAQs');
export const getAllFaqsAdmin = () => axios.get('/admin/FAQs');
export const createFaq = (data) => axios.post('/admin/FAQs', data);
export const updateFaq = (id, data) => axios.put(`/admin/FAQs/${id}`, data);
export const deleteFaq = (id) => axios.delete(`/admin/FAQs/${id}`);

/* ================================
   Attractions
================================ */
export const getPublicAttractions = () => axios.get('/attractions');
export const getAllAttractionsAdmin = () => axios.get('/admin/attractions');
export const createAttraction = (data) => axios.post('/admin/attractions', data);
export const updateAttraction = (id, data) => axios.put(`/admin/attractions/${id}`, data);
export const deleteAttraction = (id) => axios.delete(`/admin/attractions/${id}`);

/* ================================
   Room Reservation
================================ */
const ROOMS_BASE_URL = '/rooms';
export const roomApi = {
  async getAllRooms(page = 0, size = 20, sort = 'id,desc') {
    const res = await axios.get(`${ROOMS_BASE_URL}?page=${page}&size=${size}&sort=${sort}`);
    return res.data;
  },
  async getRoom(id) {
    const res = await axios.get(`${ROOMS_BASE_URL}/${id}`);
    return res.data;
  },
  async createRoom(dto) {
    const res = await axios.post(ROOMS_BASE_URL, dto);
    return res.data;
  },
  async updateRoom(id, dto) {
    const res = await axios.put(`${ROOMS_BASE_URL}/${id}`, dto);
    return res.data;
  },
  async deleteRoom(id) {
    const res = await axios.delete(`${ROOMS_BASE_URL}/${id}`);
    return res.data;
  },
};

/* ================================
   Messages (customer + admin)
================================ */
export const getMessagesByEmail = (email) =>
  axios.get('/customers/Requests', { params: { email } });

export const createMessage = (data) =>
  axios.post('/customers/Requests', data);

export const getAllMessagesAdmin = () =>
  axios.get('/admin/Requests');

export const markMessageAsDone = (id) =>
  axios.put(`/admin/Requests/${id}/done`);

/* ================================
   Notifications
================================ */
export async function getNotifications() {
  const res = await axios.get('/notifications');
  return res.data;
}

export async function clearNotifications() {
  await axios.delete('/notifications');
}

/* ================================
   Seasonal Rates (global)
================================ */
export const getAllSeasonalRates = () => axios.get('/admin/seasonal_rates');
export const getSeasonalRate = (id) => axios.get(`/admin/seasonal_rates/${id}`);
export const createSeasonalRate = (data) => axios.post('/admin/seasonal_rates', data);
export const updateSeasonalRate = (id, data) => axios.put(`/admin/seasonal_rates/${id}`, data);
export const deleteSeasonalRate = (id) => axios.delete(`/admin/seasonal_rates/${id}`);

/* ================================
   Seasonal Rates by Room
================================ */
export const seasonalRateApi = {
  async getRatesByRoom(roomId) {
    const res = await axios.get(`/seasonal_rates/rooms/${roomId}`);
    return res.data;
  },
  async createRate(data) {
    const res = await axios.post('/seasonal_rates', data);
    return res.data;
  },
  async updateRate(id, data) {
    const res = await axios.put(`/seasonal_rates/${id}`, data);
    return res.data;
  },
  async deleteRate(id) {
    const res = await axios.delete(`/seasonal_rates/${id}`);
    return res.data;
  },
};

/* ================================
   High-level API (for components)
================================ */
export const api = {
  // Return full Axios response like old version
  registerCustomer: (payload) => axios.post('/customers/register', payload),
  loginCustomer: (payload) => axios.post('/customers/login', payload),

  // Reservations
  getReservations: async ({ email, filter = 'all' }) =>
    (await axios.get('/customers/reservations', { params: { email, filter } })).data,

  getBungalowHistory: async ({ category } = {}) =>
    (await axios.get('/bungalow/history', { params: { category } })).data,

  // Messages
  getMessages: async ({ email }) => (await getMessagesByEmail(email)).data,
  createMessage: async (payload) => (await createMessage(payload)).data,
  getAllMessagesAdmin: async () => (await getAllMessagesAdmin()).data,
  markMessageAsDone: async (id) => (await markMessageAsDone(id)).data,

  getAllReservationsAdmin: async () => (await axios.get('/admin/reservations')).data,

  // Rooms
  getAllRooms: async () => (await roomApi.getAllRooms()).content,
  getRoom: async (id) => (await roomApi.getRoom(id)),

  // Seasonal Rates
  getRatesByRoom: async (roomId) => (await seasonalRateApi.getRatesByRoom(roomId)),
  createRate: async (data) => (await seasonalRateApi.createRate(data)),
  updateRate: async (id, data) => (await seasonalRateApi.updateRate(id, data)),
  deleteRate: async (id) => (await seasonalRateApi.deleteRate(id)),
};

