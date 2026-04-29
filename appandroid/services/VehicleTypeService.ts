import ApiService from './ApiService';
import { IVehicleType } from '@/interfaces/IVehicleType';

const VehicleTypeService = {
    getActive: async () => {
        const response = await ApiService.get('/vehicle-types/active');
        return response.data.data as IVehicleType[];
    },

    getAll: async (params?: any) => {
        const response = await ApiService.get('/vehicle-types', { params });
        return response.data;
    },

    getById: async (id: number) => {
        const response = await ApiService.get(`/vehicle-types/${id}`);
        return response.data.data as IVehicleType;
    },

    create: async (data: any) => {
        const response = await ApiService.post('/vehicle-types', data);
        return response.data.data as IVehicleType;
    },

    update: async (id: number, data: any) => {
        const response = await ApiService.put(`/vehicle-types/${id}`, data);
        return response.data.data as IVehicleType;
    },

    delete: async (id: number) => {
        const response = await ApiService.delete(`/vehicle-types/${id}`);
        return response.data;
    }
};

export default VehicleTypeService;
