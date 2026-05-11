import axios from 'axios';
import { authSubject } from './AuthService';

const ApiService = axios.create({
    baseURL: process.env.EXPO_PUBLIC_APPAPIURL,
    headers: {
        'Accept': 'application/json',
    },
});

// Request interceptor to attach JWT token and handle multipart/form-data
ApiService.interceptors.request.use(
    (config) => {
        const auth = authSubject.value;
        if (auth && auth.token && auth.token.token) {
            config.headers.Authorization = `Bearer ${auth.token.token}`;
        }

        // If sending FormData, let the browser/Axios set the Content-Type with boundary
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        } else {
            config.headers['Content-Type'] = 'application/json';
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 errors (token expired)
ApiService.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Optional: Handle auto-logout or token refresh here
            console.log('Unauthorized - possible token expiry');
        }
        return Promise.reject(error);
    }
);

export default ApiService;
