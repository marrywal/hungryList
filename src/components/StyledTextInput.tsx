import React from "react";
import { TextInputProps, TextInput } from "react-native";
import { Colors } from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";


export const StyledTextInput = React.forwardRef((props: TextInputProps, ref: React.ForwardedRef<TextInput>) => {
    const scheme = useColorScheme();
    const { style, ...otherProps } = props;

    const themedStyle = {
        backgroundColor: Colors[scheme].input,
        paddingVertical: 9,
        paddingHorizontal: 13,
        fontSize: 15,
        borderRadius: 8,
        color: Colors[scheme].text
    }

    return <TextInput
        placeholderTextColor={Colors[scheme].placeholder}
        keyboardType="default"
        autoComplete='off'
        clearButtonMode='while-editing'
        enablesReturnKeyAutomatically={true}
        blurOnSubmit={false}
        returnKeyType="next"
        ref={ref}
        style={[{ ...themedStyle }, style]}
        {...otherProps} />;
})
