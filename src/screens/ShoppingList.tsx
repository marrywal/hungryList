import { SafeAreaView, SectionList, Pressable, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, Touchable, TouchableOpacity } from "react-native";
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../../types';
import { Colors } from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHeaderHeight } from '@react-navigation/elements';
import React from "react";
import { _Ingredient, _ShoppingList } from "../constants/interfaces";
import { MaterialIcons } from "@expo/vector-icons";
import { StyledTextInput } from '../components/StyledTextInput';
import { useGlobalStyles } from "../constants/styles";

export default function ShoppingList({ navigation }: RootTabScreenProps<'ShoppingList'>) {
  const [listItems, setListItems] = useState<_ShoppingList[]>([]);
  const [retrieve, setRetrieve] = useState(true);
  const [newItem, setNewItem] = useState('');
  const scheme = useColorScheme();
  const headerHeight = useHeaderHeight();
  const styles = useGlobalStyles();
  const listRef = React.useRef<SectionList<_Ingredient, _ShoppingList>>(null)

  useEffect(() => {
    // AsyncStorage.removeItem('@shoppingList');
    navigation.addListener('focus', () => {
      const retrieveData = async () => {
        try {
          const itemsString = await AsyncStorage.getItem('@shoppingList');
          const allItems = itemsString ? JSON.parse(itemsString) : [];
          setListItems(allItems);
        } catch (error) {
          console.log(error);
        }
      };

      if (retrieve) {
        retrieveData();
        setRetrieve(false);
      }
    });

  }, [navigation]);

  const onItemClick = (item: any) => {
    const list = [...listItems];
    const index = list[0].data.indexOf(item);
    if (index > -1) {
      list[0].data.splice(index, 1);
      setListItems(list);
      AsyncStorage.setItem('@shoppingList', JSON.stringify(list));
    }
  }

  const saveNewItem = () => {
    let list = [...listItems];

    if (newItem === '') {
      return;
    }

    if (list.length === 0) {
      list = [{
        category: 'Alles',
        data: []
      }]
    }

    const newKey = list[0].data.length + 1;
    const title = newItem.trim();
    const itemTitle = title.charAt(0).toUpperCase() + title.slice(1);

    list[0].data.push({
      name: itemTitle,
      amount: '',
      unit: '',
      key: newKey
    });

    AsyncStorage.setItem('@shoppingList', JSON.stringify(list));
    setListItems(list);

    setNewItem('');

    // TODO: listRef.current?.scrollToLocation({ animated: true, 
    //   itemIndex: 1,
    //   sectionIndex: 0,
    //   viewPosition: 1 })

    //listRef.current.scrollToEnd({ animating: true });

  }

  const Item = ({ item }: { item: _Ingredient }) => {
    if (item.name === undefined) {
      return <></>;
    }

    return (
      <Pressable style={styles.shoppingItem}>
        <Pressable
          onPress={() => onItemClick(item)}
          style={({ pressed }) => ({
            backgroundColor: pressed
              ? Colors[scheme].tintBackground
              : Colors[scheme].background,
            ...styles.itemName
          })}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.count}>   {item.amount} {item.unit}</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('ModalEditItem', item)}
          style={({ pressed }) => ({
            backgroundColor: pressed
              ? Colors[scheme].tintBackground
              : Colors[scheme].background
          })}>
          <View style={styles.itemDetails}>
            <MaterialIcons
              name='arrow-forward-ios'
              size={18}
              color={Colors[scheme].border}
            />
          </View>
        </Pressable>
      </Pressable>)
  };

  return (<>
    <SafeAreaView style={styles.container}>
      {listItems[0]?.data.length > 0 ? <SectionList
        renderItem={({ item }) =>
          <Item item={item} />}
        sections={listItems}
        ref={() => listRef}
      // keyExtractor={(item, index) => item + index} // TODO: kategorien wieder einblenden
      // renderSectionHeader={({ section: { title } }) => (
      //  <Text style={styles.header}>{title}</Text>
      // )}
      // stickySectionHeadersEnabled={false}
      /> :
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.emptyScreen}>
            <MaterialIcons
              name="shopping-cart"
              size={120}
              color={Colors[scheme].border}
            />
            <Text style={styles.emptyScreenTextWithoutMargin}>
              Deine Einkaufsliste ist leer
            </Text>
          </View>
        </TouchableWithoutFeedback>}
    </SafeAreaView>

    <KeyboardAvoidingView
      keyboardVerticalOffset={headerHeight}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{...styles.inputContainer, ...styles.inputContainerBottom}}>
          <StyledTextInput
            value={newItem}
            style={styles.sendInput}
            onChangeText={text => setNewItem(text)}
            placeholder="Was brauchst du?"
            returnKeyType="default"
            onSubmitEditing={saveNewItem}
          />
          <Pressable
            disabled={newItem === '' ? true : false}
            onPress={saveNewItem}
            style={({ pressed }) => ({
              opacity: pressed || newItem === '' ? 0.5 : 1
            })}>
            <View style={styles.sendButton}>
              <MaterialIcons
                name="add"
                size={28}
                color={Colors[scheme].textOnTint}
              />
            </View>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  </>
  );
}
