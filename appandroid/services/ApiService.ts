import axios from 'axios';
import { Platform } from 'react-native';
import { authSubject, getToken } from './AuthService';
import Constants from 'expo-constants';

// Determine the base URL for API requests. In Expo managed workflow, environment
// variables prefixed with `EXPO_PUBLIC_` are injected into `Constants.expoConfig.extra`.
// However, during development they may also be available via `process.env`.
// We fallback to `process.env` for safety.
// Resolve the base URL for API requests, trimming any trailing slash.
const rawBase =
    (Constants?.expoConfig?.extra?.EXPO_PUBLIC_APPAPIURL as string) ||
    (Constants?.manifest?.extra?.EXPO_PUBLIC_APPAPIURL as string) ||
    (process.env.EXPO_PUBLIC_APPAPIURL as string) ||
    '';
const baseURL = rawBase.replace(/\/+$/,''); // ensure no trailing slash

const ApiService = axios.create({
    baseURL,
    timeout: 60000, // 60s timeout for large uploads
    headers: {
        'Accept': 'application/json',
    },
});

// Request interceptor to attach JWT token and handle multipart/form-data
ApiService.interceptors.request.use(
    async (config) => {
        // Prefer the in‑memory authSubject value; if it is missing, fall back to the persisted token.
        let token = '';
        const auth = authSubject.value;
        if (auth && auth.token && auth.token.token) {
            token = auth.token.token;
        } else {
            // Retrieve token from AsyncStorage (may be slower but ensures we have it)
            token = await getToken();
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn('ApiService: no auth token available for request');
        }

        // If sending FormData, prevent Axios from serializing it.
        // React Native's FormData with { uri, name, type } blobs must be
        // passed through untouched — Axios 1.x transformRequest breaks this.
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
            config.transformRequest = (data: any) => data;
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
            // console.log('Unauthorized - possible token expiry');
        }
        return Promise.reject(error);
    }
);

export default ApiService;
