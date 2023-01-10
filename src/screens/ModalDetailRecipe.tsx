import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Share, StyleProp, StyleSheet, ViewStyle } from 'react-native';
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
    });

    const styles = StyleSheet.create({
        container: {
            paddingTop: 20,
            paddingHorizontal: 15,
            backgroundColor: Colors[scheme].background,
        },
        cardContainer: {
            paddingTop: 20,
            paddingHorizontal: 15,
            backgroundColor: Colors[scheme].background,
            margin: 15,
            borderRadius: 10,
            shadowColor: Colors[scheme].secondaryText,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
        },
        title: {
            fontWeight: 'bold',
            fontSize: 28,
        },
        secondaryText: {
            color: Colors[scheme].secondaryText,
        },
        inputBox2: {
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center'
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
            width: 35,
            lineHeight: 24
        },
        ingredientsAmount: {
            fontWeight: 'bold',
            marginRight: 10,
            fontSize: 18,
            flex: 1,
            textAlign: 'right',
            lineHeight: 24
        },
        content: {
            flex: 3,
            fontSize: 18,
            lineHeight: 24
        },
        containerSeparator: {
            borderBottomColor: Colors[scheme].input,
            borderBottomWidth: 1,
            paddingBottom: 20
        },
        personText: {
            fontSize: 16,
        },
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

    const addIngredientsToShoppingList = () => {
        console.log('add ingredients to shopping list') // TODO: 
    }

    const editRecipe = () => {
        console.log('edit recipe') // TODO: 
    }

    const sendRecipe = async () => {
        let messageToSend = recipe.title + '\n';

        recipe.ingredients.forEach(ingr => {
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

                <View style={styles.cardContainer}>
                    <Text style={styles.title}>{recipe.title}</Text>
                    <View style={styles.containerSeparator}>
                        <Text style={styles.secondaryText}>{recipe.category} {recipe.duration ? '|' : null} {recipe.duration}</Text>
                    </View>
                    <View style={{ ...styles.inputBox2, marginVertical: 10 }}>
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
                        color='default-inverted'
                    />
                    <StyledButtonPressable
                        onPress={sendRecipe}
                        text='Rezept teilen'
                        icon='ios-share'
                        color='default-inverted'
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
