import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, TextInput, ScrollView } from 'react-native';
import { useAuth } from '@/contexts/Authcontext';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import BranchService from '@/services/BranchService';
import Roles from '@/constants/Roles';
import { IBranch } from '@/interfaces/IBranch';
import { useMenu } from '@/contexts/MenuContext';

export default function BranchManagementScreen() {
    const { authState } = useAuth();
    const { theme } = useTheme();
    const { openMenu } = useMenu();
    const [branches, setBranches] = useState<IBranch[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingBranch, setEditingBranch] = useState<IBranch | null>(null);
    const [formData, setFormData] = useState({
        branch_code: '',
        branch_name: '',
        branch_address: '',
        branch_phone: '',
    });

    const userRoles = authState?.user?.roles || [];
    const isMaster = userRoles.some(r => r.code === Roles.master);
    const isSuper = userRoles.some(r => r.code === Roles.super);

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        setLoading(true);
        try {
            const data = await BranchService.getActive();
            setBranches(data);
        } catch (error) {
            console.error('Failed to fetch branches', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveBranch = async () => {
        try {
            if (editingBranch) {
                await BranchService.update(editingBranch.id, formData);
                Alert.alert('Success', 'Branch updated successfully');
            } else {
                await BranchService.create(formData);
                Alert.alert('Success', 'Branch created successfully');
            }
            setModalVisible(false);
            fetchBranches();
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to save branch');
        }
    };

    const handleDeleteBranch = (id: number) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this branch?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Delete', 
                    style: 'destructive', 
                    onPress: async () => {
                        try {
                            await BranchService.delete(id);
                            fetchBranches();
                        } catch (error: any) {
                            Alert.alert('Error', error.response?.data?.message || 'Failed to delete branch');
                        }
                    } 
                }
            ]
        );
    };

    const openModal = (branch: IBranch | null = null) => {
        if (branch) {
            setEditingBranch(branch);
            setFormData({
                branch_code: branch.branch_code,
                branch_name: branch.branch_name,
                branch_address: branch.branch_address || '',
                branch_phone: branch.branch_phone || '',
            });
        } else {
            setEditingBranch(null);
            setFormData({
                branch_code: '',
                branch_name: '',
                branch_address: '',
                branch_phone: '',
            });
        }
        setModalVisible(true);
    };

    const renderBranchItem = ({ item }: { item: IBranch }) => (
        <View style={[styles.branchCard, { backgroundColor: theme.surface }]}>
            <View style={styles.branchInfo}>
                <Text style={[styles.branchName, { color: theme.text }]}>{item.branch_name}</Text>
                <Text style={styles.branchCode}>{item.branch_code}</Text>
                {item.branch_address ? (
                    <Text style={[styles.branchAddress, { color: theme.text }]}>{item.branch_address}</Text>
                ) : null}
            </View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => openModal(item)} style={styles.actionBtn}>
                    <MaterialIcons name="edit" size={24} color={Colors.blue} />
                </TouchableOpacity>
                {isMaster && (
                    <TouchableOpacity onPress={() => handleDeleteBranch(item.id)} style={styles.actionBtn}>
                        <MaterialIcons name="delete" size={24} color={Colors.red} />
                    </TouchableOpacity>
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
                    <Text style={[styles.title, { color: theme.text }]}>Branches</Text>
                </View>
                {isMaster && (
                    <TouchableOpacity style={styles.addBtn} onPress={() => openModal()}>
                        <MaterialIcons name="add" size={24} color={Colors.white} />
                        <Text style={styles.addBtnText}>Add Branch</Text>
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={branches}
                renderItem={renderBranchItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
                refreshing={loading}
                onRefresh={fetchBranches}
            />

            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>
                            {editingBranch ? 'Edit Branch' : 'Add Branch'}
                        </Text>
                        
                        <ScrollView style={styles.modalForm}>
                            <Text style={[styles.label, { color: theme.text }]}>Branch Code</Text>
                            <TextInput
                                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                                value={formData.branch_code}
                                onChangeText={(text) => setFormData({...formData, branch_code: text})}
                                placeholder="e.g. B001"
                                placeholderTextColor={Colors.grey}
                            />

                            <Text style={[styles.label, { color: theme.text }]}>Branch Name</Text>
                            <TextInput
                                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                                value={formData.branch_name}
                                onChangeText={(text) => setFormData({...formData, branch_name: text})}
                                placeholder="Enter branch name"
                                placeholderTextColor={Colors.grey}
                            />

                            <Text style={[styles.label, { color: theme.text }]}>Address</Text>
                            <TextInput
                                style={[styles.input, { color: theme.text, borderColor: theme.border, height: 80 }]}
                                value={formData.branch_address}
                                onChangeText={(text) => setFormData({...formData, branch_address: text})}
                                placeholder="Enter address"
                                multiline
                                placeholderTextColor={Colors.grey}
                            />

                            <Text style={[styles.label, { color: theme.text }]}>Phone</Text>
                            <TextInput
                                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                                value={formData.branch_phone}
                                onChangeText={(text) => setFormData({...formData, branch_phone: text})}
                                placeholder="Enter phone number"
                                keyboardType="phone-pad"
                                placeholderTextColor={Colors.grey}
                            />
                        </ScrollView>

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveBranch}>
                                <Text style={styles.saveBtnText}>Save</Text>
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
    branchCard: {
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
    branchInfo: {
        flex: 1,
    },
    branchName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    branchCode: {
        fontSize: 12,
        color: Colors.bgOrange,
        fontWeight: 'bold',
        marginTop: 2,
    },
    branchAddress: {
        fontSize: 14,
        marginTop: 5,
        opacity: 0.7,
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
