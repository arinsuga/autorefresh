import React, { useState, useEffect } from 'react'
import { Dimensions, View } from 'react-native'

//Packages
import CalendarStrip from 'react-native-calendar-strip'
import moment from 'moment';
import 'moment/locale/id';

//Constants
import { Colors } from '@/constants/Colors';

const DateList = React.memo((
    {
        date,
        onSelectedDate
    }:
    {
        date: moment.Moment,
        onSelectedDate: (date: moment.Moment) => void
    }) => {
    const [currentDate, setCurrentDate] = useState(date);
    const [selectedDate, setSelectedDate] = useState(currentDate.clone());

    useEffect(() => {
        setSelectedDate(date);
    }, [date]);


    const handleSelectedDate = async (date: moment.Moment) => {

        setSelectedDate(date);
        onSelectedDate(date);
        
    }

    return (
        <View style={{ width: Dimensions.get('screen').width, minHeight: 57}}>
           <CalendarStrip
                    scrollable={true}
                    scrollerPaging={true}
                    startingDate={moment().startOf('week')}
                    dayComponentHeight={50}
                    dayContainerStyle={{
                        height: 50,
                        borderRadius: 0,
                        alignItems: 'center'
                    }}
                    calendarAnimation={{type: 'sequence', duration: 0}}
                    daySelectionAnimation={{type: 'background', duration: 0, highlightColor: Colors.orange }}
                    style={{height: 100, paddingTop: 10, paddingBottom: 10}}
                    calendarHeaderStyle={{color: Colors.black}}
                    calendarColor={Colors.white}
                    dateNumberStyle={ { color: Colors.black }}
                    dateNameStyle={{color: Colors.black}}
                    highlightDateNumberStyle={{ color: Colors.white }}
                    highlightDateNameStyle={{color: Colors.white}}
                    disabledDateNameStyle={{color: Colors.grey}}
                    disabledDateNumberStyle={{color: Colors.grey}}
                    iconContainer={{flex: 0.1}}
                    onDateSelected={date => handleSelectedDate(date)}
                    selectedDate={selectedDate}
            />
        </View>
    )
});

export default DateList;
