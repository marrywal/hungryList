import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Text, View } from '../components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
import useColorScheme from '../hooks/useColorScheme';
import { Colors } from "../constants/Colors";
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { _Category, _Ingredient, _PrepStep, _Recipe, _RecipeList } from '../constants/interfaces';
import { useNavigation } from '@react-navigation/native'
import { Tooltip } from '@rneui/themed';
import { StyledButtonPressable } from '../components/StyledButtonPressable';
import { StyledHeader } from '../components/StyledHeader';

export default function ModalDetailRecipe({ navigation, route }: { navigation: any, route: any }) {
    const recipe: _Recipe = route.params;
    const [isFavorite, setIsFavorite] = useState<boolean>(recipe.isFavorite);
    const scheme = useColorScheme();
    const nav = useNavigation();
    const [open, setOpen] = useState(false);
    const [personCount, setPersonCount] = useState<number>(2);


    useEffect(() => {
        nav.setOptions({
            title: recipe.title,
            headerRight: () => <Pressable
                onPress={markAsFavorite}
                style={({ pressed }) => ({
                    opacity: pressed ? 0.5 : 1,
                })}>
                <MaterialIcons
                    name={isFavorite ? "star" : "star-border"}
                    size={32}
                    color={Colors[scheme].textOnTint}
                />
            </Pressable>,
        });
        console.log(recipe)
    });

    const styles = StyleSheet.create({
        container: {
            paddingTop: 20,
            paddingHorizontal: 15,
            backgroundColor: Colors[scheme].background,
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
            flexDirection: 'row',
            alignItems: 'center'
        },
        secondaryText: {
            color: Colors[scheme].secondaryText,
            width: 18,
            textAlign: 'right'
        },
        itemButton: {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: 15,
            paddingVertical: 10,
        },
        containerButtons: {
            paddingTop: 20,
            paddingHorizontal: 15,
        },
        box: {
            display: 'flex',
            flexDirection: 'row',
            paddingBottom: 20,
        },
        prepStepsCount: {
            fontWeight: 'bold',
            color: Colors[scheme].tint,
            fontSize: 18,
        },
        prepStepsContent: {
            flex: 1,
            fontSize: 18,
        },
        ingredientsName: {
            flex: 1,
            fontSize: 18,
        },
        ingredientsAmount: {
            fontWeight: 'bold',
            marginRight: 10,
            fontSize: 18,
        },
    });

    /* TODO: 
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

    const markAsFavorite = async () => {
        setIsFavorite(!isFavorite);

        const itemsString = await AsyncStorage.getItem('@recipeList');
        const allItems = itemsString ? JSON.parse(itemsString) : [];

        allItems.forEach((list: _RecipeList) => {
            if (list.categoryName.includes(recipe.category)) {
                const currentRecipe = list.data.find(obj => obj.title === recipe.title);
                if (currentRecipe) {
                    let index = list.data.indexOf(currentRecipe);
                    list.data[index].isFavorite = !list.data[index].isFavorite;
                }
            }
        });

        AsyncStorage.setItem('@recipeList', JSON.stringify(allItems));
    }

    const addIngredientsToShoppingList = () => {
        console.log('add ingredients to shopping list') // TODO: 
    }

    const editRecipe = () => {
        console.log('edit recipe') // TODO: 
    }

    const deleteRecipe = async () => {
        const itemsString = await AsyncStorage.getItem('@recipeList');
        const allItems = itemsString ? JSON.parse(itemsString) : [];

        allItems.forEach((list: _RecipeList) => {
            if (list.categoryName.includes(recipe.category)) {
                list.data = list.data.filter(obj => obj.title !== recipe.title);
            }
        });

        AsyncStorage.setItem('@recipeList', JSON.stringify(allItems));

        navigation.navigate('Recipes');
    }

    const deleteAlert = () => {
        return Alert.alert(
            "Willst du dieses Rezept wirklich löschen?",
            "Diese Aktion kann nicht rückgängig gemacht werden",
            [
                {
                    text: "Abbrechen",
                    style: "cancel"
                },
                {
                    text: "Löschen",
                    onPress: deleteRecipe,
                    style: "destructive"
                }
            ]
        );
    }

    const Ingredient = ({ content }: { content: _Ingredient }) => {
        return (<View style={styles.box}>
            <Text style={styles.ingredientsAmount}>{content.amount} {content.unit}</Text>
            <Text style={styles.ingredientsName}>{content.name}</Text>
        </View>)
    };

    const PrepStep = ({ content }: { content: _PrepStep }) => {
        return (<View style={styles.box}>
            <Text style={styles.prepStepsCount}>{content.key}. </Text>
            <Text style={styles.prepStepsContent}>{content.step}

                {/* <Tooltip key={content.key}
                    backgroundColor={Colors[scheme].text}
                    visible={open}
                    onOpen={() => {
                        setOpen(true);
                    }}
                    onClose={() => {
                        setOpen(false);
                    }}
                    popover={<Text style={{ color: Colors[scheme].textOnTint }}>600 ml</Text>}
                ><Text style={{fontSize: 18, textDecorationLine: 'underline'}}>Milch</Text></Tooltip> */}

            </Text>
        </View>)
    };

    const renderCounterButton = (onClick: () => void, icon: any, buttonStyle: StyleProp<ViewStyle>, buttonText?: string, spacingRight = false) => {
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

    const countPersonUp = () => {
        setPersonCount(personCount + 1);
    }

    const countPersonDown = () => {
        if (personCount === 1) {
            return;
        }
        setPersonCount(personCount - 1);
    }

    /*
    TODO: 
    zutatenmengen ändern, je nach personen
     */

    return (<>
        <ScrollView>
            <View>
                {/* <View style={styles.container}>
                    <Text>{recipe.title}</Text>
                    <Text>{recipe.duration}</Text>
                    <Text>{recipe.category}</Text>
                </View> */}

                <View style={styles.container}>
                    <View style={styles.inputBox2}>
                        <View style={styles.input60}>
                            <Text>Rezept für {personCount} Personen</Text>
                        </View>
                        <View style={{ ...styles.input40, ...styles.inputBox2, marginBottom: 20 }}>
                            {renderCounterButton(countPersonDown, 'remove-circle', styles.itemButton)}
                            <Text style={styles.secondaryText}>{personCount}</Text>
                            <MaterialIcons name='people' size={26} color={Colors[scheme].secondaryText} />
                            {renderCounterButton(countPersonUp, 'add-circle', styles.itemButton, '', true)}
                        </View>
                    </View>
                    <StyledButtonPressable
                        onPress={addIngredientsToShoppingList}
                        text='Zu Einkaufsliste hinzufügen'
                        icon='shopping-cart'
                        color='default'
                    />
                </View>

                {recipe.ingredients.length > 0 ?
                    <>
                        <StyledHeader text='Zutaten' count={recipe.ingredients.length} />
                        <View style={styles.container}>
                            {recipe.ingredients.map((ingredient: _Ingredient) => {
                                return <Ingredient key={ingredient.key} content={ingredient} />
                            })}
                        </View>
                    </>
                    : null
                }

                {recipe.prepSteps.length > 0 ?
                    <>
                        <StyledHeader text='Zubereitung' count={recipe.prepSteps.length} />
                        <View style={styles.container}>
                            {recipe.prepSteps.map((step: _PrepStep) => {
                                return <PrepStep key={step.key} content={step} />
                            })}
                        </View>
                    </>
                    : null
                }


                {/* <Tooltip
                    backgroundColor={Colors[scheme].text}
                    visible={open}
                    onOpen={() => {
                        setOpen(true);
                    }}
                    onClose={() => {
                        setOpen(false);
                    }}
                    popover={<Text style={{ color: Colors[scheme].textOnTint }}>This is the popover text</Text>}
                ><Text>TOOLTIP NOCH ZU MACHEN</Text></Tooltip> */}

                <View style={styles.containerButtons}>
                    <StyledButtonPressable
                        onPress={editRecipe}
                        text='Rezept bearbeiten'
                        icon='edit'
                        color='default'
                    />
                    <StyledButtonPressable
                        onPress={deleteAlert}
                        text='Rezept löschen'
                        icon='delete'
                        color='error'
                    />
                </View>
            </View>
        </ScrollView>
    </>
    );
}
