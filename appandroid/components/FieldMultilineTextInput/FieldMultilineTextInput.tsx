import { useRef } from "react";
import {
    View,
    TextInput,
} from "react-native";

import FormStyles from "@/constants/FormStyles";

import FieldTextInputProps from "@/props/FieldTextInputProps";

export const FieldMultilineTextInput = (props: FieldTextInputProps) => {
    const localRef = useRef<TextInput>(null);

    return (
        <View
            style={ [ FormStyles.inputGroup ] }
        >

          <TextInput
            multiline={true}
            numberOfLines={3}
            placeholder={ props.placeholder }
            placeholderTextColor={ props.placeholderTextColor }
            secureTextEntry={ props.secureTextEntry }
            onChangeText={ (nextText) => props.onChangeText && props.onChangeText(nextText) }
            onFocus={props.onFocus}
            onBlur={props.onBlur}
            textAlignVertical="bottom"
            style={ [ FormStyles.textInput, props.style && props.style ] }
            ref={props.inputRef ?? localRef}
          ></TextInput>

        </View>
    );
}

export default FieldMultilineTextInput;
