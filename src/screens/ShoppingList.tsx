import { StyleSheet, SafeAreaView, SectionList, StatusBar, Pressable } from "react-native";

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../../types';
import { Colors } from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

export default function ShoppingList({ navigation }: RootTabScreenProps<'ShoppingList'>) {
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

  const DATA = [
    {
      category: "Main dishes",
      data: [
        {
          title: "Mehl",
          count: "300gr",
        },
        {
          title: "Zucker",
          count: "2kg",
        },
        {
          title: "Milch",
          count: "3 St.",
        },
      ]
    },
    {
      category: "Sides",
      data: [
        {
          title: "Mehl",
          count: "300gr",
        },
        {
          title: "Zucker",
          count: "2kg",
        },
        {
          title: "Milch",
          count: "3 St.",
        },
      ]
    }
  ];

  const Item = ({ item }: { item: any }) => (
    <Pressable
      onPress={() => ''}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
      })}>
      <View style={styles.item}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.count}>{item.count}</Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        renderItem={({ item }) =>
          <Item item={item} />}
        sections={DATA}
      // keyExtractor={(item, index) => item + index} // TODO: kategorien wieder einblenden
      // renderSectionHeader={({ section: { title } }) => (
      //  <Text style={styles.header}>{title}</Text>
      // )}
      // stickySectionHeadersEnabled={false}
      />
    </SafeAreaView>
  );
}
