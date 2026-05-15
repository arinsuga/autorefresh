import axios from 'axios';
import { getToken } from './AuthService';

const API_URL = process.env.EXPO_PUBLIC_AUTHAPIURL;

const UserService = {
    getAll: async () => {
        const token = await getToken();
        const baseUrl = API_URL?.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
        const response = await axios.get(`${baseUrl}/users`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    },

    getById: async (id: number) => {
        const token = await getToken();
        const baseUrl = API_URL?.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
        const response = await axios.get(`${baseUrl}/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    },

    create: async (data: any) => {
        const token = await getToken();
        const baseUrl = API_URL?.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
        const response = await axios.post(`${baseUrl}/users`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    },

    update: async (id: number, data: any) => {
        const token = await getToken();
        const baseUrl = API_URL?.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
        const response = await axios.put(`${baseUrl}/users/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    },

    delete: async (id: number) => {
        const token = await getToken();
        const baseUrl = API_URL?.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
        const response = await axios.delete(`${baseUrl}/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    resetPassword: async (id: number, data: any) => {
        const token = await getToken();
        const baseUrl = API_URL?.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
        const response = await axios.patch(`${baseUrl}/users/${id}/reset-password`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    toggleStatus: async (id: number) => {
        const token = await getToken();
        const baseUrl = API_URL?.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
        const response = await axios.patch(`${baseUrl}/users/${id}/toggle-status`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    },

    getRoles: async (appId?: number) => {
        const token = await getToken();
        const baseUrl = API_URL?.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
        const url = appId ? `${baseUrl}/roles?app_id=${appId}` : `${baseUrl}/roles`;
        console.log('getRoles URL:', url);
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    },

    changePassword: async (data: any) => {
        const token = await getToken();
        const baseUrl = API_URL?.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
        const response = await axios.patch(`${baseUrl}/profile/change-password`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};

export default UserService;
