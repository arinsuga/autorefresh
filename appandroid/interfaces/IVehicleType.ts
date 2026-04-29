export interface IVehicleType {
    id: number;
    vehicle_type_code: string;
    vehicle_type_name: string;
    vehicle_type_description?: string;
    is_active: number;
    created_at?: string;
    updated_at?: string;
}
