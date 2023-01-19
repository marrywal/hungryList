import { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Pressable, ScrollView, StyleProp, TouchableWithoutFeedback, ViewStyle } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View } from '../components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
import useColorScheme from '../hooks/useColorScheme';
import { Colors } from "../constants/Colors";
import React from 'react';
import { _Category, _Ingredient, _PrepStep, _Recipe, _RecipeList } from '../constants/interfaces';
import { useHeaderHeight } from '@react-navigation/elements';
import { StyledSwipeable } from '../components/StyledSwipeable';
import { useNavigation } from '@react-navigation/native'
import { StyledButtonGroup } from '../components/StyledButtonGroup';
import { StyledTextInput } from '../components/StyledTextInput';
import { StyledButtonPressable } from '../components/StyledButtonPressable';
import { StyledHeader } from '../components/StyledHeader';
import { useGlobalStyles } from '../constants/styles';

export default function ModalNewRecipe({ navigation, route }: { navigation: any, route: any }) {
  const recipeToEdit = route.params[1];
  const oldTitle = recipeToEdit ? JSON.parse(JSON.stringify(recipeToEdit.title)) : '';
  const oldCategory = recipeToEdit ? JSON.parse(JSON.stringify(recipeToEdit.category)) : '';
  const allCategories = ['Vorspeise', 'Hauptspeise', 'Nachspeise', 'Getränk', 'Snack'];

  const [selectedIndex, setSelectedIndex] = useState(1);
  const [allIngredients, setAllIngedients] = useState<_Ingredient[]>(recipeToEdit ? recipeToEdit.ingredients : []);
  const [allPrepSteps, setAllPrepSteps] = useState<_PrepStep[]>(recipeToEdit ? recipeToEdit.prepSteps : []);
  const [personCount, setPersonCount] = useState<number>(2);
  const [newRecipe, setNewRecipe] = useState<_Recipe>(recipeToEdit ? recipeToEdit : {
    title: '',
    personCount: 0,
    duration: '',
    category: 'Hauptspeise',
    ingredientsPerPerson: [],
    prepSteps: [],
    isFavorite: false
  });
  const scheme = useColorScheme();
  const styles = useGlobalStyles();
  const headerHeight = useHeaderHeight();
  const nav = useNavigation();

  useEffect(() => {
    if (recipeToEdit) {
      setSelectedIndex(allCategories.indexOf(oldCategory));
      setPersonCount(recipeToEdit.personCount); // TODO: funkt no ned richtig
    }

    nav.setOptions({
      title: route.params[0] === 'add' ? 'Neues Rezept' : 'Rezept bearbeiten',
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
  }, [navigation]);

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
    console.log(value)
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

  const getIngredientsPerPerson = () => {
    let ingredientsPerPerson: _Ingredient[] = [];

    allIngredients.forEach((ingr: _Ingredient) => {
      if (ingr.amount) {
        let amountPerPerson = parseFloat(ingr.amount.replace(',', '.')) / personCount;
        ingr.amount = amountPerPerson.toString();
      }
      ingredientsPerPerson.push(ingr);
    });

    return ingredientsPerPerson;
  }

  const saveNewItem = async () => {
    const recipe = { ...newRecipe };

    if (recipe.title === '') {
      return;
    }

    const title = newRecipe.title.trim().charAt(0).toUpperCase() + newRecipe.title.trim().slice(1);
    recipe.title = title;
    recipe.personCount = personCount;
    recipe.ingredientsPerPerson = getIngredientsPerPerson();
    recipe.prepSteps = allPrepSteps;

    const itemsString = await AsyncStorage.getItem('@recipeList');
    const allItems = itemsString ? JSON.parse(itemsString) : [];

    allItems.forEach((list: _RecipeList) => {
      if (route.params[0] === 'edit') {
        if (list.categoryName.includes(oldCategory)) {
          const index = list.data.findIndex(x => x.title === oldTitle);
          if (index > -1) {
            list.data.splice(index, 1);
          }
        }
      }
      if (list.categoryName.includes(newRecipe.category)) {
        list.data.push(recipe);
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
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ paddingBottom: 25 }}>
            <View style={styles.containerBox}>
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
                  buttons={allCategories}
                  selectedIndex={selectedIndex}
                  onPress={text => selectCategory(text)}
                />
              </View>
            </View>

            <StyledHeader text='Zutaten' count={allIngredients.length} />

            {allIngredients.map((ingredient, index) => {
              return <StyledSwipeable
                deleteRow={() => deleteIngredientsRow(index)}
                key={ingredient.key}
              >
                <View key={index} style={{ ...styles.containerBox, ...styles.containerSeparator }}>
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
                        style={{ ...styles.input, marginRight: 15 }}
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
                        style={styles.input}
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

            <StyledHeader text='Zubereitung' count={allPrepSteps.length} />

            {allPrepSteps.map((prep, index) => {
              return <StyledSwipeable
                deleteRow={() => deletePrepStepsRow(index)}
                key={prep.key}
              >
                <View key={index} style={{ ...styles.containerBox, ...styles.containerSeparator }}>
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

    <View style={{...styles.inputContainer, ...styles.inputContainerBottom}}>
      <StyledButtonPressable
        disabledButton={newRecipe.title === ''}
        onPress={saveNewItem}
        text='Speichern'
        icon='check'
        color='default'
      />
    </View>
  </>
  );
}
