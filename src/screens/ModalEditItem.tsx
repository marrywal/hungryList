import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
import useColorScheme from '../hooks/useColorScheme';
import { Colors } from "../constants/Colors";
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { _Category, _Ingredient, _PrepStep, _Recipe, _RecipeList } from '../constants/interfaces';
import { useNavigation } from '@react-navigation/native';
import { StyledTextInput } from '../components/StyledTextInput';
import { StyledButtonPressable } from '../components/StyledButtonPressable';
import { useGlobalStyles } from '../constants/styles';

export default function ModalEditItem({ navigation, route }: { navigation: any, route: any }) {
    const [item, setItem] = useState<_Ingredient>(route.params);
    const [amount, setAmount] = useState<string>(item.amount);
    const [unit, setUnit] = useState<string>(item.unit);

    const scheme = useColorScheme();
    const nav = useNavigation();
    const styles = useGlobalStyles();


    useEffect(() => {
        nav.setOptions({
            title: 'Eintrag bearbeiten',
            headerRight: () => <Pressable
                onPress={saveItem}
                style={({ pressed }) => ({
                    opacity: pressed ? 0.5 : 1,
                })}>
                <MaterialIcons
                    name="check"
                    size={32}
                    color={Colors[scheme].textOnTint}
                />
            </Pressable>,
        });


    });

    const saveItem = async () => {
        const itemsString = await AsyncStorage.getItem('@shoppingList');
        const allItems = itemsString ? JSON.parse(itemsString) : [];

        allItems[0].data.forEach((ingr: _Ingredient) => {
            if (ingr.name === item.name) {
                ingr.amount = amount;
                ingr.unit = unit;
            }
        });

        AsyncStorage.setItem('@shoppingList', JSON.stringify(allItems));

        navigation.navigate('ShoppingList');
    }


    return (<>
        <ScrollView>
            <View style={{ ...styles.containerBox, ...styles.containerSeparator }}>
                <Text style={styles.titleWithSpace}>{item.name}</Text>
                <View style={styles.inputBox2}>
                    <View style={styles.input60}>
                        <StyledTextInput
                            value={amount}
                            style={{ ...styles.input, marginRight: 15 }}
                            onChangeText={text => setAmount(text)}
                            placeholder="Menge"
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.input40}>
                        <StyledTextInput
                            value={unit}
                            onChangeText={text => setUnit(text)}
                            style={styles.input}
                            placeholder="Einheit"
                        />
                    </View>
                </View>
            </View>
        </ScrollView>

        <View style={{...styles.inputContainer, ...styles.inputContainerBottom}}>
            <StyledButtonPressable
                onPress={saveItem}
                text='Speichern'
                icon='check'
                color='default'
            />
        </View>
    </>
    );
}
