import React, { memo } from "react";
import {
    View,
    Text,
    StyleSheet,
} from "react-native";

//Components
import Icon from '@/components/Icon/Icon';

//Constants
import { Colors } from "@/constants/Colors";

interface ISummaryItem {
    branch_id: number;
    branch_name: string;
    vehicle_type_id: number;
    vehicle_type_name: string;
    payment_method_id: number;
    payment_method_name: string;
    transaction_dt: string;
    total_transactions: number;
    total_gross: number | string;
    total_discount: number | string;
    total_net: number | string;
}
interface ReportSummaryItemProps {
    item: ISummaryItem;
}

const ReportSummaryItem = memo(({ item }: ReportSummaryItemProps) => {
    return (
        <View 
            style={[
                styles.itemContainer,
                {
                    backgroundColor: Colors.white,
                    borderTopColor: Colors.blue,
                }
            ]} 
        >
            <View style={styles.headerRow}>
                <View style={styles.titleGroup}>
                    <Icon.Dashboard color={Colors.blue} size={20} />
                    <Text style={styles.itemTitle}>
                        {item.branch_name}
                    </Text>
                </View>
                <View style={styles.trxCountBadge}>
                    <Text style={styles.trxCountText}>{item.total_transactions} Trx</Text>
                </View>
            </View>

            <View style={styles.infoRow}>
                <Icon.User color={Colors.grey} size={18} />
                <View style={{ flex: 1 }}>
                    <Text style={styles.infoText}>
                        {item.vehicle_type_name}
                    </Text>
                </View>
            </View>

            <View style={styles.infoRow}>
                <Icon.Sync color={Colors.grey} size={18} />
                <View style={{ flex: 1 }}>
                    <Text style={styles.infoText}>
                        {item.payment_method_name}
                    </Text>
                </View>
            </View>

            <View style={styles.infoRow}>
                <Icon.Time color={Colors.grey} size={18} />
                <View>
                    <Text style={styles.infoText}>{item.transaction_dt}</Text>
                </View>
            </View>

            <View style={styles.footerRow}>
                <Text style={styles.totalLabel}>Total Bersih</Text>
                <Text style={styles.totalValue}>
                    Rp {Number(item.total_net ?? 0).toLocaleString('id-ID')}
                </Text>
            </View>
        </View>
    )
});

export default ReportSummaryItem;

const styles = StyleSheet.create({
    itemContainer: {
        flex: 1,
        flexDirection: 'column',
        borderTopWidth: 7,
        paddingHorizontal: 18,
        paddingTop: 15,
        paddingBottom: 15,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    titleGroup: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 8,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.black,
    },
    trxCountBadge: {
        backgroundColor: Colors.blue,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    trxCountText: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 10,
        marginBottom: 5,
    },
    infoText: {
        color: Colors.greyDark,
        fontSize: 14,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: Colors.whiteDark,
    },
    totalLabel: {
        fontSize: 14,
        color: Colors.grey,
        fontWeight: '600',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.blue,
    },
});
