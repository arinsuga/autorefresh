import React, { useState, memo } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    LayoutChangeEvent
} from "react-native";

//Packages
import FastImage from "react-native-fast-image";

//Components
import Icon from '@/components/Icon/Icon';

//Constants
import { Colors } from "@/constants/Colors";
import Styles from '@/constants/Styles';

//Interfaces
import { ITransaction } from "@/interfaces/ITransaction";

type ReportTimelineItemProps = {
    item: ITransaction;
    onPress?: () => void;
}

const ReportTimelineItem = memo(({ item, onPress }: ReportTimelineItemProps) => {
    const [parentheight, setParentHeight] = useState(0);
    const [localShowPhoto, setLocalShowPhoto] = useState(false);

    // Visibility is now strictly local
    const isVisible = localShowPhoto;

    const onLayout = (event: LayoutChangeEvent) => {
        const { height } = event.nativeEvent.layout;
        setParentHeight(height);
    }

    const handleShowImage = () => {
        setLocalShowPhoto(!localShowPhoto);
    }

    return (
        <TouchableOpacity 
            style={[
                styles.itemContainer,
                {
                    backgroundColor: Colors.white,
                    borderTopColor: Colors.bgOrange,
                }
            ]} 
            activeOpacity={0.8}
            onPress={onPress}
        >
            <View onLayout={onLayout}>
                <View style={styles.headerRow}>
                    <View style={styles.titleGroup}>
                        <Icon.History color={Colors.bgOrange} size={20} />
                        <Text style={styles.itemTitle}>
                            {item.transaction_number || 'New Transaction'}
                        </Text>
                    </View>
                    
                    {item.transaction_photo && (
                        <TouchableOpacity 
                            style={[
                                Styles.btn,
                                styles.imageBtn
                            ]} 
                            onPress={handleShowImage}
                        >
                            <Text style={styles.imageBtnText}>
                                {isVisible ? 'Hide' : 'Photo'}
                            </Text>
                            {isVisible ? (
                                <Icon.ArrowUp color={Colors.white} size={16} />
                            ) : (
                                <Icon.ArrowDown color={Colors.white} size={16} />
                            )}
                        </TouchableOpacity>
                    )}
                </View>

                {item.transaction_photo && isVisible && (
                    <View style={styles.imageContainer}>
                        <FastImage
                            source={{ uri: item.transaction_photo, priority: FastImage.priority.normal }}
                            resizeMode={FastImage.resizeMode.contain}
                            style={{
                                width: '100%',
                                height: 200,
                                borderRadius: 5
                            }}
                        />
                    </View>
                )}

                <View style={styles.infoRow}>
                    <Icon.User color={Colors.grey} size={18} />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.infoText}>
                            {item.plate_number} - {item.vehicle_type?.vehicle_type_name}
                        </Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <Icon.Dashboard color={Colors.grey} size={18} />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.infoText}>
                            {item.transaction_services?.map(s => s.service_type?.service_type_name).join(', ')}
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
                    <View style={styles.paymentBadge}>
                        <Icon.Sync color={Colors.grey} size={14} />
                        <Text style={styles.paymentText}>{item.payment_method?.payment_method_name}</Text>
                    </View>
                    <Text style={styles.totalValue}>
                        Rp {item.net_total.toLocaleString('id-ID')}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
});

export default ReportTimelineItem;

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
    imageBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.greyDark,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    imageBtnText: {
        color: Colors.white,
        marginRight: 4,
        fontSize: 12,
    },
    imageContainer: {
        backgroundColor: Colors.greyLight,
        marginBottom: 15,
        borderRadius: 5,
        padding: 5,
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
    paymentBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.whiteDark,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 5,
        columnGap: 5,
    },
    paymentText: {
        fontSize: 12,
        color: Colors.grey,
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.bgOrange,
    },
});
