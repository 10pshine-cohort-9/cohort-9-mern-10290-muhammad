import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({ baseURL });

// attach the stored token to every outgoing request, if we have one
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('notes_app_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function extractErrorMessage(error) {
  return error?.response?.data?.message || 'Something went wrong. Please try again.';
}

export async function signup({ name, email, password }) {
  try {
    const res = await apiClient.post('/auth/signup', { name, email, password });
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function login({ email, password }) {
  try {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function logout() {
  try {
    const res = await apiClient.post('/auth/logout');
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function getMe() {
  try {
    const res = await apiClient.get('/auth/me');
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function updateMe({ name, email }) {
  try {
    const res = await apiClient.put('/auth/me', { name, email });
    return res.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
