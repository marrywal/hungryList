import React from 'react';
import { StyleSheet, TextProps } from 'react-native';
import { NavigationColors } from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { Text } from './Themed';

interface Props extends TextProps {
  text: string,
  count?: number,
}

export function StyledHeader(props: Props) {
  const scheme = useColorScheme();
  
  const styles = StyleSheet.create({
    title: {
      fontSize: 12,
      paddingHorizontal: 10,
      paddingBottom: 5,
      paddingTop: 20,
      backgroundColor: NavigationColors[scheme].colors.background,
    },
  });

  return <Text style={styles.title}>{props.text} {props.count !== undefined ? `(${props.count})` : ''}</Text>;
}