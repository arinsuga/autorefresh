export interface IBranch {
    id: number;
    branch_code: string;
    branch_name: string;
    branch_address?: string;
    branch_phone?: string;
    branch_email?: string;
    branch_logo?: string;
    branch_latitude?: string;
    branch_longitude?: string;
    is_active: number;
    created_at?: string;
    updated_at?: string;
}
