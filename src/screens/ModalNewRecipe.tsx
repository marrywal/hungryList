import { StatusBar } from 'expo-status-bar';
import { ReactNode, useState } from 'react';
import { Button, Keyboard, Platform, Pressable, SafeAreaView, StyleSheet, TextInput, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View } from '../components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
import useColorScheme from '../hooks/useColorScheme';
import { Colors } from "../constants/Colors";
import React from 'react';

interface _Ingredients {
  name: string,
  amount: string,
  unit: string
}

interface _Recipe {
  title: string,
  duration: string,
  ingredients: _Ingredients[],
}

export default function ModalNewRecipe() {
  const [newRecipe, setNewRecipe] = useState<_Recipe>({
    title: '',
    duration: '',
    ingredients: [{
      name: '',
      amount: '',
      unit: ''
    }],
  });
  const scheme = useColorScheme();

  const refName = React.useRef<any>(null)
  const refDuration = React.useRef<TextInput | null>(null);

  const styles = StyleSheet.create({
    input: {
      backgroundColor: Colors[scheme].input,
      paddingVertical: 9,
      paddingHorizontal: 13,
      marginBottom: 20,
      fontSize: 15,
      borderRadius: 8,
    },
    input60: {
      width: '60%',
    },
    input40: {
      width: '40%',
    },
    inputBox2: {
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'row'
    },
    container: {
      paddingTop: 20,
      paddingHorizontal: 15,
      backgroundColor: Colors[scheme].background
    },
    containerSeparator: {
      borderBottomColor: Colors[scheme].input,
      borderBottomWidth: 1
    },
    title: {
      fontSize: 12,
      marginHorizontal: 10,
      marginBottom: 5,
      marginTop: 20
    },
    separator: {
      height: 1,
      width: '100%',
      backgroundColor: Colors[scheme].border
    },
    itemButton: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: 15,
      paddingVertical: 10,
    },
  });

  const saveNewItem = async () => {
    // let allItems = [];

    // try {
    //   const itemsString = await AsyncStorage.getItem('@shoppingList');
    //   allItems = itemsString ? JSON.parse(itemsString) : [];
    // } catch (error) {
    //   console.log(error);
    // }

    // allItems[0].data.push({
    //   title: newItem,
    //   count: ''
    // });

    // AsyncStorage.setItem('@shoppingList', JSON.stringify(allItems));

    // setNewItem('');
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView>
        <View style={styles.container}>
          <TextInput
            value={newRecipe.title}
            onChangeText={text => setNewRecipe({ ...newRecipe, title: text })}
            style={styles.input}
            placeholder="Titel"
            keyboardType="default"
            autoComplete='off'
            clearButtonMode='while-editing'
            enablesReturnKeyAutomatically={true}
            autoFocus={true}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => refDuration.current?.focus()}
          />

          <TextInput
            value={newRecipe.duration}
            onChangeText={text => setNewRecipe({ ...newRecipe, duration: text })}
            style={styles.input}
            placeholder="Aufwand | Zeit"
            keyboardType="default"
            autoComplete='off'
            clearButtonMode='while-editing'
            enablesReturnKeyAutomatically={true}
            returnKeyType="next"
            blurOnSubmit={false}
            ref={refDuration}
          // onSubmitEditing={() => refDuration.current?.focus()}
          />

        </View>

        <Text style={styles.title}>Zutaten</Text>


        {newRecipe.ingredients.map((ingredient, index) => {
          return <View key={index} style={{ ...styles.container, ...styles.containerSeparator }}>
            <TextInput
              value={ingredient.name}
              onChangeText={text => setNewRecipe({ ...newRecipe, ingredients: [newRecipe.ingredients[index] = { ...newRecipe.ingredients[index], name: text }] })}
              style={styles.input}
              placeholder="Zutat"
              keyboardType="default"
              autoComplete='off'
              clearButtonMode='while-editing'
              enablesReturnKeyAutomatically={true}
              returnKeyType="next"
              blurOnSubmit={false}
            // onSubmitEditing={() => refDuration.current?.focus()}
            />

            <View style={styles.inputBox2}>
              <View style={styles.input60}>
                <TextInput
                  value={ingredient.amount}
                  onChangeText={text => setNewRecipe({ ...newRecipe, ingredients: [newRecipe.ingredients[index] = { ...newRecipe.ingredients[index], amount: text }] })}
                  style={styles.input}
                  placeholder="Menge"
                  keyboardType="numeric"
                  autoComplete='off'
                  clearButtonMode='while-editing'
                  enablesReturnKeyAutomatically={true}
                  returnKeyType="next"
                  blurOnSubmit={false}
                // ref={refDuration}
                // onSubmitEditing={() => refDuration.current?.focus()}
                />
              </View>
              <View style={styles.input40}>
                <TextInput
                  value={ingredient.unit}
                  onChangeText={text => setNewRecipe({ ...newRecipe, ingredients: [newRecipe.ingredients[index] = { ...newRecipe.ingredients[index], unit: text }] })}
                  style={{ ...styles.input, marginLeft: 15 }}
                  placeholder="Einheit"
                  keyboardType="default"
                  autoComplete='off'
                  clearButtonMode='while-editing'
                  enablesReturnKeyAutomatically={true}
                  returnKeyType="next"
                  blurOnSubmit={false}
                // ref={refDuration}
                // onSubmitEditing={() => refDuration.current?.focus()}
                />
              </View>
            </View>
          </View>
        })}

        <Pressable
          // onPress={() => onItemClick(item)}
          style={({ pressed }) => ({
            backgroundColor: pressed
              ? Colors[scheme].tintBackground
              : Colors[scheme].background
          })}>
          <View style={styles.itemButton}>
            <MaterialIcons name='add-circle' size={20} color={Colors[scheme].tint} />
            <Text> Zutat hinzufügen</Text>
          </View>
        </Pressable>








        {/* <View style={styles.separator} /> */}

        {/* Use a light status bar on iOS to account for the black space above the modal */}
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </SafeAreaView>

    </TouchableWithoutFeedback>
  );
}
