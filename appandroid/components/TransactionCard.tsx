import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { ITransaction } from '@/interfaces/ITransaction';
import { MaterialIcons } from '@expo/vector-icons';

interface TransactionCardProps {
    transaction: ITransaction;
    onPress: () => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, onPress }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.header}>
                <Text style={styles.trxNumber}>{transaction.transaction_number}</Text>
                <Text style={styles.date}>{transaction.transaction_dt}</Text>
            </View>
            
            <View style={styles.content}>
                <View style={styles.mainInfo}>
                    <Text style={styles.plateNumber}>{transaction.plate_number}</Text>
                    <Text style={styles.vehicleType}>{transaction.vehicle_type?.vehicle_type_name}</Text>
                </View>
                
                <View style={styles.totalInfo}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>
                        Rp {transaction.net_total.toLocaleString('id-ID')}
                    </Text>
                </View>
            </View>
            
            <View style={styles.footer}>
                <View style={styles.paymentBadge}>
                    <MaterialIcons name="payment" size={14} color={Colors.grey} />
                    <Text style={styles.paymentText}>{transaction.payment_method?.payment_method_name}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={Colors.grey} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.greyDark,
        paddingBottom: 5,
    },
    trxNumber: {
        fontSize: 12,
        color: Colors.bgOrange,
        fontWeight: 'bold',
    },
    date: {
        fontSize: 12,
        color: Colors.grey,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
    },
    mainInfo: {
        flex: 1,
    },
    plateNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.black,
    },
    vehicleType: {
        fontSize: 14,
        color: Colors.grey,
        marginTop: 2,
    },
    totalInfo: {
        alignItems: 'flex-end',
    },
    totalLabel: {
        fontSize: 12,
        color: Colors.grey,
    },
    totalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.black,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    paymentBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.whiteDark,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 5,
    },
    paymentText: {
        fontSize: 11,
        color: Colors.grey,
        marginLeft: 5,
    },
});

export default TransactionCard;
