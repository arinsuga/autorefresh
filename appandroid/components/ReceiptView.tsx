import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { ITransaction } from '@/interfaces/ITransaction';

interface ReceiptViewProps {
    transaction: ITransaction;
}

const ReceiptView: React.FC<ReceiptViewProps> = ({ transaction }) => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>AUTOREFRESH</Text>
                <Text style={styles.subtitle}>{transaction.branch?.branch_name}</Text>
                <Text style={styles.address}>{transaction.branch?.branch_address}</Text>
                <Text style={styles.phone}>{transaction.branch?.branch_phone}</Text>
                
                <View style={styles.divider} />
                
                <View style={styles.row}>
                    <Text style={styles.label}>TRX No:</Text>
                    <Text style={styles.value}>{transaction.transaction_number}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Date:</Text>
                    <Text style={styles.value}>{transaction.transaction_dt}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Plate:</Text>
                    <Text style={styles.value}>{transaction.plate_number}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Vehicle:</Text>
                    <Text style={styles.value}>{transaction.vehicle_type?.vehicle_type_name}</Text>
                </View>
                
                <View style={styles.divider} />
                
                <Text style={styles.sectionTitle}>SERVICES</Text>
                {transaction.transaction_services?.map((item, index) => (
                    <View key={index} style={styles.serviceRow}>
                        <Text style={styles.serviceName}>{item.service_type?.service_name}</Text>
                        <Text style={styles.servicePrice}>
                            Rp {item.service_price.toLocaleString('id-ID')}
                        </Text>
                    </View>
                ))}
                
                <View style={styles.divider} />
                
                <View style={styles.row}>
                    <Text style={styles.totalLabel}>TOTAL</Text>
                    <Text style={styles.totalValue}>
                        Rp {transaction.net_total.toLocaleString('id-ID')}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Payment:</Text>
                    <Text style={styles.value}>{transaction.payment_method?.payment_method_name}</Text>
                </View>
                
                <View style={styles.divider} />
                
                <Text style={styles.footer}>Thank you for choosing AutoRefresh!</Text>
                <Text style={styles.footer}>Clean Car, Happy Life.</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    card: {
        backgroundColor: Colors.white,
        padding: 25,
        borderRadius: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.bgOrange,
        letterSpacing: 2,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 5,
    },
    address: {
        fontSize: 12,
        color: Colors.grey,
        textAlign: 'center',
        marginTop: 3,
    },
    phone: {
        fontSize: 12,
        color: Colors.grey,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.greyDark,
        width: '100%',
        marginVertical: 15,
        borderStyle: 'dashed',
        borderRadius: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 5,
    },
    label: {
        fontSize: 14,
        color: Colors.grey,
    },
    value: {
        fontSize: 14,
        fontWeight: '500',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    serviceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 8,
    },
    serviceName: {
        fontSize: 14,
        flex: 1,
    },
    servicePrice: {
        fontSize: 14,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.bgOrange,
    },
    footer: {
        fontSize: 12,
        color: Colors.grey,
        marginTop: 5,
        fontStyle: 'italic',
    }
});

export default ReceiptView;
