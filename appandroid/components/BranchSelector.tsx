import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList } from 'react-native';
import { Colors } from '@/constants/Colors';
import BranchService from '@/services/BranchService';
import { IBranch } from '@/interfaces/IBranch';
import { MaterialIcons } from '@expo/vector-icons';

interface BranchSelectorProps {
    onSelect: (branch: IBranch) => void;
    selectedBranch?: IBranch | null;
}

const BranchSelector: React.FC<BranchSelectorProps> = ({ onSelect, selectedBranch }) => {
    const [branches, setBranches] = useState<IBranch[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        setLoading(true);
        try {
            const data = await BranchService.getActive();
            setBranches(data);
            
            // Set default selected branch if none is currently selected
            if (data.length > 0 && !selectedBranch) {
                onSelect(data[0]);
            }
        } catch (error) {
            console.error('Failed to fetch branches', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (branch: IBranch) => {
        onSelect(branch);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.selector} 
                onPress={() => setModalVisible(true)}
            >
                <MaterialIcons name="store" size={24} color={Colors.bgOrange} />
                <Text style={[styles.text, !selectedBranch && styles.placeholder]}>
                    {selectedBranch ? selectedBranch.branch_name : 'Select Branch'}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={24} color={Colors.grey} />
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Branch</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <MaterialIcons name="close" size={24} color={Colors.black} />
                            </TouchableOpacity>
                        </View>
                        
                        <FlatList
                            data={branches}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    style={styles.branchItem} 
                                    onPress={() => handleSelect(item)}
                                >
                                    <Text style={styles.branchName}>{item.branch_name}</Text>
                                    <Text style={styles.branchCode}>{item.branch_code}</Text>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={() => (
                                <View style={styles.emptyContainer}>
                                    <Text>{loading ? 'Loading...' : 'No branches available'}</Text>
                                </View>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 20,
    },
    selector: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.greyLight,
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    text: {
        flex: 1,
        fontSize: 16,
        color: Colors.black,
        marginLeft: 10,
    },
    placeholder: {
        color: Colors.grey,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '60%',
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.black,
    },
    branchItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.greyDark,
    },
    branchName: {
        fontSize: 16,
        color: Colors.black,
    },
    branchCode: {
        fontSize: 12,
        color: Colors.grey,
        marginTop: 2,
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    }
});

export default BranchSelector;
