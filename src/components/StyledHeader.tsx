import React from 'react';
import { StyleSheet, TextProps } from 'react-native';
import { Text } from './Themed';

interface Props extends TextProps {
  text: string,
  count?: number,
}

export function StyledHeader(props: Props) {
  const styles = StyleSheet.create({
    title: {
      fontSize: 12,
      marginHorizontal: 10,
      marginBottom: 5,
      marginTop: 20
    },
  });

  return <Text style={styles.title}>{props.text} {props.count !== undefined ? `(${props.count})` : ''}</Text>;
}