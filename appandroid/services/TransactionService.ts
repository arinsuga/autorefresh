import ApiService from './ApiService';
import { ITransaction } from '@/interfaces/ITransaction';

const TransactionService = {
    getAll: async (params?: any) => {
        const response = await ApiService.get('/transactions', { params });
        return response.data;
    },

    getById: async (id: number) => {
        const response = await ApiService.get(`/transactions/${id}`);
        return response.data.data as ITransaction;
    },

    create: async (data: ITransaction) => {
        const response = await ApiService.post('/transactions', data);
        return response.data.data as ITransaction;
    },

    update: async (id: number, data: Partial<ITransaction>) => {
        const response = await ApiService.put(`/transactions/${id}`, data);
        return response.data.data as ITransaction;
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
