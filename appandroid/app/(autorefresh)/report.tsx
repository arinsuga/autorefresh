import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/Authcontext';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';

export default function ReportScreen() {
    const { authState } = useAuth();
    const { theme } = useTheme();
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);
    const [reportType, setReportType] = useState('Summary'); // Summary | Detail
    const [branch, setBranch] = useState(authState?.selectedBranch?.branch_name || 'All Branches');
    const [dateFrom, setDateFrom] = useState(moment().startOf('month').format('YYYY-MM-DD'));
    const [dateTo, setDateTo] = useState(moment().format('YYYY-MM-DD'));
    const [vehicleType, setVehicleType] = useState('All');
    const [serviceType, setServiceType] = useState('All');
    const [paymentType, setPaymentType] = useState('All');
    
    const [results, setResults] = useState<any[]>([]);
    const [showResults, setShowResults] = useState(false);

    const generateDummyReport = () => {
        const dummy: any[] = [];
        for (let i = 0; i < 15; i++) {
            dummy.push({
                date: moment().subtract(i, 'days').format('YYYY-MM-DD'),
                total_transactions: Math.floor(Math.random() * 20) + 5,
                total_revenue: (Math.floor(Math.random() * 10) + 5) * 100000,
                branch: branch === 'All Branches' ? 'Branch ' + ((i % 3) + 1) : branch,
                vehicle: 'Car/Motorcycle',
                payment: 'Cash/QRIS'
            });
        }
        return dummy;
    };

    const handleView = () => {
        setResults(generateDummyReport());
        setShowResults(true);
    };

    const handlePrint = () => {
        Alert.alert('Print', 'Connecting to Bluetooth Printer...');
    };

    const handleShare = () => {
        Alert.alert('Share', 'Generating PDF Report for WhatsApp...');
    };

    const handleNewTransaction = () => {
        router.push({
            pathname: '/(autorefresh)/transaction',
            params: { autoOpenScanner: 'true' }
        });
    };

    const onRefresh = async () => {
        setRefreshing(true);
        if (showResults) handleView();
        setRefreshing(false);
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView 
                style={[styles.container, { backgroundColor: theme.background }]}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.text }]}>Report Center</Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Report Type</Text>
                        <View style={styles.pickerContainer}>
                            {['Summary', 'Detail'].map(t => (
                                <TouchableOpacity 
                                    key={t}
                                    style={[styles.typeButton, reportType === t && styles.activeTypeButton]}
                                    onPress={() => setReportType(t)}
                                >
                                    <Text style={[styles.typeText, reportType === t && styles.activeTypeText]}>{t}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.formRow}>
                        <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                            <Text style={styles.label}>From</Text>
                            <TextInput 
                                style={[styles.input, { color: theme.text }]} 
                                value={dateFrom} 
                                onChangeText={setDateFrom}
                            />
                        </View>
                        <View style={[styles.formGroup, { flex: 1 }]}>
                            <Text style={styles.label}>To</Text>
                            <TextInput 
                                style={[styles.input, { color: theme.text }]} 
                                value={dateTo} 
                                onChangeText={setDateTo}
                            />
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Branch</Text>
                        <TextInput style={[styles.input, { color: theme.text }]} value={branch} editable={false} />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Vehicle Type</Text>
                        <TextInput style={[styles.input, { color: theme.text }]} value={vehicleType} editable={false} />
                    </View>

                    <View style={styles.actionRow}>
                        <TouchableOpacity style={[styles.actionButton, { backgroundColor: Colors.bgOrange }]} onPress={handleView}>
                            <MaterialIcons name="visibility" size={20} color={Colors.white} />
                            <Text style={styles.actionButtonText}>View</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionButton, { backgroundColor: Colors.blue }]} onPress={handlePrint}>
                            <MaterialIcons name="print" size={20} color={Colors.white} />
                            <Text style={styles.actionButtonText}>Print</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionButton, { backgroundColor: Colors.green }]} onPress={handleShare}>
                            <MaterialIcons name="share" size={20} color={Colors.white} />
                            <Text style={styles.actionButtonText}>Share</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {showResults && (
                    <View style={styles.resultsContainer}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Results</Text>
                        {results.map((item, index) => (
                            <View key={index} style={[styles.reportCard, { backgroundColor: theme.surface }]}>
                                <View style={styles.cardHeader}>
                                    <MaterialIcons name="event" size={18} color={Colors.bgOrange} />
                                    <Text style={[styles.cardDate, { color: theme.text }]}>{moment(item.date).format('DD MMM YYYY')}</Text>
                                    <Text style={styles.cardBranch}>{item.branch}</Text>
                                </View>
                                <View style={styles.cardBody}>
                                    <View style={styles.statBox}>
                                        <Text style={styles.statLabel}>TRX</Text>
                                        <Text style={[styles.statValue, { color: theme.text }]}>{item.total_transactions}</Text>
                                    </View>
                                    <View style={styles.statBox}>
                                        <Text style={styles.statLabel}>Revenue</Text>
                                        <Text style={[styles.statValue, { color: Colors.green }]}>Rp {item.total_revenue.toLocaleString('id-ID')}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
                
                <View style={{ height: 100 }} />
            </ScrollView>

            <TouchableOpacity style={styles.fab} onPress={handleNewTransaction}>
                <MaterialIcons name="add" size={30} color={Colors.white} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    formContainer: {
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderRadius: 15,
        margin: 15,
    },
    formGroup: {
        marginBottom: 15,
    },
    formRow: {
        flexDirection: 'row',
    },
    label: {
        fontSize: 14,
        color: Colors.grey,
        marginBottom: 5,
        fontWeight: '600',
    },
    input: {
        height: 45,
        backgroundColor: Colors.white,
        borderRadius: 10,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: Colors.greyDark,
    },
    pickerContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: 10,
        padding: 5,
        borderWidth: 1,
        borderColor: Colors.greyDark,
    },
    typeButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTypeButton: {
        backgroundColor: Colors.bgOrange,
    },
    typeText: {
        fontSize: 14,
        color: Colors.black,
    },
    activeTypeText: {
        color: Colors.white,
        fontWeight: 'bold',
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        height: 45,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    actionButtonText: {
        color: Colors.white,
        fontWeight: 'bold',
        marginLeft: 5,
        fontSize: 14,
    },
    resultsContainer: {
        padding: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    reportCard: {
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        elevation: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardDate: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    cardBranch: {
        fontSize: 12,
        color: Colors.grey,
        marginLeft: 'auto',
    },
    cardBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statBox: {
        flex: 1,
    },
    statLabel: {
        fontSize: 10,
        color: Colors.grey,
    },
    statValue: {
        fontSize: 14,
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
