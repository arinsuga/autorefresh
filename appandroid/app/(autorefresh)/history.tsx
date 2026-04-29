import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Modal, TouchableOpacity } from 'react-native';
import { useAuth } from '@/contexts/Authcontext';
import { useTheme } from '@/contexts/ThemeContext';
import TransactionService from '@/services/TransactionService';
import { ITransaction } from '@/interfaces/ITransaction';
import TransactionCard from '@/components/TransactionCard';
import ReceiptView from '@/components/ReceiptView';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';

export default function TransactionHistoryScreen() {
    const { authState } = useAuth();
    const { theme } = useTheme();
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<ITransaction | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const fetchTransactions = async () => {
        if (!authState?.user?.branch_id) return;
        try {
            const data = await TransactionService.getByBranch(authState.user.branch_id);
            setTransactions(data);
        } catch (error) {
            console.error('Failed to fetch transactions', error);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [authState]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchTransactions();
        setRefreshing(false);
    };

    const handleSelectTransaction = (item: ITransaction) => {
        setSelectedTransaction(item);
        setModalVisible(true);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                renderItem={({ item }) => (
                    <TransactionCard 
                        transaction={item} 
                        onPress={() => handleSelectTransaction(item)} 
                    />
                )}
                contentContainerStyle={styles.listContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="history" size={60} color={Colors.grey} />
                        <Text style={styles.emptyText}>No transactions found</Text>
                    </View>
                )}
            />

            <Modal
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={[styles.modalHeader, { backgroundColor: theme.surface }]}>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <MaterialIcons name="arrow-back" size={28} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.modalTitle, { color: theme.text }]}>Transaction Detail</Text>
                    <TouchableOpacity onPress={() => {/* Print logic */}}>
                        <MaterialIcons name="print" size={28} color={Colors.bgOrange} />
                    </TouchableOpacity>
                </View>
                
                {selectedTransaction && <ReceiptView transaction={selectedTransaction} />}
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        padding: 15,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 16,
        color: Colors.grey,
        marginTop: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 50,
        borderBottomWidth: 1,
        borderBottomColor: Colors.greyDark,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    }
});
