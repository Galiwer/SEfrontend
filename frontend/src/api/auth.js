import axios from 'axios';

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const authApi = {
  login: async (usernameOrEmail, password) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      usernameOrEmail,
      password
    });
    return response.data;
  },

  register: async (username, email, password) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      username,
      email,
      password
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem('token'); // get stored token
    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

};
