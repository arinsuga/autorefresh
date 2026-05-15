import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useAuth } from '@/contexts/Authcontext';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import UserService from '@/services/UserService';
import { Alert, Modal, TextInput } from 'react-native';
import { useMenu } from '@/contexts/MenuContext';
import Roles from '@/constants/Roles';

import { refreshUser } from '@/services/AuthService';

export default function ProfileScreen() {
    const { authState, Logout } = useAuth();
    const { theme, isDark, toggleTheme } = useTheme();
    const { openMenu } = useMenu();
    const router = useRouter();
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    React.useEffect(() => {
        refreshUser();
    }, []);

    const handleChangePassword = () => {
        setPasswordData({
            current_password: '',
            new_password: '',
            new_password_confirmation: '',
        });
        setPasswordModalVisible(true);
    };

    const handleSavePassword = async () => {
        if (passwordData.new_password !== passwordData.new_password_confirmation) {
            Alert.alert('Error', 'Password baru tidak cocok');
            return;
        }

        try {
            await UserService.changePassword(passwordData);
            Alert.alert('Success', 'Password berhasil diubah');
            setPasswordModalVisible(false);
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || 'Gagal mengubah password';
            Alert.alert('Error', errorMsg);
        }
    };

    const handleLogout = async () => {
        if (Logout) {
            await Logout();
            router.replace('/login');
        }
    };

    const user = authState?.user;
    const userRoles = user?.roles || [];
    const isSuper = userRoles.some(r => r.code === Roles.super || r.code === Roles.master);

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                {isSuper && (
                    <TouchableOpacity onPress={openMenu} style={styles.menuBtn}>
                        <MaterialIcons name="menu" size={28} color={theme.text} />
                    </TouchableOpacity>
                )}
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
                            name={isDark ? "brightness-2" : "wb-sunny"} 
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

                <TouchableOpacity 
                    style={[styles.menuItem, { backgroundColor: theme.surface, marginTop: 10 }]} 
                    onPress={() => handleChangePassword()}
                >
                    <View style={styles.menuLeft}>
                        <MaterialIcons name="lock" size={24} color={Colors.bgOrange} />
                        <Text style={[styles.menuText, { color: theme.text }]}>Ganti Password</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color={Colors.grey} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <MaterialIcons name="logout" size={24} color={Colors.white} />
                <Text style={styles.logoutText}>LOGOUT</Text>
            </TouchableOpacity>

            <Text style={styles.version}>Version 1.1.2 (AutoRefresh)</Text>

            <Modal visible={passwordModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>Ganti Password</Text>
                        
                        <View style={styles.modalForm}>
                            <Text style={[styles.label, { color: theme.text }]}>Password Saat Ini</Text>
                            <TextInput
                                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                                value={passwordData.current_password}
                                onChangeText={(text) => setPasswordData({...passwordData, current_password: text})}
                                secureTextEntry
                                placeholder="Masukkan password saat ini"
                                placeholderTextColor={Colors.grey}
                            />

                            <Text style={[styles.label, { color: theme.text }]}>Password Baru</Text>
                            <TextInput
                                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                                value={passwordData.new_password}
                                onChangeText={(text) => setPasswordData({...passwordData, new_password: text})}
                                secureTextEntry
                                placeholder="Minimal 6 karakter"
                                placeholderTextColor={Colors.grey}
                            />

                            <Text style={[styles.label, { color: theme.text }]}>Konfirmasi Password Baru</Text>
                            <TextInput
                                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                                value={passwordData.new_password_confirmation}
                                onChangeText={(text) => setPasswordData({...passwordData, new_password_confirmation: text})}
                                secureTextEntry
                                placeholder="Ulangi password baru"
                                placeholderTextColor={Colors.grey}
                            />
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setPasswordModalVisible(false)}>
                                <Text style={styles.cancelBtnText}>Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveBtn} onPress={handleSavePassword}>
                                <Text style={styles.saveBtnText}>Simpan</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
        paddingTop: 50,
    },
    menuBtn: {
        position: 'absolute',
        left: 20,
        top: 50,
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
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalForm: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        marginTop: 15,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelBtn: {
        flex: 1,
        padding: 15,
        alignItems: 'center',
    },
    cancelBtnText: {
        color: Colors.grey,
        fontWeight: 'bold',
        fontSize: 16,
    },
    saveBtn: {
        flex: 2,
        backgroundColor: Colors.bgOrange,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveBtnText: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
});
