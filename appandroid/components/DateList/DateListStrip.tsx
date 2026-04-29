import React, { useState, useEffect } from 'react'
import { Dimensions, View } from 'react-native'

//Packages
import CalendarStrip from 'react-native-calendar-strip'
import moment from 'moment';

//Constants
import { Colors } from '@/constants/Colors';

const DateListStrip = () => {
    const [selectedDate, setSelectedDate] = useState(moment());

    return (
        <View style={{ width: Dimensions.get('screen').width, minHeight: 57}}>
           <CalendarStrip
                style={{height: 90}}
                calendarHeaderStyle={{color: Colors.black, display: 'none'}}
                calendarColor={Colors.white}
                dateNumberStyle={{color: Colors.black, padding: 10}}
                dateNameStyle={{color: Colors.black}}
                highlightDateNumberStyle={{color: Colors.white, backgroundColor: Colors.orange}}
                highlightDateNameStyle={{color: Colors.white, backgroundColor: Colors.orange}}
                disabledDateNameStyle={{color: Colors.grey}}
                disabledDateNumberStyle={{color: Colors.grey}}
                selectedDate={selectedDate}
                onDateSelected={date => setSelectedDate(date)}
                iconContainer={{flex: 0.1}}
            />
        </View>
    )
}

export default DateListStrip;
