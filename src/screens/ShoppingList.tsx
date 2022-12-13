import { StyleSheet, SafeAreaView, SectionList, StatusBar, Pressable, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from "react-native";
import { StyledTextInput, Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../../types';
import { Colors } from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHeaderHeight } from '@react-navigation/elements';
import React from "react";
import { _ShoppingItem, _ShoppingList } from "../constants/interfaces";

export default function ShoppingList({ navigation }: RootTabScreenProps<'ShoppingList'>) {
  const [listItems, setListItems] = useState<_ShoppingList[]>([]);
  const [retrieve, setRetrieve] = useState(true);
  const [newItem, setNewItem] = useState('');
  const scheme = useColorScheme();
  const headerHeight = useHeaderHeight();
  const listRef = React.useRef<SectionList<_ShoppingItem, _ShoppingList>>(null)

  useEffect(() => {
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
  }, [retrieve]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: StatusBar.currentHeight,
    },
    item: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderBottomWidth: 0.25,
      borderBottomColor: Colors[scheme].border,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'transparent'
    },
    header: {
      fontSize: 12,
      marginHorizontal: 10,
      marginBottom: 5,
      marginTop: 20
    },
    title: {
      fontSize: 18,
    },
    count: {
      fontSize: 14,
      color: Colors[scheme].secondaryText,
    },
    inputContainer: {
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderTopWidth: 0.25,
      borderTopColor: Colors[scheme].border,
      backgroundColor: Colors[scheme].background,
    }
  });

  const onItemClick = (item: any) => {
    const list = [...listItems];
    const index = list[0].data.indexOf(item)
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

    list[0].data.push({
      title: newItem,
      count: ''
    });

    AsyncStorage.setItem('@shoppingList', JSON.stringify(list));
    setListItems(list);

    setNewItem('');




    // listRef.current?.scrollToLocation({ animated: true,
    //   itemIndex: 1,
    //   sectionIndex: 0,
    //   viewPosition: 1 })






    //listRef.current.scrollToEnd({ animating: true });

  }

  const Item = ({ item }: { item: any }) => {
    const itemTitle = item.title.charAt(0).toUpperCase() + item.title.slice(1);

    return (
      <Pressable
        onPress={() => onItemClick(item)}
        style={({ pressed }) => ({
          backgroundColor: pressed
            ? Colors[scheme].tintBackground
            : Colors[scheme].background
        })}>
        <View style={styles.item}>
          <Text style={styles.title}>{itemTitle}</Text>
          <Text style={styles.count}>{item.count}</Text>
        </View>
      </Pressable>)
  };

  return (<>
    <SafeAreaView style={styles.container}>
      <SectionList
        renderItem={({ item }) =>
          <Item item={item} />}
        sections={listItems}
        ref={() => listRef}
      // keyExtractor={(item, index) => item + index} // TODO: kategorien wieder einblenden
      // renderSectionHeader={({ section: { title } }) => (
      //  <Text style={styles.header}>{title}</Text>
      // )}
      // stickySectionHeadersEnabled={false}
      />
    </SafeAreaView>

    <KeyboardAvoidingView
      keyboardVerticalOffset={headerHeight}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inputContainer}>
          <StyledTextInput
            value={newItem}
            onChangeText={text => setNewItem(text)}
            placeholder="Was brauchst du?"
            keyboardType="default"
            autoComplete='off'
            clearButtonMode='while-editing'
            enablesReturnKeyAutomatically={true}
            blurOnSubmit={false}
            onSubmitEditing={saveNewItem}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  </>
  );
}
