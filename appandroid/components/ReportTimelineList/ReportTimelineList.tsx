import React from 'react'
import { FlatList, RefreshControl, View, StyleSheet, ScrollView, Text } from 'react-native'
import moment from 'moment';

//Constants
import { Colors } from '@/constants/Colors';

//Interfaces
import { ITransaction } from '@/interfaces/ITransaction';

//Components
import Icon from '@/components/Icon/Icon';
import ReportTimelineItem from './ReportTimelineItem';
import ReportSummaryItem from './ReportSummaryItem';
import TimelineEmpty from '../TimelineList/TimelineEmpty';

interface IDatePeriod {
    dateFrom: string,
    dateTo: string
}

interface IReportListProps {
    data: any[];
    date: moment.Moment;
    datePeriod: IDatePeriod;
    isViewMode: boolean;
    isRefreshing: boolean;
    reportType: 'Summary' | 'Detail';
    onRefresh: (isViewMode: boolean, date: moment.Moment, dateFrom?: string, dateTo?: string) => Promise<void>;
    onItemPress?: (item: any) => void;
}

const ReportTimelineList = ({ 
    data, 
    date, 
    datePeriod, 
    isViewMode = false, 
    isRefreshing = false, 
    reportType = 'Detail',
    onRefresh,
    onItemPress
}: IReportListProps) => {

    const handleFlatRefresh = () => {
        onRefresh(isViewMode, date, datePeriod?.dateFrom, datePeriod?.dateTo);
    }

    // Process summary data for grouping
    const processedData = React.useMemo(() => {
        if (reportType !== 'Summary' || !data || data.length === 0) return data;

        const groups: { [key: string]: { title: string, date: string, items: any[], subtotal: number } } = {};
        let grandTotal = 0;

        data.forEach(item => {
            const key = `${item.branch_name}|${item.transaction_dt}`;
            if (!groups[key]) {
                groups[key] = {
                    title: item.branch_name,
                    date: item.transaction_dt,
                    items: [],
                    subtotal: 0
                };
            }
            groups[key].items.push(item);
            groups[key].subtotal += Number(item.total_net);
            grandTotal += Number(item.total_net);
        });

        return {
            groups: Object.values(groups),
            grandTotal
        };
    }, [data, reportType]);

    const renderItem = ({ item }: { item: any }) => {
        return (
            <ReportTimelineItem 
                item={item} 
                onPress={() => onItemPress && onItemPress(item)} 
            />
        );
    };

    const renderSummaryGroup = (group: any, index: number) => (
        <View key={index} style={styles.groupContainer}>
            <View style={styles.groupHeader}>
                <View>
                    <Text style={styles.groupTitle}>{group.title}</Text>
                    <Text style={styles.groupDate}>{group.date}</Text>
                </View>
                <Icon.Dashboard color={Colors.bgOrange} size={24} />
            </View>
            
            {group.items.map((item: any, idx: number) => (
                <ReportSummaryItem key={idx} item={item} />
            ))}

            <View style={styles.subtotalRow}>
                <Text style={styles.subtotalLabel}>Subtotal</Text>
                <Text style={styles.subtotalValue}>Rp {(group.subtotal ?? 0).toLocaleString('id-ID')}</Text>
            </View>
        </View>
    );

    const renderEmpty = () => (
        <TimelineEmpty isRefreshing={isRefreshing} emptyText='Data tidak ditemukan.' />
    );
    
    if (reportType === 'Summary' && !Array.isArray(processedData)) {
        return (
            <ScrollView 
                style={styles.container}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleFlatRefresh}
                        colors={[Colors.bgOrange]}
                    />
                }
            >
                {processedData.groups.map((group, index) => renderSummaryGroup(group, index))}
                
                {processedData.groups.length > 0 && (
                    <View style={styles.grandTotalContainer}>
                        <Text style={styles.grandTotalLabel}>TOTAL KESELURUHAN</Text>
                        <Text style={styles.grandTotalValue}>Rp {(processedData.grandTotal ?? 0).toLocaleString('id-ID')}</Text>
                    </View>
                )}

                {processedData.groups.length === 0 && renderEmpty()}
                <View style={{ height: 100 }} />
            </ScrollView>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                renderItem={renderItem}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleFlatRefresh}
                        colors={[Colors.bgOrange]}
                    />
                }
            />
        </View>
    )
}

export default ReportTimelineList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        paddingBottom: 100,
    },
    groupContainer: {
        marginBottom: 25,
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    groupHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 12,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.whiteDark,
    },
    groupTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.black,
    },
    groupDate: {
        fontSize: 14,
        color: Colors.grey,
    },
    subtotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: Colors.whiteDark,
        borderTopStyle: 'dashed',
    },
    subtotalLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.grey,
    },
    subtotalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.black,
    },
    grandTotalContainer: {
        backgroundColor: Colors.bgOrange,
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 30,
        elevation: 5,
    },
    grandTotalLabel: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 5,
    },
    grandTotalValue: {
        color: Colors.white,
        fontSize: 24,
        fontWeight: 'bold',
    },
});
