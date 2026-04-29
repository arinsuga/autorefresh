import { StyleSheet } from "react-native"

import { Colors } from "./Colors";

const FormStyles = StyleSheet.create({
    inputGroup: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.greyLight,
    },
    
    textInput: {
    
        fontSize: 17,
        color: Colors.black,
        paddingLeft: 15,
        paddingTop: 20,
    
    },
  
});

export default FormStyles;