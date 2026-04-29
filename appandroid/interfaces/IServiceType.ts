import { IVehicleType } from "./IVehicleType";

export interface IServiceType {
    id: number;
    vehicle_type_id: number;
    service_code: string;
    service_name: string;
    service_price: number;
    service_description?: string;
    is_active: number;
    vehicle_type?: IVehicleType;
    created_at?: string;
    updated_at?: string;
}
