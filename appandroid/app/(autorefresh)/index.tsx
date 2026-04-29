import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useAuth } from '@/contexts/Authcontext';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import StatsCard from '@/components/StatsCard';
import TransactionService from '@/services/TransactionService';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import moment from 'moment';

export default function AutoRefreshDashboard() {
    const { authState } = useAuth();
    const { theme } = useTheme();
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);
    const [stats, setStats] = useState({
        todayCount: 0,
        todayRevenue: 0,
        monthCount: 0,
        monthRevenue: 0,
    });

    const fetchData = async () => {
        if (!authState?.user?.branch_id) return;
        
        try {
            const today = moment().format('YYYY-MM-DD');
            const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
            const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');

            const todayData = await TransactionService.getReportSummary({
                branch_id: authState.user.branch_id,
                start_dt: today,
                end_dt: today,
            });

            const monthData = await TransactionService.getReportSummary({
                branch_id: authState.user.branch_id,
                start_dt: startOfMonth,
                end_dt: endOfMonth,
            });

            setStats({
                todayCount: todayData.length > 0 ? todayData[0].total_transactions : 0,
                todayRevenue: todayData.length > 0 ? todayData[0].total_revenue : 0,
                monthCount: monthData.length > 0 ? monthData[0].total_transactions : 0,
                monthRevenue: monthData.length > 0 ? monthData[0].total_revenue : 0,
            });
        } catch (error) {
            console.error('Failed to fetch dashboard stats', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [authState]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    return (
        <ScrollView 
            style={[styles.container, { backgroundColor: theme.background }]}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <View style={styles.header}>
                <Text style={[styles.welcome, { color: theme.text }]}>
                    Welcome back,
                </Text>
                <Text style={styles.userName}>
                    {authState?.user?.fullname || 'User'}
                </Text>
                <Text style={[styles.branchName, { color: theme.text }]}>
                    Branch ID: {authState?.user?.branch_id}
                </Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.row}>
                    <View style={styles.col}>
                        <StatsCard 
                            title="Today's Transactions" 
                            value={stats.todayCount} 
                            icon="receipt" 
                            color={Colors.bgOrange} 
                        />
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col}>
                        <StatsCard 
                            title="Today's Revenue" 
                            value={`Rp ${stats.todayRevenue.toLocaleString('id-ID')}`} 
                            icon="attach-money" 
                            color={Colors.green} 
                        />
                    </View>
                </View>
                
                <View style={styles.divider} />
                
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Monthly Overview</Text>
                
                <View style={styles.row}>
                    <View style={styles.col}>
                        <StatsCard 
                            title="Total Transactions" 
                            value={stats.monthCount} 
                            icon="assessment" 
                            color={Colors.blue} 
                        />
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.col}>
                        <StatsCard 
                            title="Total Revenue" 
                            value={`Rp ${stats.monthRevenue.toLocaleString('id-ID')}`} 
                            icon="payments" 
                            color={Colors.purple} 
                        />
                    </View>
                </View>
            </View>

            <TouchableOpacity 
                style={styles.fab} 
                onPress={() => router.push('/(autorefresh)/transaction/new')}
            >
                <MaterialIcons name="add" size={30} color={Colors.white} />
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        paddingTop: 40,
    },
    welcome: {
        fontSize: 16,
    },
    userName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.bgOrange,
    },
    branchName: {
        fontSize: 14,
        marginTop: 5,
        opacity: 0.7,
    },
    statsContainer: {
        padding: 15,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    col: {
        flex: 1,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.greyDark,
        marginVertical: 20,
        opacity: 0.2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        marginLeft: 5,
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
