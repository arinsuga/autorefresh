export interface IPaymentMethod {
    id: number;
    payment_method_code: string;
    payment_method_name: string;
    is_active: number;
    created_at?: string;
    updated_at?: string;
}
