import React, { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    SafeAreaView, 
    Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import moment from 'moment';

//Context
import { useAuth } from '@/contexts/Authcontext';
import { useTheme } from '@/contexts/ThemeContext';

//Constants
import { Colors } from '@/constants/Colors';
import Styles from '@/constants/Styles';

//Components
import DateInfo from "@/components/DateInfo/DateInfo";
import DatePeriodInfo from "@/components/DatePeriodInfo/DatePeriodInfo";
import DateList from "@/components/DateList/DateList";
import ReportTimelineList from "@/components/ReportTimelineList/ReportTimelineList";
import ReportFilterDialog from "@/components/ReportFilterDialog";
import Icon from "@/components/Icon/Icon";

//Interfaces
import { ITransaction } from '@/interfaces/ITransaction';

//Services
import TransactionService from '@/services/TransactionService';
import ReportExportService from '@/services/ReportExportService';

export default function ReportScreen() {
    const { authState } = useAuth();
    const { theme } = useTheme();
    const router = useRouter();

    const [currentDate, setCurrentDate] = useState(moment());
    const [selectedDate, setSelectedDate] = useState(currentDate.clone());
    const [selectedDatePeriod, setSelectedDatePeriod] = useState<{ dateFrom: string, dateTo: string }>({ dateFrom: '', dateTo: '' });
    
    const [isWaiting, setIsWaiting] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [showFilter, setShowFilter] = useState(false);

    const [reportType, setReportType] = useState<'Summary' | 'Detail'>('Detail');
    const [results, setResults] = useState<any[]>([]);

    const handleSelectedDate = useCallback(async (date: moment.Moment) => {
        setIsWaiting(true);
        setReportType('Detail');
        setIsViewMode(false);
        try {
            const params = {
                date: date.format('YYYY-MM-DD'),
                branch_id: authState?.selectedBranch?.id
            };
            const data = await TransactionService.getReportDetail(params);
            setResults(data);
            setSelectedDate(date);
        } catch (error) {
            console.error('Failed to fetch report', error);
        } finally {
            setIsWaiting(false);
        }
    }, [authState?.selectedBranch]);

    const handleRefresh = useCallback(async (viewMode: boolean, parDate: moment.Moment, parDateFrom?: string, parDateTo?: string) => {
        if (viewMode) {
            // Re-run the last filter logic if possible or just refresh period
            handleView( { 
                dateFrom: parDateFrom, 
                dateTo: parDateTo, 
                branch: authState?.selectedBranch,
                reportType: reportType,
                vehicleIds: [], // We don't have the last full filters here, maybe should store them
                serviceIds: []
            });
        } else {
            handleSelectedDate(parDate);
        }
    }, [handleSelectedDate, authState?.selectedBranch, reportType]);

    const handleView = async (filters: any) => {
        setIsViewMode(true);
        setShowFilter(false);
        setIsWaiting(true);
        setReportType(filters.reportType);
        setSelectedDatePeriod({ dateFrom: filters.dateFrom, dateTo: filters.dateTo });

        try {
            const params = {
                date_from: filters.dateFrom,
                date_to: filters.dateTo,
                branch_id: filters.branch?.id,
                vehicle_type_id: filters.vehicleIds?.filter((id: number) => id !== 0).join(','),
                service_ids: filters.serviceIds?.join(',')
            };
            
            const data = filters.reportType === 'Summary' 
                ? await TransactionService.getReportSummary(params)
                : await TransactionService.getReportDetail(params);
                
            setResults(data);
        } catch (error) {
            console.error('Error fetching filtered report', error);
        } finally {
            setIsWaiting(false);
        }
    };

    const handlePrint = async (filters: any) => {
        setShowFilter(false);
        Alert.alert('Print', 'Printing feature coming soon...');
    };

    const handleExportPDF = async (filters: any) => {
        setIsWaiting(true);
        try {
            // Fetch fresh data for export to ensure it matches current filters
            const params = {
                date_from: filters.dateFrom,
                date_to: filters.dateTo,
                branch_id: filters.branch?.id,
                vehicle_type_id: filters.vehicleIds?.filter((id: number) => id !== 0).join(','),
                service_ids: filters.serviceIds?.join(',')
            };
            
            const data = filters.reportType === 'Summary' 
                ? await TransactionService.getReportSummary(params)
                : await TransactionService.getReportDetail(params);

            await ReportExportService.generatePDF(data, filters);
        } catch (error) {
            Alert.alert('Error', 'Failed to generate PDF');
        } finally {
            setIsWaiting(false);
            setShowFilter(false);
        }
    };

    const handleExportCSV = async (filters: any) => {
        setIsWaiting(true);
        try {
            // Fetch fresh data for export to ensure it matches current filters
            const params = {
                date_from: filters.dateFrom,
                date_to: filters.dateTo,
                branch_id: filters.branch?.id,
                vehicle_type_id: filters.vehicleIds?.filter((id: number) => id !== 0).join(','),
                service_ids: filters.serviceIds?.join(',')
            };
            
            const data = filters.reportType === 'Summary' 
                ? await TransactionService.getReportSummary(params)
                : await TransactionService.getReportDetail(params);

            await ReportExportService.generateCSV(data, filters);
        } catch (error) {
            Alert.alert('Error', 'Failed to generate CSV');
        } finally {
            setIsWaiting(false);
            setShowFilter(false);
        }
    };

    useEffect(() => {
        handleSelectedDate(selectedDate);
    }, []);

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: Colors.white }]}>
            
            {/* SECTION HEADER */}
            <View style={styles.headerRow}>
                {!isViewMode ? (
                    <>
                        <DateInfo date={selectedDate} currentDate={currentDate} />
                        <View style={styles.actionButtonGroup}>
                            <TouchableOpacity 
                                style={[Styles.btn, styles.actionBtn, { backgroundColor: Colors.primary }]} 
                                onPress={() => setShowFilter(true)}
                            >
                                <Icon.Share size={18} color={Colors.white} />
                                <Text style={styles.actionBtnText}>Bagikan</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <>
                        <DatePeriodInfo dateFrom={selectedDatePeriod.dateFrom} dateTo={selectedDatePeriod.dateTo} />
                        <TouchableOpacity 
                            style={[Styles.btn, styles.backBtn]} 
                            onPress={() => {
                                handleSelectedDate(selectedDate);
                                setIsViewMode(false);
                            }}
                        >
                            <Icon.ArrowLeft size={18} color={Colors.white} />
                            <Text style={styles.backBtnText}>Kembali</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>

            {/* DATE LIST FILTER */}
            {!isViewMode && (
                <DateList date={selectedDate} onSelectedDate={handleSelectedDate} />
            )}

            {/* DIVIDER */}
            <View style={styles.divider} />

            {/* DATA LIST */}
            <View style={styles.listContainer}>
                <ReportTimelineList
                    data={results}
                    date={selectedDate}
                    datePeriod={selectedDatePeriod}
                    isViewMode={isViewMode}
                    isRefreshing={isWaiting}
                    reportType={reportType}
                    onRefresh={handleRefresh}
                    onItemPress={(item) => !isViewMode && Alert.alert('Rincian', `Transaksi: ${item.transaction_number}`)}
                />
            </View>

            <ReportFilterDialog
                visible={showFilter}
                initialBranch={authState?.selectedBranch}
                onView={handleView}
                onPrint={handlePrint}
                onExportPDF={handleExportPDF}
                onExportCSV={handleExportCSV}
                onCancel={() => setShowFilter(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    actionButtonGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 10,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        columnGap: 8,
    },
    actionBtnText: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: 'bold',
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.greyDark,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        columnGap: 5,
    },
    backBtnText: {
        color: Colors.white,
        fontWeight: 'bold',
    },
    divider: {
        backgroundColor: Colors.whiteDark,
        height: 1,
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 15,
    },
});


