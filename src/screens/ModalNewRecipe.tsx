import { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyledButtonGroup, StyledTextInput, Text, View } from '../components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
import useColorScheme from '../hooks/useColorScheme';
import { Colors } from "../constants/Colors";
import React from 'react';
import { _Category, _Ingredients, _PrepSteps, _Recipe } from '../constants/interfaces';
import { useHeaderHeight } from '@react-navigation/elements';
import { StyledSwipeable } from '../components/StyledSwipeable';

export default function ModalNewRecipe() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [allIngredients, setAllIngedients] = useState<_Ingredients[]>([]);
  const [allPrepSteps, setAllPrepSteps] = useState<_PrepSteps[]>([]);
  const [newRecipe, setNewRecipe] = useState<_Recipe>({
    title: '',
    duration: '',
    category: 'Snack',
    ingredients: [],
    prepSteps: [],
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
    inputMultiline: {
      minHeight: 55,
      maxHeight: 90,
      paddingTop: 9,
      color: Colors[scheme].text
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

  const editIngredient = (value: string, index: number, field: 'name' | 'amount' | 'unit') => {
    let ingred = [...allIngredients];
    ingred[index][field] = value;

    setAllIngedients(ingred);
  }

  const editPrepSteps = (value: string, index: number) => {
    let preps = [...allPrepSteps];
    preps[index].step = value;

    setAllPrepSteps(preps);
  }

  const addNewIngredient = () => {
    const ingred = [...allIngredients];
    const lastObj = ingred.slice(-1);
    const lastKey = lastObj[0]?.key;

    const newKey = lastKey ? lastKey + 1 : 1;

    const newIngred = {
      key: newKey,
      name: '',
      amount: '',
      unit: ''
    }

    ingred.push(newIngred);
    setAllIngedients(ingred);
  }

  const addNewPrepStep = () => {
    const preps = [...allPrepSteps];
    const lastObj = preps.slice(-1);
    const lastKey = lastObj[0]?.key;

    const newKey = lastKey ? lastKey + 1 : 1;

    const newPrep = {
      key: newKey,
      step: ''
    }

    preps.push(newPrep);
    setAllPrepSteps(preps);
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


  const deleteIngredientsRow = (index: number) => {
    const ingred = [...allIngredients];
    ingred.splice(index, 1);
    setAllIngedients(ingred);
  };

  const deletePrepStepsRow = (index: number) => {
    const preps = [...allPrepSteps];
    preps.splice(index, 1);
    setAllPrepSteps(preps);
  };

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


            <Text style={styles.title}>Zutaten ({allIngredients.length})</Text>

            {allIngredients.map((ingredient, index) => {
              return <StyledSwipeable
                deleteRow={() => deleteIngredientsRow(index)}
                key={ingredient.key}
              >
                <View key={index} style={{ ...styles.container, ...styles.containerSeparator }}>
                  <StyledTextInput
                    value={ingredient.name}
                    style={styles.input}
                    onChangeText={text => editIngredient(text, index, 'name')}
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
                        onChangeText={text => editIngredient(text, index, 'amount')}
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
                        onChangeText={text => editIngredient(text, index, 'unit')}
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
              </StyledSwipeable>
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


            <Text style={styles.title}>Zubereitung ({allPrepSteps.length})</Text>

            {allPrepSteps.map((prep, index) => {
              return <StyledSwipeable
                deleteRow={() => deletePrepStepsRow(index)}
                key={prep.key}
              >
                <View key={index} style={{ ...styles.container, ...styles.containerSeparator }}>
                  <StyledTextInput
                    value={prep.step}
                    style={{ ...styles.input, ...styles.inputMultiline }}
                    onChangeText={text => editPrepSteps(text, index)}
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
              </StyledSwipeable>
            })}

            <Pressable
              onPress={addNewPrepStep}
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
