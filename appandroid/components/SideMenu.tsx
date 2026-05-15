import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Pressable } from 'react-native';
import { useAuth } from '@/contexts/Authcontext';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Roles from '@/constants/Roles';
import { useMenu } from '@/contexts/MenuContext';

export default function SideMenu() {
    const { authState } = useAuth();
    const { theme } = useTheme();
    const router = useRouter();
    const { isMenuOpen, closeMenu, menuAnimation } = useMenu();

    const roles = authState?.user?.roles || [];
    const isMaster = roles.some(r => r.code === Roles.master);
    const isSuper = roles.some(r => r.code === Roles.super);

    const navigateTo = (path: any) => {
        closeMenu();
        router.push(path);
    };

    if (!isMenuOpen && menuAnimation._value === -300) return null; // Optimization to not render if hidden

    return (
        <>
            {isMenuOpen && (
                <Pressable style={styles.overlay} onPress={closeMenu}>
                    <View />
                </Pressable>
            )}
            
            <Animated.View 
                style={[
                    styles.drawer, 
                    { 
                        backgroundColor: theme.surface,
                        transform: [{ translateX: menuAnimation }] 
                    }
                ]}
            >
                <View style={[styles.drawerHeader, { backgroundColor: theme.primary }]}>
                    <MaterialIcons name="account-circle" size={60} color={Colors.white} />
                    <Text style={styles.drawerUser}>{authState?.user?.fullname}</Text>
                    <Text style={styles.drawerRole}>
                        {isMaster ? 'Master Admin' : isSuper ? 'Super Admin' : roles.some(r => r.code === Roles.admin) ? 'Admin' : 'User'}
                    </Text>
                </View>

                <View style={styles.drawerContent}>
                    {/* Branch Menu - MASTER can manage, SUPER can edit */}
                    {(isMaster || isSuper) && (
                        <TouchableOpacity 
                            style={styles.drawerItem} 
                            onPress={() => navigateTo('/(autorefresh)/branch-management')}
                        >
                            <MaterialIcons name="storefront" size={24} color={Colors.bgOrange} />
                            <Text style={[styles.drawerItemText, { color: theme.text }]}>Branch Management</Text>
                        </TouchableOpacity>
                    )}

                    {/* User Management Menu - MASTER can manage, SUPER can reset pass */}
                    {(isMaster || isSuper) && (
                        <TouchableOpacity 
                            style={styles.drawerItem} 
                            onPress={() => navigateTo('/(autorefresh)/user-management')}
                        >
                            <MaterialIcons name="people" size={24} color={Colors.bgOrange} />
                            <Text style={[styles.drawerItemText, { color: theme.text }]}>User Management</Text>
                        </TouchableOpacity>
                    )}

                    <View style={styles.drawerDivider} />

                    <TouchableOpacity 
                        style={styles.drawerItem} 
                        onPress={() => navigateTo('/(autorefresh)/profile')}
                    >
                        <MaterialIcons name="person" size={24} color={Colors.bgOrange} />
                        <Text style={[styles.drawerItemText, { color: theme.text }]}>My Profile</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
    },
    drawer: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 300,
        zIndex: 1001,
        elevation: 16,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    drawerHeader: {
        padding: 30,
        paddingTop: 60,
        alignItems: 'center',
    },
    drawerUser: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    drawerRole: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        marginTop: 2,
    },
    drawerContent: {
        padding: 10,
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
    },
    drawerItemText: {
        fontSize: 16,
        marginLeft: 15,
        fontWeight: '500',
    },
    drawerDivider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
        marginVertical: 10,
        marginHorizontal: 15,
    }
});
