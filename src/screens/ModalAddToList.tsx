import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Platform, StyleSheet, TextInput } from 'react-native';

import { View } from '../components/Themed';

export default function ModalAddToList() {
  const [newItem, setNewItem] = useState('');

  const saveNewItem = () => {
    console.log(newItem) // TODO: save item
  }

  return (
    <View style={styles.container}>
      <TextInput
        value={newItem}
        onChangeText={text => setNewItem(text)}
        style={styles.input}
        placeholder="Was brauchst du?"
        keyboardType="default"
        autoComplete='off'
        clearButtonMode='while-editing'
        enablesReturnKeyAutomatically={true}
        autoFocus={true}
        onSubmitEditing={saveNewItem}
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
