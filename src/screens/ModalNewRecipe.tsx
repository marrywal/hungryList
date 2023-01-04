import { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleProp, StyleSheet, TextInput, TouchableWithoutFeedback, ViewStyle } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyledButtonGroup, StyledTextInput, Text, View } from '../components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
import useColorScheme from '../hooks/useColorScheme';
import { Colors } from "../constants/Colors";
import React from 'react';
import { _Category, _Ingredient, _PrepStep, _Recipe, _RecipeList } from '../constants/interfaces';
import { useHeaderHeight } from '@react-navigation/elements';
import { StyledSwipeable } from '../components/StyledSwipeable';
import { useNavigation } from '@react-navigation/native'

export default function ModalNewRecipe({ navigation }: { navigation: any }) {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [allIngredients, setAllIngedients] = useState<_Ingredient[]>([]);
  const [allPrepSteps, setAllPrepSteps] = useState<_PrepStep[]>([]);
  const [personCount, setPersonCount] = useState<number>(2);
  const [newRecipe, setNewRecipe] = useState<_Recipe>({
    title: '',
    personCount: 0,
    duration: '',
    category: 'Hauptspeise',
    ingredients: [],
    prepSteps: [],
  });
  const scheme = useColorScheme();
  const headerHeight = useHeaderHeight();
  const nav = useNavigation();

  // const refDuration = React.useRef<TextInput | null>(null);

  useEffect(() => {
    nav.setOptions({
      headerRight: () => <Pressable
        onPress={saveNewItem}
        style={({ pressed }) => ({
          opacity: pressed || newRecipe.title === '' ? 0.5 : 1,
        })}>
        <MaterialIcons
          name="check"
          size={32}
          color={Colors[scheme].textOnTint}
        />
      </Pressable>,
      headerLeft: () => <Pressable
      onPress={() => navigation.navigate('Recipes')}
      style={({ pressed }) => ({
        opacity: pressed ? 0.5 : 1,
      })}>
      <MaterialIcons
        name="close"
        size={32}
        color={Colors[scheme].textOnTint}
      />
    </Pressable>,
    });
  });

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
      flexDirection: 'row',
      alignItems: 'center'
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
    secondaryText: {
      color: Colors[scheme].secondaryText,
      width: 18,
      textAlign: 'right'
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

  const renderButton = (onClick: () => void, icon: any, buttonStyle: StyleProp<ViewStyle>, buttonText?: string, spacingRight = false) => {
    return <Pressable
      onPress={onClick}
      style={({ pressed }) => ({
        marginRight: spacingRight ? 15 : 0,
        backgroundColor: pressed
          ? Colors[scheme].tintBackground
          : Colors[scheme].background
      })}>
      <View style={buttonStyle}>
        <MaterialIcons name={icon} size={20} color={Colors[scheme].tint} />
        {buttonText ? <Text> {buttonText}</Text> : null}
      </View>
    </Pressable>
  }

  const selectCategory = (value: number) => {
    setSelectedIndex(value);

    const categories: _Category[] = ["Vorspeise", "Hauptspeise", "Nachspeise", "Getränk", "Snack"];
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
    const recipe = { ...newRecipe };

    if (recipe.title === '') {
      return;
    }

    const title = newRecipe.title.charAt(0).toUpperCase() + newRecipe.title.slice(1);
    recipe.title = title;
    recipe.personCount = personCount;
    recipe.ingredients = allIngredients;
    recipe.prepSteps = allPrepSteps;

    const itemsString = await AsyncStorage.getItem('@recipeList');
    const allItems = itemsString ? JSON.parse(itemsString) : [];

    allItems.forEach((list: _RecipeList) => {
      if (list.categoryName.includes(newRecipe.category)) {
        list.data.push(recipe)
      }
    });

    AsyncStorage.setItem('@recipeList', JSON.stringify(allItems));

    navigation.navigate('Recipes');

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

  const countPersonUp = () => {
    setPersonCount(personCount + 1);
  }

  const countPersonDown = () => {
    if (personCount === 1) {
      return;
    }
    setPersonCount(personCount - 1);
  }

  return (<>
    <ScrollView>
      <KeyboardAvoidingView
        keyboardVerticalOffset={headerHeight}
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ paddingBottom: 25 }}>
            <View style={styles.container}>
              <StyledTextInput
                value={newRecipe.title}
                style={styles.input}
                onChangeText={text => setNewRecipe({ ...newRecipe, title: text })}
                placeholder="Titel"
                autoFocus={true}
              // onSubmitEditing={() => refDuration.current?.focus()}
              />
              <View style={styles.inputBox2}>
                <View style={{ ...styles.input60, ...styles.inputBox2, marginBottom: 20 }}>
                  {renderButton(countPersonDown, 'remove-circle', styles.itemButton)}
                  <Text style={styles.secondaryText}>{personCount}</Text>
                  <MaterialIcons name='people' size={26} color={Colors[scheme].secondaryText} />
                  {renderButton(countPersonUp, 'add-circle', styles.itemButton, '', true)}
                </View>
                <View style={styles.input40}>
                  <StyledTextInput
                    value={newRecipe.duration}
                    style={styles.input}
                    onChangeText={text => setNewRecipe({ ...newRecipe, duration: text })}
                    placeholder="Zeitaufwand"
                  // ref={refDuration}
                  // onSubmitEditing={() => refDuration.current?.focus()}
                  />
                </View>
              </View>
              <View>
                <StyledButtonGroup
                  buttons={['Vorspeise', 'Hauptspeise', 'Nachspeise', 'Getränk', 'Snack']}
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
                      // ref={refDuration}
                      // onSubmitEditing={() => refDuration.current?.focus()}
                      />
                    </View>
                  </View>
                </View>
              </StyledSwipeable>
            })}

            {renderButton(addNewIngredient, 'add-circle', styles.itemButton, 'Zutat hinzufügen')}


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

            {renderButton(addNewPrepStep, 'add-circle', styles.itemButton, 'Schritt hinzufügen')}





          </View>
        </TouchableWithoutFeedback >
      </KeyboardAvoidingView>
    </ScrollView>

    <View style={styles.inputContainer}>
      <Pressable
        disabled={newRecipe.title === ''}
        onPress={saveNewItem}
        style={({ pressed }) => ({
          opacity: pressed || newRecipe.title === '' ? 0.5 : 1,
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
