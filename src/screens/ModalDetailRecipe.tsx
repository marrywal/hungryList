import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Share, StyleProp, ViewStyle } from 'react-native';
import { Text, View } from '../components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
import useColorScheme from '../hooks/useColorScheme';
import { Colors } from "../constants/Colors";
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { _Category, _Ingredient, _PrepStep, _Recipe, _RecipeList } from '../constants/interfaces';
import { useNavigation } from '@react-navigation/native';
import { StyledButtonPressable } from '../components/StyledButtonPressable';
import { StyledHeader } from '../components/StyledHeader';
import { Tooltip } from '@rneui/themed';
import { useGlobalStyles } from '../constants/styles/globalStyles';

export default function ModalDetailRecipe({ navigation, route }: { navigation: any, route: any }) {
    const [recipe, setRecipe] = useState<_Recipe>(route.params);
    const [isFavorite, setIsFavorite] = useState<boolean>(recipe.isFavorite);
    const [personCount, setPersonCount] = useState<number>(2);
    const [countInitial, setCountInitial] = useState(true);
    // const [isTooltipOpen, setIsToolTipOpen] = useState<number>(2);
    const scheme = useColorScheme();
    const nav = useNavigation();
    const styles = useGlobalStyles();


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

        if (countInitial) {
            setIngredientsForPersonCount(personCount);
            setCountInitial(false);
        }
    });

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

    const setIngredientsForPersonCount = (count: number) => {
        let ingredients: _Ingredient[] = [];

        const ingPerPerson = JSON.parse(JSON.stringify(recipe.ingredientsPerPerson));

        ingPerPerson.forEach((ingr: _Ingredient) => {
            if (ingr.amount) {
                let amountForAll = parseFloat(ingr.amount.replace(',', '.')) * count;
                ingr.amount = amountForAll.toString().replace('.', ',');
            }
            ingredients.push(ingr);
        });

        recipe.ingredients = ingredients;
        setRecipe(recipe);
    }

    const addIngredientsToShoppingList = () => {
        console.log('add ingredients to shopping list') // TODO: 
    }

    const editRecipe = () => {
        navigation.navigate('ModalNewRecipe', ['edit', recipe]);
    }

    const sendRecipe = async () => {
        let messageToSend = recipe.title + '\n';

        recipe.ingredients?.forEach(ingr => {
            messageToSend += `\n${ingr.amount} ${ingr.unit} ${ingr.name}`;
        });


        recipe.prepSteps.forEach(step => {
            messageToSend += `\n\n${step.key}. ${step.step}`;
        });

        try {
            await Share.share({
                message: messageToSend,
            });
        } catch (error) {
            console.log(error)
        }
    };

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
            <Text style={styles.content}>{content.name}</Text>
        </View>)
    };

    const PrepStep = ({ content }: { content: _PrepStep }) => {
        return (<View style={styles.box}>
            <Text style={styles.prepStepsCount}>{content.key}. </Text>
            <Text style={styles.content}>{content.step}

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

    const renderCounterButton = (onClick: () => void, icon: any, buttonStyle: StyleProp<ViewStyle>) => {
        return <Pressable
            onPress={onClick}
            style={({ pressed }) => ({
                backgroundColor: pressed
                    ? Colors[scheme].tintBackground
                    : Colors[scheme].background
            })}>
            <View style={buttonStyle}>
                <MaterialIcons name={icon} size={20} color={Colors[scheme].tint} />
            </View>
        </Pressable>
    }

    const countPersonUp = () => {
        setIngredientsForPersonCount(personCount + 1);
        setPersonCount(personCount + 1);
    }

    const countPersonDown = () => {
        if (personCount === 1) {
            return;
        }
        setIngredientsForPersonCount(personCount - 1);
        setPersonCount(personCount - 1);
    }

    return (<>
        <ScrollView>
            <View>
                <View style={styles.cardContainer}>
                    <Text style={styles.titleBig}>{recipe.title}</Text>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={styles.smallText}>{recipe.category} {recipe.duration ? '|' : null} {recipe.duration}</Text>
                    </View>
                    {recipe.ingredients && recipe.ingredients.length > 0 ?
                        <>
                            <View style={{ ...styles.inputBox2, ...styles.containerSeparatorTop, marginBottom: 10 }}>
                                <View style={styles.inputBox2}>
                                    <MaterialIcons name='people' size={18} color={Colors[scheme].secondaryText} />
                                    <Text style={styles.personText}> Rezept für {personCount} Person{personCount > 1 ? 'en' : ''}</Text>
                                </View>
                                <View style={styles.inputBox2}>
                                    {renderCounterButton(countPersonDown, 'remove-circle', styles.itemButton)}
                                    {renderCounterButton(countPersonUp, 'add-circle', styles.itemButton)}
                                </View>
                            </View>
                            <StyledButtonPressable
                                onPress={addIngredientsToShoppingList}
                                text='Zu Einkaufsliste hinzufügen'
                                icon='shopping-cart'
                                color='default'
                            />
                        </>
                        : null
                    }
                </View>

                {recipe.ingredients && recipe.ingredients.length > 0 ?
                    <>
                        <StyledHeader text='Zutaten' count={recipe.ingredients.length} />
                        <View style={styles.containerBox}>
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
                        <View style={styles.containerBox}>
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
                        color='default-inverted'
                    />
                    {recipe.ingredients && recipe.ingredients.length > 0 ?
                        <StyledButtonPressable
                            onPress={sendRecipe}
                            text='Rezept teilen'
                            icon='ios-share'
                            color='default-inverted'
                        />
                        : null
                    }
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
