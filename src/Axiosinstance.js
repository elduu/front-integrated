import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // Your API base URL
//   timeout: 10000, // Optional timeout
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Modify or log the request here
    config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    return config;
  },
  (error) => {
    // Handle the error
    return Promise.reject(error);
  }
);

// Add a response interc
