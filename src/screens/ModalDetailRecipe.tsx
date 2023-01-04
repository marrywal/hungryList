import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { Text } from '../components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
import useColorScheme from '../hooks/useColorScheme';
import { Colors } from "../constants/Colors";
import React from 'react';
import { _Category, _Ingredient, _PrepStep, _Recipe, _RecipeList } from '../constants/interfaces';
import { useNavigation } from '@react-navigation/native'

export default function ModalDetailRecipe({ navigation, route }: { navigation: any, route: any }) {
    const scheme = useColorScheme();
    const nav = useNavigation();
    const recipe: _Recipe = route.params

    useEffect(() => {
        nav.setOptions({
            title: recipe.title,
            headerRight: () => <Pressable
                // onPress={} // TODO: add function
                style={({ pressed }) => ({
                    opacity: pressed ? 0.5 : 1,
                })}>
                <MaterialIcons
                    name="star-border"
                    size={32}
                    color={Colors[scheme].textOnTint}
                />
            </Pressable>,
        });
        console.log(recipe)
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

    /*
    title | als favorit hinzufügen - herz
    zeitaufwand
    zutaten für x personen (+ | -)
    button - zu einkaufsliste hinzufügen
    ---
    kategorie? 
    zutatenliste (name, menge, einheit)
    schritte
    ---
    rezept löschen
    rezept bearbeiten?
    */

    const Ingredient = ({ content }: { content: _Ingredient }) => {
        return (<>
            <Text>{content.name}</Text>
            <Text>{content.amount}</Text>
            <Text>{content.unit}</Text>
        </>)
    };

    const PrepStep = ({ content }: { content: _PrepStep }) => {
        return (<>
            <Text>{content.step}</Text>
        </>)
    };

    return (<>
        <ScrollView>
            <Text>{recipe.title}</Text>
            <Text>{recipe.personCount}</Text>
            <Text>{recipe.duration}</Text>
            <Text>{recipe.category}</Text>
            {recipe.ingredients.map((ingredient: _Ingredient) => {
                return <Ingredient key={ingredient.key} content={ingredient} />
            })}
            {recipe.prepSteps.map((step: _PrepStep) => {
                return <PrepStep key={step.key} content={step} />
            })}
        </ScrollView>
    </>
    );
}
