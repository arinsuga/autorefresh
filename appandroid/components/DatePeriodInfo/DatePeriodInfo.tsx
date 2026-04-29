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
import Dates from '@/constants/Dates';
import { Colors } from '@/constants/Colors';

interface IDateInfoProps {
    dateFrom: string,
    dateTo: string,
}

const DatePeriodInfo = ({ dateFrom, dateTo }: IDateInfoProps) => {

    return (

          <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 8, paddingVertical: 5 }}>

            <View style={{ flexDirection:'column', alignItems: 'flex-end' }}>
              <Text style={{fontWeight: 'bold'}}>From</Text>
              <Text style={{fontWeight: 'bold'}}>To</Text>
            </View>

            <View style={{flexDirection:'column'}}>
              <Text style={{color: Colors.grey, fontWeight: 'bold'}}>{ dateFrom }</Text>
              <Text style={{color: Colors.grey, fontWeight: 'bold'}}>{ dateTo }</Text>
            </View>

          </View>

    );
};

export default DatePeriodInfo;
