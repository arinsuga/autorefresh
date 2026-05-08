import React from 'react'
import { FlatList, RefreshControl, View, StyleSheet } from 'react-native'
import moment from 'moment';

//Constants
import { Colors } from '@/constants/Colors';

//Interfaces
import { ITransaction } from '@/interfaces/ITransaction';

//Components
import ReportTimelineItem from './ReportTimelineItem';
import TimelineEmpty from '../TimelineList/TimelineEmpty';

interface IDatePeriod {
    dateFrom: string,
    dateTo: string
}

interface IReportListProps {
    data: ITransaction[];
    date: moment.Moment;
    datePeriod: IDatePeriod;
    isViewMode: boolean;
    isRefreshing: boolean;
    onRefresh: (isViewMode: boolean, date: moment.Moment, dateFrom?: string, dateTo?: string) => Promise<void>;
    onItemPress?: (item: ITransaction) => void;
}

const ReportTimelineList = ({ 
    data, 
    date, 
    datePeriod, 
    isViewMode = false, 
    isRefreshing = false, 
    onRefresh,
    onItemPress
}: IReportListProps) => {

    const handleFlatRefresh = () => {
        onRefresh(isViewMode, date, datePeriod?.dateFrom, datePeriod?.dateTo);
    }

    const renderItem = ({ item }: { item: ITransaction }) => (
        <ReportTimelineItem 
            item={item} 
            onPress={() => onItemPress && onItemPress(item)} 
        />
    );

    const renderEmpty = () => (
        <TimelineEmpty isRefreshing={isRefreshing} emptyText='No transactions found.' />
    );
    
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
    }
});
