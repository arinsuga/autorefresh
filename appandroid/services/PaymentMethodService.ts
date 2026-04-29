import ApiService from './ApiService';
import { IPaymentMethod } from '@/interfaces/IPaymentMethod';

const PaymentMethodService = {
    getActive: async () => {
        const response = await ApiService.get('/payment-methods/active');
        return response.data.data as IPaymentMethod[];
    }
};

export default PaymentMethodService;
