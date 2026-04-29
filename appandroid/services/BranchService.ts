import ApiService from './ApiService';
import { IBranch } from '@/interfaces/IBranch';

const BranchService = {
    getActive: async () => {
        const response = await ApiService.get('/branches/active');
        return response.data.data as IBranch[];
    },

    getAll: async (params?: any) => {
        const response = await ApiService.get('/branches', { params });
        return response.data;
    },

    getById: async (id: number) => {
        const response = await ApiService.get(`/branches/${id}`);
        return response.data.data as IBranch;
    },

    create: async (data: any) => {
        const response = await ApiService.post('/branches', data);
        return response.data.data as IBranch;
    },

    update: async (id: number, data: any) => {
        const response = await ApiService.put(`/branches/${id}`, data);
        return response.data.data as IBranch;
    },

    delete: async (id: number) => {
        const response = await ApiService.delete(`/branches/${id}`);
        return response.data;
    }
};

export default BranchService;
