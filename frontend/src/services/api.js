import axios from 'axios';

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json'
	}
});

// Attach Authorization header from localStorage token for secured endpoints
apiClient.interceptors.request.use((config) => {
	try {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers = config.headers || {};
			config.headers['Authorization'] = `Bearer ${token}`;
		}
	} catch (e) {
		// ignore storage errors
	}
	return config;
});

// Customers (admin)
export const getAllCustomers = () => apiClient.get('/admin/customers');
export const searchCustomers = (q) => apiClient.get(`/admin/customers/search`, { params: { q } });
export const deleteCustomer = (id) => apiClient.delete(`/admin/customers/${id}`);

// High-level API used by some components
export const api = {
	registerCustomer: async (payload) => {
		// Post to public registration endpoint
		return apiClient.post('/customers/register', payload);
    },
    getReservations: async ({ email, filter = 'all' }) => {
        return apiClient.get('/customers/reservations', { params: { email, filter } });
    }
};

// Gallery endpoints
export const getGallery = () => apiClient.get('/gallery');
export const uploadGalleryPhoto = (file) => {
	const form = new FormData();
	form.append('file', file);
	return apiClient.post('/admin/gallery', form, {
		headers: { 'Content-Type': 'multipart/form-data' }
	});
};
export const deleteGalleryPhoto = (filename) => apiClient.delete(`/admin/gallery/${encodeURIComponent(filename)}`);

// URL-based admin endpoints
export const getAdminGallery = () => apiClient.get('/admin/gallery');
export const addGalleryUrl = (url) => apiClient.post('/admin/gallery/url', { url });
export const deleteGalleryItem = (id) => apiClient.delete(`/admin/gallery/id/${id}`);

// Add to high-level api object for convenience
api.getGallery = async () => getGallery();
api.uploadGalleryPhoto = async (file) => uploadGalleryPhoto(file);
api.deleteGalleryPhoto = async (filename) => deleteGalleryPhoto(filename);
api.getAdminGallery = async () => getAdminGallery();
api.addGalleryUrl = async (url) => addGalleryUrl(url);
api.deleteGalleryItem = async (id) => deleteGalleryItem(id);

// Reviews endpoints
export const getPublicReviews = () => apiClient.get('/reviews');
export const createReview = (payload) => apiClient.post('/reviews', payload);
export const getAdminReviews = () => apiClient.get('/admin/reviews');
export const replyToReview = (id, reply) => apiClient.post(`/admin/reviews/${id}/reply`, { reply });
export const deleteAdminReply = (id) => apiClient.delete(`/admin/reviews/${id}/reply`);

api.getPublicReviews = async () => getPublicReviews();
api.createReview = async (payload) => createReview(payload);
api.getAdminReviews = async () => getAdminReviews();
api.replyToReview = async (id, reply) => replyToReview(id, reply);
api.deleteAdminReply = async (id) => deleteAdminReply(id);

// Customer's own reviews
export const getMyReviews = () => apiClient.get('/customers/reviews');
api.getMyReviews = async () => getMyReviews();

// Update/Delete review (customer or admin)
export const updateReview = (id, message) => apiClient.put(`/reviews/${id}`, { message });
export const deleteReview = (id) => apiClient.delete(`/reviews/${id}`);
api.updateReview = async (id, message) => updateReview(id, message);
api.deleteReview = async (id) => deleteReview(id);


