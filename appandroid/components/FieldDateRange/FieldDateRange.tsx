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
    //setDateValue((prev) => prev.clone().add(1, 'days'));
    
  }

  return (
      <>
        <TouchableOpacity
          style={{
            marginBottom: 5,
            flex: 0.4,
            flexDirection: 'row',
            justifyContent: "flex-end",
            alignItems: "center",
            borderBottomWidth: 1,
            borderBottomColor: Colors.greyLight,
            width: '70%',
          }}
          onPress={() => handleGetDate()}>

                <View><Text>{ label } : </Text></View>
                <View>
                  <TextInput
                    value={dateValue}
                    placeholderTextColor={ Colors.grey }
                    secureTextEntry={ false }
                    placeholder= { Dates.format.date }
                    style={ styles.textInput }
                    onChangeText={ (nextText) => {
                      setDateValue(nextText);
                      onChangeText(nextText);
                    } }
                    editable={false}
                  ></TextInput>
                </View>
                <View style={{
                }}>
                  <Icon.Date size={25} color={Colors.orange} />
                </View>
        </TouchableOpacity>

        {
            showDatePicker &&
            <RNDateTimePicker
              value={moment(dateValue, Dates.format.date).toDate()}
              display="spinner"
              mode='date'
              positiveButton={{ label: 'OK', textColor: Colors.white }}
              negativeButton={{ label: 'Cancel', textColor: Colors.orange }}
              onChange={(event, selectedDate) => {
                const selectedDateValue = moment(selectedDate).format(Dates.format.date);
                setDateValue(selectedDateValue);
                onChangeText(selectedDateValue);
                setShowDatePicker(false);
              }}
            />
        }
        
      </>

    );
}

export default FieldDateRange;

const styles = StyleSheet.create({

  
  
    textInput: {
      fontSize: 15,
      color: Colors.black,
    },
  
  });