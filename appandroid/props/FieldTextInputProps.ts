import React from "react";
import { StyleProp, ViewStyle, TextInput } from "react-native";

type FieldTextInputProps =  {
    placeholder?: string,
    placeholderTextColor?: string,
    secureTextEntry?: boolean,
    onChangeText?: (nexttext: string) => void,
    onFocus?: () => void,
    onBlur?: () => void,
    style?: StyleProp<ViewStyle>,
    inputRef?: React.RefObject<TextInput>
}

export default FieldTextInputProps;