import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useAuth } from '@/contexts/Authcontext';
import { useTheme } from '@/contexts/ThemeContext';
import TransactionService from '@/services/TransactionService';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';

export default function ReportScreen() {
    const { authState } = useAuth();
    const { theme } = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    const [summary, setSummary] = useState<any[]>([]);
    const [dateRange, setDateRange] = useState({
        start: moment().startOf('month').format('YYYY-MM-DD'),
        end: moment().format('YYYY-MM-DD'),
    });

    const fetchReport = async () => {
        if (!authState?.user?.branch_id) return;
        try {
            const data = await TransactionService.getReportSummary({
                branch_id: authState.user.branch_id,
                start_dt: dateRange.start,
                end_dt: dateRange.end,
            });
            setSummary(data);
        } catch (error) {
            console.error('Failed to fetch report', error);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [authState, dateRange]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchReport();
        setRefreshing(false);
    };

    return (
        <ScrollView 
            style={[styles.container, { backgroundColor: theme.background }]}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Revenue Report</Text>
                <Text style={styles.subtitle}>
                    {moment(dateRange.start).format('DD MMM')} - {moment(dateRange.end).format('DD MMM YYYY')}
                </Text>
            </View>

            <View style={styles.cardContainer}>
                {summary.map((item, index) => (
                    <View key={index} style={[styles.reportCard, { backgroundColor: theme.surface }]}>
                        <View style={styles.cardHeader}>
                            <MaterialIcons name="event" size={20} color={Colors.bgOrange} />
                            <Text style={[styles.cardDate, { color: theme.text }]}>
                                {moment(item.date).format('dddd, DD MMM YYYY')}
                            </Text>
                        </View>
                        
                        <View style={styles.cardBody}>
                            <View style={styles.statBox}>
                                <Text style={styles.statLabel}>Transactions</Text>
                                <Text style={[styles.statValue, { color: theme.text }]}>{item.total_transactions}</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Text style={styles.statLabel}>Revenue</Text>
                                <Text style={[styles.statValue, { color: Colors.green }]}>
                                    Rp {item.total_revenue.toLocaleString('id-ID')}
                                </Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>

            {summary.length === 0 && (
                <View style={styles.emptyContainer}>
                    <Text style={{ color: Colors.grey }}>No data for selected period</Text>
                </View>
            )}
        </ScrollView>
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
    subtitle: {
        fontSize: 14,
        color: Colors.grey,
        marginTop: 5,
    },
    cardContainer: {
        padding: 15,
    },
    reportCard: {
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        elevation: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.greyDark,
        paddingBottom: 10,
    },
    cardDate: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
    cardBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statBox: {
        flex: 1,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.grey,
        marginBottom: 5,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    }
});
