import ApiService from './ApiService';
import { IServiceType } from '@/interfaces/IServiceType';

const ServiceTypeService = {
    getActive: async () => {
        const response = await ApiService.get('/service-types/active');
        return response.data.data as IServiceType[];
    },

    getByVehicleType: async (vehicleTypeId: number) => {
        const response = await ApiService.get(`/service-types/vehicle-type/${vehicleTypeId}`);
        return response.data.data as IServiceType[];
    },

    getAll: async (params?: any) => {
        const response = await ApiService.get('/service-types', { params });
        return response.data;
    },

    getById: async (id: number) => {
        const response = await ApiService.get(`/service-types/${id}`);
        return response.data.data as IServiceType;
    },

    create: async (data: any) => {
        const response = await ApiService.post('/service-types', data);
        return response.data.data as IServiceType;
    },

    update: async (id: number, data: any) => {
        const response = await ApiService.put(`/service-types/${id}`, data);
        return response.data.data as IServiceType;
    },

    delete: async (id: number) => {
        const response = await ApiService.delete(`/service-types/${id}`);
        return response.data;
    }
};

export default ServiceTypeService;
