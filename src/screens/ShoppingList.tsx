import { StyleSheet, SafeAreaView, SectionList, StatusBar, Pressable, GestureResponderEvent } from "react-native";

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../../types';
import { Colors } from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { useState } from "react";

const DATA = [
  {
    category: "Alles", // TODO: Kategorien einbauen und sinnvoll machen
    data: [
      {
        title: "mehl",
        count: "300gr",
      },
      {
        title: "zucker",
        count: "2kg",
      },
      {
        title: "milch",
        count: "3 St.",
      },
    ]
  },
];

export default function ShoppingList({ navigation }: RootTabScreenProps<'ShoppingList'>) {
  const [listItems, setListItems] = useState(DATA);
  const scheme = useColorScheme();

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
      justifyContent: 'space-between'
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
    }
  });

  const onItemClick = (item: any) => {
    const list = [...listItems];
    const index = list[0].data.indexOf(item)
    if (index > -1) {
      list[0].data.splice(index, 1);
      setListItems(list);
    }
  }

  const Item = ({ item }: { item: any }) => {
    const itemTitle = item.title.charAt(0).toUpperCase() + item.title.slice(1);

    return (
      <Pressable
        onPress={() => onItemClick(item)}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
        })}>
        <View style={styles.item}>
          <Text style={styles.title}>{itemTitle}</Text>
          <Text style={styles.count}>{item.count}</Text>
        </View>
      </Pressable>)
  };

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        renderItem={({ item }) =>
          <Item item={item} />}
        sections={listItems}
      // keyExtractor={(item, index) => item + index} // TODO: kategorien wieder einblenden
      // renderSectionHeader={({ section: { title } }) => (
      //  <Text style={styles.header}>{title}</Text>
      // )}
      // stickySectionHeadersEnabled={false}
      />
    </SafeAreaView>
  );
}
