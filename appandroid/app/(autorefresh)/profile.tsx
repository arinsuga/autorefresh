import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useAuth } from '@/contexts/Authcontext';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
    const { authState, Logout } = useAuth();
    const { theme, isDark, toggleTheme } = useTheme();
    const router = useRouter();

    const handleLogout = async () => {
        if (Logout) {
            await Logout();
            router.replace('/login');
        }
    };

    const user = authState?.user;

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <MaterialIcons name="account-circle" size={100} color={Colors.bgOrange} />
                </View>
                <Text style={[styles.userName, { color: theme.text }]}>{user?.fullname}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Settings</Text>
                
                <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.surface }]} onPress={toggleTheme}>
                    <View style={styles.menuLeft}>
                        <MaterialIcons 
                            name={isDark ? "dark-mode" : "light-mode"} 
                            size={24} 
                            color={Colors.bgOrange} 
                        />
                        <Text style={[styles.menuText, { color: theme.text }]}>Dark Mode</Text>
                    </View>
                    <MaterialIcons 
                        name={isDark ? "check-box" : "check-box-outline-blank"} 
                        size={24} 
                        color={isDark ? Colors.bgOrange : Colors.grey} 
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Account</Text>
                
                <View style={[styles.infoItem, { backgroundColor: theme.surface }]}>
                    <Text style={styles.infoLabel}>Branch</Text>
                    <Text style={[styles.infoValue, { color: theme.text }]}>Branch ID: {user?.branch_id}</Text>
                </View>

                <View style={[styles.infoItem, { backgroundColor: theme.surface }]}>
                    <Text style={styles.infoLabel}>Roles</Text>
                    <View style={styles.rolesContainer}>
                        {user?.roles?.map((role, index) => (
                            <View key={index} style={styles.roleBadge}>
                                <Text style={styles.roleText}>{role.name}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <MaterialIcons name="logout" size={24} color={Colors.white} />
                <Text style={styles.logoutText}>LOGOUT</Text>
            </TouchableOpacity>

            <Text style={styles.version}>Version 1.1.2 (AutoRefresh)</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        padding: 30,
    },
    avatarContainer: {
        marginBottom: 15,
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    userEmail: {
        fontSize: 14,
        color: Colors.grey,
        marginTop: 5,
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        elevation: 1,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuText: {
        fontSize: 16,
        marginLeft: 15,
    },
    infoItem: {
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        elevation: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: Colors.grey,
        marginBottom: 5,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '500',
    },
    rolesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
    },
    roleBadge: {
        backgroundColor: Colors.bgOrangeTransparent,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginRight: 8,
        marginBottom: 5,
    },
    roleText: {
        fontSize: 12,
        color: Colors.bgOrange,
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: Colors.red,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        padding: 15,
        borderRadius: 12,
        marginTop: 40,
    },
    logoutText: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10,
    },
    version: {
        textAlign: 'center',
        color: Colors.grey,
        fontSize: 12,
        marginBottom: 40,
    }
});
