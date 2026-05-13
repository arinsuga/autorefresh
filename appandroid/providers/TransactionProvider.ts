import { ITransaction } from '@/interfaces/ITransaction';
import ApiService from '@/services/ApiService';

export const create = async (transactionData: ITransaction, imageUri?: string | null): Promise<any> => {
  try {
    const formData = new FormData();

    // Handle image upload if present
    if (imageUri) {
      const fileName = imageUri.split('/').pop() || 'transaction.jpg';
      
      // Ensure uri is correctly formatted for React Native FormData
      const cleanUri = imageUri.startsWith('file://') ? imageUri : `file://${imageUri}`;

      formData.append('upload', {
        uri: cleanUri,
        type: 'image/jpeg',
        name: fileName,
      } as any);
    }

    // Append basic transaction data
    formData.append('branch_id', transactionData.branch_id.toString());
    formData.append('transaction_dt', transactionData.transaction_dt);
    formData.append('plate_number', transactionData.plate_number);
    formData.append('vehicle_type_id', transactionData.vehicle_type_id.toString());
    formData.append('payment_method_id', transactionData.payment_method_id.toString());
    formData.append('gross_total', transactionData.gross_total.toString());
    formData.append('discount', (transactionData.discount || 0).toString());
    formData.append('net_total', transactionData.net_total.toString());

    if (transactionData.customer_name) {
        formData.append('customer_name', transactionData.customer_name);
    }
    if (transactionData.customer_phone) {
        formData.append('customer_phone', transactionData.customer_phone);
    }

    // Append services as array indices for Laravel multipart/form-data
    const services = transactionData.services || transactionData.transaction_services || [];
    services.forEach((service, index) => {
      formData.append(`services[${index}][service_type_id]`, service.service_type_id.toString());
      formData.append(`services[${index}][service_price]`, service.service_price.toString());
    });

    console.log("Sending transaction to /transactions...");

    // Using ApiService instead of raw axios to benefit from interceptors and base configuration
    const response = await ApiService.post('/transactions', formData);
    
    console.log('Transaction creation SUCCESS');
    return response;

  } catch (error: any) {
    console.log('===== Transaction Create Error =====');
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log('Data:', JSON.stringify(error.response.data));
      return {
        status: error.response.status,
        data: error.response.data
      };
    } else {
      console.log('Error Message:', error.message);
      // This is where "Network Error" usually ends up
      return {
        status: 500,
        data: { message: error.message || 'Network Error' }
      };
    }
  }
};

export const getAll = async (params?: any) => {
    return ApiService.get('/transactions', { params });
};

export const getById = async (id: number) => {
    return ApiService.get(`/transactions/${id}`);
};

export const update = async (id: number, data: Partial<ITransaction>) => {
    return ApiService.put(`/transactions/${id}`, data);
};

export const remove = async (id: number) => {
    return ApiService.delete(`/transactions/${id}`);
};

export const getByBranch = async (branchId: number) => {
    return ApiService.get(`/transactions/branch/${branchId}`);
};

export const getReportDetail = async (params?: any) => {
    return ApiService.get('/transactions/report/detail', { params });
};

export const getReportSummary = async (params?: any) => {
    return ApiService.get('/transactions/report/summary', { params });
};

export const findByPlateNumber = async (plateNumber: string) => {
    return ApiService.get('/transactions/plate-lookup', {
        params: { plate_number: plateNumber }
    });
};

const TransactionProvider = { 
    create, 
    getAll, 
    getById, 
    update, 
    remove, 
    getByBranch, 
    getReportDetail, 
    getReportSummary, 
    findByPlateNumber 
};

export default TransactionProvider;
