import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/auth';

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

export const login = async (username, password) => {
  try {
    console.log(`${API_URL}/authenticate`);
    const response = await axios.post(`${API_URL}/authenticate`, {
      username,
      password
    });
    const { token, user } = response.data;
    setAuthToken(token);
    return { success: true, user };
  } catch (error) {
    throw error.response?.data?.message || 'Authentication failed';
  }
};

export const logout = () => {
  setAuthToken(null);
};

export const checkAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    setAuthToken(token);
    return true;
  }
  return false;
};