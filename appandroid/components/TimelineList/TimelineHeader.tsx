import React from "react";
import { View, Text, StyleSheet } from 'react-native';

//Constants
import { Colors } from '@/constants/Colors';

const TimelineHeader = () => {
    return (
        <View style={styles.headerContainer}>
            <View style={styles.timeCol}>
                <Text style={styles.headerTitle}>Time</Text>
            </View>
            <View style={styles.actCol}>
                <Text style={styles.headerTitle}>Activity</Text>
            </View>
            <View style={styles.filterCol}>
                <Text style={styles.headerTitle}></Text>
            </View>
        </View>
    )
}

export default TimelineHeader;

const styles = StyleSheet.create({

    headerContainer: {flex: 1, flexDirection: 'row', alignItems: 'center'},
    headerTitle: {color: Colors.black, fontWeight: 'bold'},
    timeCol: {flex:1, padding: 8, alignItems: 'center'},
    actCol: {flex:4, padding: 8, paddingLeft: 16},
    filterCol: {flex:1, paddingRight: 16, alignItems: 'flex-end'},

});
