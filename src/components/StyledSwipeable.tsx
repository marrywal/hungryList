import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet } from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import { SwipeableProps } from 'react-native-gesture-handler/lib/typescript/components/Swipeable';
import { Colors } from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { View } from '../components/Themed';

interface Props extends SwipeableProps {
  deleteRow?: () => void
}

export function StyledSwipeable(props: Props) {
  const { deleteRow, ...otherProps } = props;
  const scheme = useColorScheme();

  const styles = StyleSheet.create({
    rightAction: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    }
  });

  const renderRightActions = () => (
    <View style={{ width: 80, flexDirection: 'row' }}>
      <View style={{ flex: 1, transform: [{ translateX: 0 }] }
      }>
        <RectButton
          style={[styles.rightAction, { backgroundColor: Colors[scheme].error }]}
          onPress={deleteRow} 
          >
          <MaterialIcons name='cancel' size={24} color={Colors[scheme].textOnTint} />
        </RectButton>
      </View>
    </View>
  );

  return <Swipeable
    renderRightActions={renderRightActions}
    friction={2}
    rightThreshold={10}
    {...otherProps} />;
}