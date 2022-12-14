/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { ButtonGroup, ButtonGroupProps } from '@rneui/themed';
import React from 'react';
import { Text as DefaultText, TextInput, TextInputProps, View as DefaultView } from 'react-native';

import { Colors } from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;

  return <DefaultView style={[style]} {...otherProps} />;
}

export const StyledTextInput = React.forwardRef((props: TextInputProps, ref: React.ForwardedRef<TextInput>) => {
  const scheme = useColorScheme();
  const { style, ...otherProps } = props;

  const themedStyle = {
    backgroundColor: Colors[scheme].input,
    paddingVertical: 9,
    paddingHorizontal: 13,
    fontSize: 15,
    borderRadius: 8,
  }

  return <TextInput ref={ref} style={[{ ...themedStyle }, style]} {...otherProps} />;
})

export function StyledButtonGroup(props: ButtonGroupProps) {
  const scheme = useColorScheme();
  const { ...otherProps } = props;

  const selectGroupContainer = {
    borderColor: Colors[scheme].tint,
    borderRadius: 8,
    width: '100%',
    height: 35,
    marginLeft: 0,
    marginTop: 0,
    marginBottom: 20
  }

  const selectGroupButton = {
    backgroundColor: Colors[scheme].background
  }

  const selectGroupSelectedButton = {
    backgroundColor: Colors[scheme].tint
  }

  const selectGroupInnerBorder = {
    color: Colors[scheme].tint
  }

  const selectGroupText = {
    fontSize: 10.5,
    color: Colors[scheme].text
  }

  return <ButtonGroup
    containerStyle={[selectGroupContainer]}
    buttonStyle={[selectGroupButton]}
    selectedButtonStyle={[selectGroupSelectedButton]}
    textStyle={[selectGroupText]}
    innerBorderStyle={selectGroupInnerBorder}
    {...otherProps} />;
}