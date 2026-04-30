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
import { useRouter } from 'expo-router';
import moment from 'moment';

export default function TransactionHistoryScreen() {
    const { authState } = useAuth();
    const { theme } = useTheme();
    const router = useRouter();
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [visibleTransactions, setVisibleTransactions] = useState<ITransaction[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<ITransaction | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const maxItems = 20;

    const generateDummyData = () => {
        const dummy: ITransaction[] = [];
        const plates = ['B 1234 ABC', 'D 5678 XYZ', 'B 9999 SS', 'F 4422 GHI', 'L 1000 OK'];
        const customers = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown', 'Charlie Davis'];
        
        for (let i = 1; i <= maxItems; i++) {
            dummy.push({
                id: i,
                transaction_number: `TRX-20260430-${i.toString().padStart(5, '0')}`,
                transaction_dt: moment().subtract(i * 10, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
                plate_number: plates[i % plates.length],
                gross_total: 50000 + (i * 5000),
                discount: 0,
                net_total: 50000 + (i * 5000),
                vehicle_type_id: (i % 2) + 1,
                payment_method_id: (i % 2) + 1,
                branch_id: 1,
                customer_name: customers[i % customers.length],
            });
        }
        return dummy;
    };

    const fetchTransactions = async () => {
        const allDummy = generateDummyData();
        setTransactions(allDummy);
        setVisibleTransactions(allDummy.slice(0, pageSize));
        setPage(1);
    };

    useEffect(() => {
        fetchTransactions();
    }, [authState]);

    const loadMore = () => {
        if (visibleTransactions.length >= transactions.length) return;
        
        const nextItems = transactions.slice(0, (page + 1) * pageSize);
        setVisibleTransactions(nextItems);
        setPage(page + 1);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchTransactions();
        setRefreshing(false);
    };

    const handleSelectTransaction = (item: ITransaction) => {
        setSelectedTransaction(item);
        setModalVisible(true);
    };

    const handleNewTransaction = () => {
        router.push({
            pathname: '/(autorefresh)/transaction',
            params: { autoOpenScanner: 'true' }
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <FlatList
                data={visibleTransactions}
                keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                renderItem={({ item }) => (
                    <TransactionCard 
                        transaction={item} 
                        onPress={() => handleSelectTransaction(item)} 
                    />
                )}
                contentContainerStyle={styles.listContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="history" size={60} color={Colors.grey} />
                        <Text style={styles.emptyText}>No transactions found</Text>
                    </View>
                )}
            />

            <TouchableOpacity style={styles.fab} onPress={handleNewTransaction}>
                <MaterialIcons name="add" size={30} color={Colors.white} />
            </TouchableOpacity>

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
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        backgroundColor: Colors.bgOrange,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    }
});
