import React, { useState, useRef } from 'react'
import { FlatList, RefreshControl, StyleSheet, View, Text } from 'react-native'
import moment from 'moment';

//Constats
import { Colors } from '@/constants/Colors';

//Interfaces
import ITimeLine from '@/interfaces/ITimeLine';

//Components
import TimelineItem from './TimelineItem';
import TimeLineEmpty from './TimelineEmpty';

interface IDatePeriod {
    dateFrom: string,
    dateTo: string
}

interface IDataListProps {
    data: ITimeLine[];
    date: moment.Moment;
    datePeriod: IDatePeriod;
    isViewMode: boolean;
    isRefreshing: boolean;
    onRefresh: (isViewMode: boolean, date: moment.Moment, dateFrom?: string, dateTo?: string) => Promise<void>;
}

const TimelineList = ({ data, date, datePeriod, isViewMode = false, isRefreshing = false, onRefresh }: IDataListProps) => {

    const handleFlatRefresh = (parViewMode: boolean, parDate: moment.Moment, parDatePeriod?: IDatePeriod) => {
        
        onRefresh(parViewMode, parDate, parDatePeriod?.dateFrom, parDatePeriod?.dateTo);

    }

    const MemoizedTimelineItem = React.memo(({ item }: { item: ITimeLine }) => (
        <TimelineItem item={item} />
    ));

    const renderItem = ({ item }: { item: ITimeLine }) => (
    <MemoizedTimelineItem item={item} />
    );

    const MemoizedTimelineEmpty = React.memo(({ isRefreshing }: { isRefreshing: boolean }) => (
        <TimeLineEmpty isRefreshing={isRefreshing} emptyText='Empty Data...' />
    ));

    const renderEmpty = (isRefreshing: boolean) => (
        <MemoizedTimelineEmpty isRefreshing={isRefreshing} />
    );
    
    return (
        <View>
            {
                data &&
                <FlatList
                    // ListHeaderComponent={TimelineHeader}
                    data={data}
                    keyExtractor={item => item.id}
                    renderItem={ renderItem }
                    ListEmptyComponent={ () => renderEmpty(isRefreshing) }
                    contentContainerStyle={{paddingBottom: 150}}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={() =>handleFlatRefresh(isViewMode, date, datePeriod)}
                            colors={[Colors.orange]}
                        />
                    }
                />
            }
        </View>
    )
}

export default TimelineList

const styles = StyleSheet.create({
    headerContainer: {flex: 1, flexDirection: 'row', alignItems: 'center'},
    headerTitle: {color: Colors.orange, fontWeight: 'bold'},
    timeCol: {flex:1, padding: 8, alignItems: 'center'},
    actCol: {flex:4, padding: 8, paddingLeft: 16},
    filterCol: {flex:1, paddingRight: 16, alignItems: 'flex-end'},
    itemContainer: {flexDirection: 'row'},
    itemLeft: {flex: 1, alignItems: 'center'},
    itemRight: {flex:4, paddingHorizontal: 12, paddingBottom: 20, borderLeftWidth: 3, borderLeftColor: 'white'},
    card: { backgroundColor: '#d16224', borderRadius: 10, padding: 24, rowGap: 10},
    itemTitle: {color: 'white', fontSize: 16, fontWeight: 'bold'},
    itemSubtitle: {color: 'white', fontSize: 12, fontWeight: '500'},
    wrapIcon: {flexDirection: 'row', alignItems: 'center', columnGap: 14},
});
