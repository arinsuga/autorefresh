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
import ITimeLine from "@/interfaces/ITimeLine";

type TimelineItemProps = {
    item: ITimeLine
}
const TimelineItem = memo(({item}: TimelineItemProps) => {
    const [parentheight, setParentHeight] = useState(0);
    const [isShowImage, setIsShowImage] = useState(false);


    const color = () => {
        return {
            bg: Colors.grey,
            text: Colors.greyDark,
            icon: Colors.greyDark,
            type: Colors.greyDark,
            border: Colors.greyDark,
        }
    }

    const onLayout = (event: LayoutChangeEvent) => {
        const { height } = event.nativeEvent.layout;
        setParentHeight(height);
    }

    const handleShowImage = () => {
        setIsShowImage(!isShowImage);
    }   

    return (
        <TouchableOpacity style={[
            styles.itemContainer,
            {
                backgroundColor: Colors.grey,
                borderTopColor: item.type == 'Checkin' ? Colors.success : Colors.danger,
            }
        ]} activeOpacity={0.8}>
            <View onLayout={onLayout} >
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: 15,
                }}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        columnGap: 5,
                    }}>
                        {
                            item.type == 'Checkin' ?
                            <Icon.Checkin color={Colors.greyDark} size={20} /> :
                            <Icon.Checkout color={Colors.greyDark} size={20} />
                        }
                        <Text style={[styles.itemTitle, { color: color()?.text }]}>
                            { item.type == 'Checkin' ? 'Check-in' : 'Check-out' }
                        </Text>
                    </View>
                    <TouchableOpacity style={[
                        Styles.btn,
                        {
                            flex: .6,
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            backgroundColor: Colors.greyLight,
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                        }
                    ]} onPress={ () => handleShowImage() }>


                        <Text style={ [
                            Styles.btnText,
                            {
                                color: Colors.white,
                                marginRight: 5,
                            }
                        ] }>
                            { isShowImage ? 'Hide Image' : 'Show Image' }
                        </Text>
                        {
                            isShowImage ?
                            <Icon.ArrowUp color={item.type == 'Checkin' ? Colors.white : Colors.white} size={18}/>
                            :
                            <Icon.ArrowDown color={item.type == 'Checkin' ? Colors.white : Colors.white} size={18}/>

                        }
                        

                    </TouchableOpacity>
                    
                </View>

                {
                    item.image && isShowImage &&
                    <View style={{
                        flex: 1,
                        flexWrap: 'wrap',
                        backgroundColor: Colors.greyLight,
                        marginBottom: 15,
                        borderRadius: 5,
                        paddingHorizontal: 10,
                    }}>
                        <FastImage
                            source={{ uri: item.image, priority: FastImage.priority.normal }}
                            resizeMode={ FastImage.resizeMode.contain }
                            style={{
                                width: '100%',
                                height: item.image  ? parentheight/2 : 0,
                                borderRadius: 5
                            }}
                        />
                    </View>
                }


                <View style={styles.item}>
                    <Icon.Date color={color()?.icon} size={18}/>
                    <View>
                        <Text style={{ color: color()?.text }}>{item.date}</Text>
                    </View>
                </View>
                <View style={styles.item}>
                    <Icon.Time color={color()?.icon} size={18}/>
                    <View>
                        <Text style={{ color: color()?.text }}>{item.time}</Text>
                    </View>
                </View>
                <View style={styles.item}>
                    <Icon.Note color={color()?.icon} size={18}/>
                    <View style={{ flex: 1, }}>
                        <Text style={{ color: color()?.text }}>{item.description}</Text>
                    </View>
                </View>

                <View style={styles.item}>
                    <Icon.Location color={color()?.icon} size={18}/>
                    <View style={{ flex: 1, }}>
                        <Text style={{ color: color()?.text, overflow: 'scroll' }}>{item.address}</Text>
                    </View>
                </View>

                {/* <CachedImage
                    source={{ uri: item.image }}
                    cacheKey={item.id}
                    style={{
                        width: '100%',
                        height: parentheight/2,
                        marginTop: 10,
                    }}
                /> */}


            </View>
        </TouchableOpacity>
    )
});

export default TimelineItem;

const styles = StyleSheet.create({
    itemContainer: {
        flex:1,
        flexDirection: 'column',
        borderTopWidth: 7,
        paddingHorizontal: 18,
        paddingTop: 18,
        paddingBottom: 20,
        marginBottom: 20
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        columnGap: 10
    },
});
