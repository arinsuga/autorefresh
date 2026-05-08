import React, {
  useState
} from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

//Packages
import moment from "moment";
import RNDateTimePicker from '@react-native-community/datetimepicker';

//Constants
import Dates from "@/constants/Dates";
import { Colors } from "@/constants/Colors";
import Icon from "../Icon/Icon";

type FieldProps = {
    label: string,
    currentValue: string,
    onChangeText: (nexttext: string) => void;
}

export const FieldDateRange = ({label, currentValue, onChangeText}: FieldProps) => {
  const [dateValue, setDateValue] = useState<string>(currentValue);
  const [showDatePicker, setShowDatePicker] = useState(false);  

  const handleGetDate = () => {
    setShowDatePicker(true);
  }

  const formattedValue = moment(dateValue).isValid() 
    ? moment(dateValue).format(Dates.format.date) 
    : dateValue;

  return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => handleGetDate()}>
                {label ? <View><Text style={styles.label}>{ label } : </Text></View> : null}
                <View style={styles.inputWrapper}>
                  <Text style={styles.textValue}>
                    {formattedValue || Dates.format.date}
                  </Text>
                </View>
                <View>
                  <Icon.Date size={22} color={Colors.bgOrange} />
                </View>
        </TouchableOpacity>

        {
            showDatePicker &&
            <RNDateTimePicker
              value={moment(dateValue).isValid() ? moment(dateValue).toDate() : new Date()}
              display="default"
              mode='date'
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  const selectedDateValue = moment(selectedDate).format(Dates.format.isoDate);
                  setDateValue(selectedDateValue);
                  onChangeText(selectedDateValue);
                }
              }}
            />
        }
      </View>
    );
}

export default FieldDateRange;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 10,
    },
    touchable: {
        flexDirection: 'row',
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: Colors.greyLight,
        paddingVertical: 8,
    },
    label: {
        fontSize: 14,
        color: Colors.grey,
    },
    inputWrapper: {
        flex: 1,
    },
    textValue: {
        fontSize: 15,
        color: Colors.black,
    },
});