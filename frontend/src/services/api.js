
// import axios from 'axios';

// // API Base Configuration
// const API = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   timeout: 10000,
//   withCredentials: true, // ✅ IMPORTANT: This allows cookies/sessions
// });

// // Request Interceptor
// API.interceptors.request.use(
//   (config) => {
//     // Don't log in production
//     if (process.env.NODE_ENV !== 'production') {
//       console.log(`🚀 ${config.method?.toUpperCase() || 'REQUEST'} Request to: ${config.url}`);
//     }
//     return config;
//   },
//   (error) => {
//     console.error('❌ Request Error:', error);
//     return Promise.reject(error);
//   }
// );

// // Response Interceptor
// API.interceptors.response.use(
//   (response) => {
//     if (process.env.NODE_ENV !== 'production') {
//       console.log(`✅ ${response.status} Response from: ${response.config.url}`, response.data);
//     }
//     return response;
//   },
//   (error) => {
//     if (error.code === 'ECONNABORTED') {
//       console.error('❌ Request Timeout');
//     } else if (error.response) {
//       console.error(`❌ ${error.response.status} Error:`, error.response.data);
//     } else if (error.request) {
//       console.error('❌ No Response from Server - Is the backend running?');
//     } else {
//       console.error('❌ Error:', error.message);
//     }
//     return Promise.reject(error);
//   }
// );

// export default API;
import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8000/api/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Add request interceptor for debugging
API.interceptors.request.use(
    (config) => {
        console.log('Making request to:', config.url);
        console.log('With data:', config.data);
        console.log('With headers:', config.headers);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
API.interceptors.response.use(
    (response) => {
        console.log('Response received:', response.data);
        return response;
    },
    (error) => {
        console.error('Response error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default API;