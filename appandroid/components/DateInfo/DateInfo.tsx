import React, {
    useState
} from 'react';
import {
    View,
    Text,
} from 'react-native';

//Packages
import moment from 'moment';

//Constants
import { Colors } from '@/constants/Colors';

interface IDateInfoProps {
    date: moment.Moment,
    currentDate: moment.Moment,
}

const DateInfo = ({ date, currentDate }: IDateInfoProps) => {

    return (

          <View style={{flexDirection: 'row', alignItems: 'center', columnGap: 8}}>
            <Text style={{fontSize: 36, fontWeight: 'bold'}}>{ date ? date.format('DD') : 'N/A' }</Text>
            <View style={{flexDirection:'column'}}>
              <Text style={{color: Colors.grey, fontWeight: 'bold'}}>{ date.format('dddd') } { currentDate.format('YYYY-MM-DD') === date.format('YYYY-MM-DD') ? '- Today' : '' }</Text>
              <Text style={{color: Colors.grey, fontWeight: 'bold'}}>{ date.format('MMM') } { date.format('YYYY') }</Text>
            </View>
          </View>

    );
};

export default DateInfo;
