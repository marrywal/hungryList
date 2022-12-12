import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Platform, StyleSheet, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View } from '../components/Themed';
import { MaterialIcons } from '@expo/vector-icons';

export default function ModalAddToList() {
  const [newItem, setNewItem] = useState('');
  const [oldNewItem, setOldNewItem] = useState('');

  const saveNewItem = async () => {
    let allItems = [];

    try {
      const itemsString = await AsyncStorage.getItem('@shoppingList');
      allItems = itemsString ? JSON.parse(itemsString) : [];
    } catch (error) {
      console.log(error);
    }

    allItems[0].data.push({
      title: newItem,
      count: ''
    });

    AsyncStorage.setItem('@shoppingList', JSON.stringify(allItems));

    setOldNewItem(newItem);
    setNewItem('');
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
        blurOnSubmit={false}
        onSubmitEditing={saveNewItem}
      />

      {/* TODO: add autocomplete for items, maybe with icons */}
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <Text style={styles.popupText}>
        <MaterialIcons
          name='check'
          size={20}
        />
        <Text>{oldNewItem} wurde hinzugefügt</Text>
      </Text>

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
  popupText: {
    marginTop: 15,
    display: 'flex',
    justifyContent: 'center',
  }
});
