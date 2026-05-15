import axios from 'axios';
import { getToken } from './AuthService';

const API_URL = process.env.EXPO_PUBLIC_AUTHAPIURL;

const UserService = {
    getAll: async () => {
        const token = await getToken();
        const response = await axios.get(`${API_URL}/users`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    },

    getById: async (id: number) => {
        const token = await getToken();
        const response = await axios.get(`${API_URL}/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    },

    create: async (data: any) => {
        const token = await getToken();
        const response = await axios.post(`${API_URL}/users`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    },

    update: async (id: number, data: any) => {
        const token = await getToken();
        const response = await axios.put(`${API_URL}/users/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    },

    delete: async (id: number) => {
        const token = await getToken();
        const response = await axios.delete(`${API_URL}/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    resetPassword: async (id: number, data: any) => {
        const token = await getToken();
        const response = await axios.patch(`${API_URL}/users/${id}/reset-password`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    toggleStatus: async (id: number) => {
        const token = await getToken();
        const response = await axios.patch(`${API_URL}/users/${id}/toggle-status`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    },

    getRoles: async () => {
        const token = await getToken();
        const response = await axios.get(`${API_URL}/roles`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    },

    changePassword: async (data: any) => {
        const token = await getToken();
        const response = await axios.patch(`${API_URL}/profile/change-password`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};

export default UserService;
