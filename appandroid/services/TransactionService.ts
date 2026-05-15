import axios from 'axios';
import ApiService from './ApiService';
import { ITransaction } from '@/interfaces/ITransaction';
import { getToken } from './AuthService';

const API_URL = process.env.EXPO_PUBLIC_APPAPIURL;

const TransactionService = {
    getAll: async (params?: any) => {
        const response = await ApiService.get('/transactions', { params });
        return response.data;
    },

    getById: async (id: number) => {
        const response = await ApiService.get(`/transactions/${id}`);
        return response.data.data as ITransaction;
    },

    create: async (formData: FormData) => {
        const token = await getToken();
        try {
            const response = await axios.post(`${API_URL}/transactions`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.data as ITransaction;
        } catch (error: any) {
            console.log('===== Transaction Create Error =====');
            if (error.response) {
                console.log('Status:', error.response.status);
                console.log('Data:', JSON.stringify(error.response.data, null, 2));
            } else {
                console.log('Error Message:', error.message);
            }
            throw error;
        }
    },

    update: async (id: number, data: FormData) => {
        const token = await getToken();
        try {
            const response = await axios.post(`${API_URL}/transactions/${id}`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                params: { _method: 'PUT' }
            });
            return response.data.data as ITransaction;
        } catch (error: any) {
            console.log('===== Transaction Update Error =====');
            if (error.response) {
                console.log('Status:', error.response.status);
                console.log('Data:', JSON.stringify(error.response.data, null, 2));
            }
            throw error;
        }
    },

    delete: async (id: number) => {
        const response = await ApiService.delete(`/transactions/${id}`);
        return response.data;
    },

    getByBranch: async (branchId: number) => {
        const response = await ApiService.get(`/transactions/branch/${branchId}`);
        return response.data.data as ITransaction[];
    },

    getReportDetail: async (params?: any) => {
        const response = await ApiService.get('/transactions/report/detail', { params });
        return response.data.data as ITransaction[];
    },

    getReportSummary: async (params?: any) => {
        const response = await ApiService.get('/transactions/report/summary', { params });
        return response.data.data as any[];
    },

    findByPlateNumber: async (plateNumber: string) => {
        const response = await ApiService.get('/transactions/plate-lookup', {
            params: { plate_number: plateNumber }
        });
        return response.data.data as Partial<ITransaction>;
    }
};

export default TransactionService;
