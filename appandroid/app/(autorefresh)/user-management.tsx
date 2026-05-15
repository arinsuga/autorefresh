import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, TextInput, ScrollView, Switch } from 'react-native';
import { useAuth } from '@/contexts/Authcontext';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import UserService from '@/services/UserService';
import Roles from '@/constants/Roles';
import Apps from '@/constants/Apps';
import { useMenu } from '@/contexts/MenuContext';

export default function UserManagementScreen() {
    const { authState } = useAuth();
    const { theme } = useTheme();
    const { openMenu } = useMenu();
    const [users, setUsers] = useState<any[]>([]);
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        selectedRoles: [] as number[],
        disabled: false,
    });
    const [resetModalVisible, setResetModalVisible] = useState(false);
    const [resettingUser, setResettingUser] = useState<any>(null);
    const [newPassword, setNewPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);

    const userRoles = authState?.user?.roles || [];
    const isMaster = userRoles.some(r => r.code === Roles.master);
    const isSuper = userRoles.some(r => r.code === Roles.super);
    const isAdmin = userRoles.some(r => r.code === Roles.admin);

    useEffect(() => {
        fetchUsers();
        if (isMaster || isSuper) {
            fetchRoles();
        }
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await UserService.getAll();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const data = await UserService.getRoles(Apps.autorefresh);
            console.log('fetchRoles data:', data);
            // Filter in frontend as well to be 100% sure only App ID 2 roles are shown
            const filteredData = data.filter((r: any) => parseInt(r.app_id) === Apps.autorefresh);
            setRoles(filteredData);
        } catch (error) {
            console.error('Failed to fetch roles', error);
        }
    };

    const handleSaveUser = async () => {
        try {
            if (editingUser) {
                await UserService.update(editingUser.id, {
                    name: formData.name,
                    email: formData.email,
                    roles: formData.selectedRoles,
                    disabled: formData.disabled,
                    app_id: Apps.autorefresh,
                });
                Alert.alert('Success', 'User updated successfully');
            } else {
                await UserService.create({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    roles: formData.selectedRoles,
                    disabled: formData.disabled,
                    app_id: Apps.autorefresh,
                });
                Alert.alert('Success', 'User created successfully');
            }
            setModalVisible(false);
            fetchUsers();
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to save user');
        }
    };

    const handleDeleteUser = (id: number) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this user?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Delete', 
                    style: 'destructive', 
                    onPress: async () => {
                        try {
                            await UserService.delete(id);
                            fetchUsers();
                        } catch (error: any) {
                            Alert.alert('Error', error.response?.data?.message || 'Failed to delete user');
                        }
                    } 
                }
            ]
        );
    };

    const handleResetPassword = (user: any) => {
        setResettingUser(user);
        setNewPassword('');
        setResetModalVisible(true);
    };

    const confirmResetPassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setIsSaving(true);
        try {
            await UserService.resetPassword(resettingUser.id, { password: newPassword });
            Alert.alert('Success', 'Password reset successfully');
            setResetModalVisible(false);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to reset password');
        } finally {
            setIsSaving(true);
            setIsSaving(false);
        }
    };

    const handleToggleStatus = async (id: number) => {
        try {
            await UserService.toggleStatus(id);
            fetchUsers();
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to toggle status');
        }
    };

    const openModal = (user: any = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name,
                email: user.email,
                password: '',
                selectedRoles: user.roles.map((r: any) => r.id),
                disabled: user.disabled === 1 || user.disabled === true,
            });
        } else {
            setEditingUser(null);
            setFormData({
                name: '',
                email: '',
                password: '',
                selectedRoles: [],
                disabled: false,
            });
        }
        setModalVisible(true);
    };

    const renderUserItem = ({ item }: { item: any }) => (
        <View style={[styles.userCard, { backgroundColor: theme.surface }]}>
            <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: theme.text }]}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
                <View style={styles.roleContainer}>
                    {item.roles.map((r: any) => (
                        <View key={r.id} style={styles.roleBadge}>
                            <Text style={styles.roleText}>{r.name}</Text>
                        </View>
                    ))}
                    {item.disabled ? (
                        <View style={[styles.roleBadge, { backgroundColor: Colors.redTransparent }]}>
                            <Text style={[styles.roleText, { color: Colors.red }]}>Disabled</Text>
                        </View>
                    ) : null}
                </View>
            </View>
            <View style={styles.actions}>
                {(isMaster || isSuper || isAdmin) && (
                    <TouchableOpacity onPress={() => handleResetPassword(item)} style={styles.actionBtn}>
                        <MaterialIcons name="vpn-key" size={20} color={Colors.bgOrange} />
                    </TouchableOpacity>
                )}
                {isMaster && (
                    <>
                        <TouchableOpacity onPress={() => openModal(item)} style={styles.actionBtn}>
                            <MaterialIcons name="edit" size={20} color={Colors.blue} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleToggleStatus(item.id)} style={styles.actionBtn}>
                            <MaterialIcons 
                                name={item.disabled ? "play-arrow" : "pause"} 
                                size={20} 
                                color={item.disabled ? Colors.green : Colors.red} 
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteUser(item.id)} style={styles.actionBtn}>
                            <MaterialIcons name="delete" size={20} color={Colors.red} />
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={openMenu} style={styles.menuBtn}>
                        <MaterialIcons name="menu" size={28} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: theme.text }]}>Users</Text>
                </View>
                {isMaster && (
                    <TouchableOpacity style={styles.addBtn} onPress={() => openModal()}>
                        <MaterialIcons name="add" size={24} color={Colors.white} />
                        <Text style={styles.addBtnText}>Add User</Text>
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={users}
                renderItem={renderUserItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
                refreshing={loading}
                onRefresh={fetchUsers}
            />

            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>
                            {editingUser ? 'Edit User' : 'Add User'}
                        </Text>
                        
                        <ScrollView style={styles.modalForm}>
                            <Text style={[styles.label, { color: theme.text }]}>Full Name</Text>
                            <TextInput
                                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                                value={formData.name}
                                onChangeText={(text) => setFormData({...formData, name: text})}
                                placeholder="Enter name"
                                placeholderTextColor={Colors.grey}
                            />

                            <Text style={[styles.label, { color: theme.text }]}>Email</Text>
                            <TextInput
                                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                                value={formData.email}
                                onChangeText={(text) => setFormData({...formData, email: text})}
                                placeholder="Enter email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholderTextColor={Colors.grey}
                            />

                            {!editingUser && (
                                <>
                                    <Text style={[styles.label, { color: theme.text }]}>Password</Text>
                                    <View style={styles.passwordContainer}>
                                        <TextInput
                                            style={[styles.input, styles.passwordInput, { color: theme.text, borderColor: theme.border }]}
                                            value={formData.password}
                                            onChangeText={(text) => setFormData({...formData, password: text})}
                                            placeholder="Enter password"
                                            secureTextEntry={!showPassword}
                                            placeholderTextColor={Colors.grey}
                                        />
                                        <TouchableOpacity 
                                            style={styles.eyeIcon} 
                                            onPress={() => setShowPassword(!showPassword)}
                                        >
                                            <MaterialIcons 
                                                name={showPassword ? "visibility" : "visibility-off"} 
                                                size={24} 
                                                color={Colors.grey} 
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}

                            {(isMaster || isSuper) && (
                                <>
                                    <Text style={[styles.label, { color: theme.text }]}>Roles</Text>
                                    <View style={styles.rolesGrid}>
                                        {roles
                                            .filter(role => isMaster || role.code !== Roles.master)
                                            .map((role) => {
                                            return (
                                                <TouchableOpacity 
                                                    key={role.id}
                                                    style={[
                                                        styles.roleItem,
                                                        formData.selectedRoles.includes(role.id) && styles.roleItemSelected,
                                                        { borderColor: theme.border }
                                                    ]}
                                                    onPress={() => {
                                                        const newRoles = formData.selectedRoles.includes(role.id)
                                                            ? formData.selectedRoles.filter(id => id !== role.id)
                                                            : [...formData.selectedRoles, role.id];
                                                        setFormData({...formData, selectedRoles: newRoles});
                                                    }}
                                                >
                                                    <Text style={[
                                                        styles.roleItemText,
                                                        formData.selectedRoles.includes(role.id) && styles.roleItemTextSelected,
                                                        { color: theme.text }
                                                    ]}>
                                                        {role.name}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>

                                    <View style={styles.switchRow}>
                                        <Text style={[styles.label, { color: theme.text }]}>Disabled</Text>
                                        <Switch
                                            value={formData.disabled}
                                            onValueChange={(val) => setFormData({...formData, disabled: val})}
                                            trackColor={{ false: Colors.grey, true: Colors.red }}
                                        />
                                    </View>
                                </>
                            )}
                        </ScrollView>

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveUser}>
                                <Text style={styles.saveBtnText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal visible={resetModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>Reset Password</Text>
                        <Text style={[styles.label, { color: theme.text, textAlign: 'center', marginTop: 0 }]}>
                            Reset password for: {resettingUser?.name}
                        </Text>
                        
                        <View style={styles.modalForm}>
                            <Text style={[styles.label, { color: theme.text }]}>New Password</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={[styles.input, styles.passwordInput, { color: theme.text, borderColor: theme.border }]}
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    placeholder="Enter new password (min. 6 chars)"
                                    secureTextEntry={!showResetPassword}
                                    placeholderTextColor={Colors.grey}
                                />
                                <TouchableOpacity 
                                    style={styles.eyeIcon} 
                                    onPress={() => setShowResetPassword(!showResetPassword)}
                                >
                                    <MaterialIcons 
                                        name={showResetPassword ? "visibility" : "visibility-off"} 
                                        size={24} 
                                        color={Colors.grey} 
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setResetModalVisible(false)}>
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.saveBtn, isSaving && { opacity: 0.7 }]} 
                                onPress={confirmResetPassword}
                                disabled={isSaving}
                            >
                                <Text style={styles.saveBtnText}>
                                    {isSaving ? 'Resetting...' : 'Reset Password'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 50,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuBtn: {
        marginRight: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.bgOrange,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    addBtnText: {
        color: Colors.white,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    list: {
        padding: 20,
    },
    userCard: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 15,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    userEmail: {
        fontSize: 14,
        color: Colors.grey,
        marginTop: 2,
    },
    roleContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    roleBadge: {
        backgroundColor: Colors.bgOrangeTransparent,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 5,
        marginRight: 5,
        marginBottom: 5,
    },
    roleText: {
        fontSize: 10,
        color: Colors.bgOrange,
        fontWeight: 'bold',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionBtn: {
        padding: 8,
        marginLeft: 5,
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
        maxHeight: '80%',
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
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    passwordInput: {
        flex: 1,
    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
    },
    rolesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
    },
    roleItem: {
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
    },
    roleItemSelected: {
        backgroundColor: Colors.bgOrange,
        borderColor: Colors.bgOrange,
    },
    roleItemText: {
        fontSize: 12,
    },
    roleItemTextSelected: {
        color: Colors.white,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
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
