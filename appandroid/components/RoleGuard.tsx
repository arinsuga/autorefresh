import React from 'react';
import { useAuth } from '@/contexts/Authcontext';

interface RoleGuardProps {
    allowedRoles: string[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children, fallback = null }) => {
    const { authState } = useAuth();
    
    if (!authState || !authState.user || !authState.user.roles) {
        return <>{fallback}</>;
    }

    const hasPermission = authState.user.roles.some(role => 
        role.code && allowedRoles.includes(role.code)
    );

    if (hasPermission) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
};

export default RoleGuard;
