import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, TextInput } from 'react-native';

import { Text, View } from '../components/Themed';

export default function ModalAddToList() {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Was brauchst du?"
        keyboardType="default"
        autoComplete='off'
        clearButtonMode='while-editing'
        enablesReturnKeyAutomatically={true}
        onKeyPress={({ nativeEvent: { key: keyValue } }) => {
          if (keyValue === 'enter') {
            console.log('save item'); // TODO: save item
          }
        }}
      />

      {/* TODO: add autocomplete for items, maybe with icons */}
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    backgroundColor: '#eee',
    paddingVertical: 9,
    paddingHorizontal: 13,
    fontSize: 15,
    borderRadius: 8,
  },
  container: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginTop: 20,
    height: 1,
    width: '100%',
  },
});
