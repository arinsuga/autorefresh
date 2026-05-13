import { IBranch } from "./IBranch";
import { IVehicleType } from "./IVehicleType";
import { IPaymentMethod } from "./IPaymentMethod";
import { IServiceType } from "./IServiceType";
import {PhotoFile} from 'react-native-vision-camera';

export interface ITransactionService {
    id?: number;
    transaction_id?: number;
    service_type_id: number;
    service_price: number;
    service_type?: IServiceType;
    created_at?: string;
    updated_at?: string;
}

export interface ITransaction {
    id?: number;
    branch_id: number;
    transaction_dt: string;
    transaction_number?: string;
    plate_number: string;
    vehicle_type_id: number;
    customer_name?: string;
    customer_phone?: string;
    gross_total: number;
    discount: number;
    net_total: number;
    payment_method_id: number;
    transaction_photo?: string;
    upload?: PhotoFile | undefined;
    created_by?: string;
    branch?: IBranch;
    vehicle_type?: IVehicleType;
    payment_method?: IPaymentMethod;
    transaction_services?: ITransactionService[];
    // For local UI state
    services?: ITransactionService[];
    created_at?: string;
    updated_at?: string;
}
