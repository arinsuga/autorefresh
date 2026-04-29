import { ComponentProps } from "react";
import {
    View,
    TextInput,
} from "react-native";

import FormStyles from '@/constants/FormStyles';

import FieldTextInputProps from "@/props/FieldTextInputProps";

export const FieldTextInput = (props: FieldTextInputProps) => {

    return (
        <View style={ [ FormStyles.inputGroup, { marginBottom: 30 } ] }>

          <TextInput
            placeholder={ props.placeholder }
            placeholderTextColor={ props.placeholderTextColor }
            secureTextEntry={ props.secureTextEntry }
            onChangeText={ (nextText) => props.onChangeText && props.onChangeText(nextText) }
            onFocus={props.onFocus}
            onBlur={props.onBlur}
            style={ [ FormStyles.textInput, props.style && props.style ] }
          ></TextInput>

        </View>
    );
}

export default FieldTextInput;
