import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/Authcontext';
import Roles from '@/constants/Roles';

export default function AutoRefreshLayout() {
    const { theme } = useTheme();
    const { Logout, authState } = useAuth();
    const router = useRouter();
    const roles = authState?.user?.roles || [];
    const isAdmin = roles.some(r => r.code === Roles.admin);
    const isSuper = roles.some(r => r.code === Roles.super || r.code === Roles.master);

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
                    href: isSuper ? undefined : null,
                    tabBarIcon: ({ color }) => <MaterialIcons name="home" size={28} color={color} />,
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'Transaksi',
                    href: isAdmin && !isSuper ? undefined : null,
                    tabBarIcon: ({ color }) => <MaterialIcons name="history" size={28} color={color} />,
                }}
            />
            <Tabs.Screen
                name="report"
                options={{
                    title: 'Transaksi',
                    href: isSuper ? undefined : null,
                    tabBarIcon: ({ color }) => <MaterialIcons name="history" size={28} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profil Pengguna',
                    tabBarIcon: ({ color }) => <MaterialIcons name="person" size={28} color={color} />,
                }}
            />
            <Tabs.Screen
                name="transaction"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}
