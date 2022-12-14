import { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyledButtonGroup, StyledTextInput, Text, View } from '../components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
import useColorScheme from '../hooks/useColorScheme';
import { Colors } from "../constants/Colors";
import React from 'react';
import { _Category, _Recipe } from '../constants/interfaces';
import { useHeaderHeight } from '@react-navigation/elements';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ModalNewRecipe() {
  const newIngredient = {
    name: '',
    amount: '',
    unit: ''
  }
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [newRecipe, setNewRecipe] = useState<_Recipe>({
    title: '',
    duration: '',
    category: 'Snack',
    ingredients: [{
      name: '',
      amount: '',
      unit: ''
    }],
  });
  const scheme = useColorScheme();
  const headerHeight = useHeaderHeight();

  // const refDuration = React.useRef<TextInput | null>(null);

  const styles = StyleSheet.create({
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
      backgroundColor: Colors[scheme].background,
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
    input: {
      marginBottom: 20
    },
    saveButton: {
      backgroundColor: Colors[scheme].tint,
      borderRadius: 10,
      height: 45,
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 35,
      paddingHorizontal: 25,
    },
    saveButtonText: {
      color: Colors[scheme].textOnTint,
      fontSize: 16,
      marginLeft: 5,
      fontWeight: 'bold',
    },
    inputContainer: {
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderTopWidth: 0.25,
      borderTopColor: Colors[scheme].border,
      backgroundColor: Colors[scheme].background,
      display: 'flex',
      flexDirection: 'row',
    },
  });

  const selectCategory = (value: number) => {
    setSelectedIndex(value);

    const categories: _Category[] = ["Snack", "Vorspeise", "Hauptspeise", "Nachspeise", "Getränk"];
    setNewRecipe({ ...newRecipe, category: categories[value] });
  }

  const addNewIngredient = () => {
    console.log(newRecipe)
    let allIngredients = [...newRecipe.ingredients];

    allIngredients.push({ ...newIngredient });

    setNewRecipe({ ...newRecipe, ingredients: allIngredients });

    console.log(newRecipe)
  }

  const addNewPreparationStep = () => {
    console.log('new step')
  }

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

  return (<>
    <ScrollView>
    <KeyboardAvoidingView
      keyboardVerticalOffset={headerHeight}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ paddingBottom: 25 }}>
          <View style={styles.container}>
            <StyledTextInput
              value={newRecipe.title}
              style={styles.input}
              onChangeText={text => setNewRecipe({ ...newRecipe, title: text })}
              placeholder="Titel"
              keyboardType="default"
              autoComplete='off'
              clearButtonMode='while-editing'
              enablesReturnKeyAutomatically={true}
              autoFocus={true}
              returnKeyType="next"
              blurOnSubmit={false}
            // onSubmitEditing={() => refDuration.current?.focus()}
            />

            <StyledTextInput
              value={newRecipe.duration}
              style={styles.input}
              onChangeText={text => setNewRecipe({ ...newRecipe, duration: text })}
              placeholder="Aufwand | Zeit"
              keyboardType="default"
              autoComplete='off'
              clearButtonMode='while-editing'
              enablesReturnKeyAutomatically={true}
              returnKeyType="next"
              blurOnSubmit={false}
            // ref={refDuration}
            // onSubmitEditing={() => refDuration.current?.focus()}
            />

            <View>
              <StyledButtonGroup
                buttons={['Snack', 'Vorspeise', 'Hauptspeise', 'Nachspeise', 'Getränk']}
                selectedIndex={selectedIndex}
                onPress={text => selectCategory(text)}
              />
            </View>




          </View>

          <Text style={styles.title}>Zutaten ({newRecipe.ingredients.length})</Text>


          {newRecipe.ingredients.map((ingredient, index) => {
            return <View key={index} style={{ ...styles.container, ...styles.containerSeparator }}>
              <StyledTextInput
                value={ingredient.name}
                style={styles.input}
                onChangeText={text => setNewRecipe({ ...newRecipe, ingredients: [newRecipe.ingredients[index] = { ...newRecipe.ingredients[index], name: text }] })}
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
                  <StyledTextInput
                    value={ingredient.amount}
                    style={styles.input}
                    onChangeText={text => setNewRecipe({ ...newRecipe, ingredients: [newRecipe.ingredients[index] = { ...newRecipe.ingredients[index], amount: text }] })}
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
                  <StyledTextInput
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
            onPress={addNewIngredient}
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


          <Text style={styles.title}>Zubereitung ({newRecipe.ingredients.length})</Text>


          {newRecipe.ingredients.map((ingredient, index) => {
            return <View key={index} style={{ ...styles.container, ...styles.containerSeparator }}>
              <StyledTextInput
                value={ingredient.name}
                style={styles.input}
                onChangeText={text => setNewRecipe({ ...newRecipe, ingredients: [newRecipe.ingredients[index] = { ...newRecipe.ingredients[index], name: text }] })}
                placeholder="Zubereitungsschritt"
                keyboardType="default"
                autoComplete='off'
                clearButtonMode='while-editing'
                enablesReturnKeyAutomatically={true}
                // returnKeyType="next"
                multiline={true}
                textAlignVertical="top"
                numberOfLines={3}
                // blurOnSubmit={false}
              // onSubmitEditing={() => refDuration.current?.focus()}
              />
            </View>
          })}

          <Pressable
            onPress={addNewPreparationStep}
            style={({ pressed }) => ({
              backgroundColor: pressed
                ? Colors[scheme].tintBackground
                : Colors[scheme].background
            })}>
            <View style={styles.itemButton}>
              <MaterialIcons name='add-circle' size={20} color={Colors[scheme].tint} />
              <Text> Schritt hinzufügen</Text>
            </View>
          </Pressable>



        </View>
      </TouchableWithoutFeedback >
      </KeyboardAvoidingView>
    </ScrollView>

    <View style={styles.inputContainer}>
      <Pressable
        onPress={saveNewItem}
        style={({ pressed }) => ({
          opacity: pressed ? 0.5 : 1,
          width: '100%'
        })}>
        <View style={styles.saveButton}>
          <MaterialIcons
            name="check"
            size={26}
            color={Colors[scheme].textOnTint}
          />
          <Text style={styles.saveButtonText}>Speichern</Text>
        </View>
      </Pressable>
    </View>
  </>
  );
}
