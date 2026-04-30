import { useState } from "react";
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
} from "react-native";

import { Colors } from "@/constants/Colors";
import Icon from "../Icon/Icon";

type FieldUserNameProps = {
    onChangeText: (nexttext: string) => void;
}

export const FieldPassword = ({onChangeText}: FieldUserNameProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={ [ styles.textInputGroup, { marginBottom: 30 } ] }>

          <Icon.Key size={20} color={Colors.greyLight} style={styles.inputIcon} />
          <TextInput
            placeholderTextColor={ Colors.grey }
            secureTextEntry={ !showPassword }
            placeholder="Password"
            style={ styles.textInput }
            onChangeText={ (nextText) => onChangeText(nextText) }
          ></TextInput>

          <TouchableOpacity 
            style={styles.toggleIcon} 
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}
          >
            {showPassword ? (
              <Icon.EyeOff size={20} color={Colors.greyLight} />
            ) : (
              <Icon.Eye size={20} color={Colors.greyLight} />
            )}
          </TouchableOpacity>

        </View>
    );
}

export default FieldPassword;

const styles = StyleSheet.create({

  
  
    
    inputIcon: {
  
      position: "absolute",
      bottom: 10
  
    },
  
    textInputGroup: {
      borderBottomWidth: 1,
      borderBottomColor: Colors.greyLight,
      marginBottom: 5,
      width: '75%'
    },
  
    textInput: {
  
      fontSize: 17,
      color: Colors.black,
      paddingLeft: 30,
      paddingTop: 30,
  
    },
  
    toggleIcon: {
      position: "absolute",
      right: 0,
      bottom: 10,
      padding: 5,
    },

  });