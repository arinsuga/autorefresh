import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/Authcontext';
import Roles from '@/constants/Roles';
import { MenuProvider } from '@/contexts/MenuContext';
import SideMenu from '@/components/SideMenu';

export default function AutoRefreshLayout() {
    const { theme } = useTheme();
    const { Logout, authState } = useAuth();
    const router = useRouter();
    const roles = authState?.user?.roles || [];
    const isMaster = roles.some(r => r.code === Roles.master);
    const isSuper = roles.some(r => r.code === Roles.super);
    const isAdmin = roles.some(r => r.code === Roles.admin);
    
    // Combined permissions
    const canAccessDashboard = isMaster || isSuper;
    const canAccessReports = isMaster || isSuper;
    const canAccessHistory = isAdmin;

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Logout", 
                    style: "destructive", 
                    onPress: async () => {
                        if (Logout) {
                            await Logout();
                            router.replace('/login');
                        }
                    } 
                }
            ]
        );
    };

    return (
        <MenuProvider>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: Colors.white,
                    tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
                    tabBarStyle: {
                        backgroundColor: theme.primary,
                        borderTopColor: 'transparent',
                    },
                    headerStyle: {
                        backgroundColor: theme.primary,
                    },
                    headerTintColor: Colors.white,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerRight: () => (
                        <TouchableOpacity 
                            onPress={handleLogout} 
                            style={{ marginRight: 15 }}
                        >
                            <MaterialIcons name="logout" size={24} color={Colors.white} />
                        </TouchableOpacity>
                    ),
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Beranda',
                        href: canAccessDashboard ? undefined : null,
                        tabBarIcon: ({ color }) => <MaterialIcons name="home" size={28} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="history"
                    options={{
                        title: 'Transaksi',
                        href: canAccessHistory ? undefined : null,
                        tabBarIcon: ({ color }) => <MaterialIcons name="history" size={28} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="report"
                    options={{
                        title: 'Transaksi',
                        href: canAccessReports ? undefined : null,
                        tabBarIcon: ({ color }) => <MaterialIcons name="history" size={28} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: isSuper ? 'Pengaturan' : 'Profil Pengguna',
                        tabBarIcon: ({ color }) => <MaterialIcons name={isSuper ? "settings" : "person"} size={28} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="transaction"
                    options={{
                        href: null,
                    }}
                />
                <Tabs.Screen
                    name="user-management"
                    options={{
                        title: 'Kelola Pengguna',
                        href: null,
                        headerShown: true,
                    }}
                />
                <Tabs.Screen
                    name="branch-management"
                    options={{
                        title: 'Kelola Cabang',
                        href: null,
                        headerShown: true,
                    }}
                />
            </Tabs>
            <SideMenu />
        </MenuProvider>
    );
}
