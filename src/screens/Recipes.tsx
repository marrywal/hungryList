import { Pressable, SafeAreaView, SectionList, StatusBar, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../../types';
import useColorScheme from '../hooks/useColorScheme';
import { Colors } from "../constants/Colors";
import { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { _RecipeList } from '../constants/interfaces';

const DEFAULTDATA = [
  {
    categoryName: "Vorspeisen",
    data: []
  },
  {
    categoryName: "Hauptspeisen",
    data: [
    ]
  },
  {
    categoryName: "Nachspeisen",
    data: []
  },
  {
    categoryName: "Getränke",
    data: []
  },
  {
    categoryName: "Snacks",
    data: []
  },
];

export default function Recipes({ navigation }: RootTabScreenProps<'Recipes'>) {
  const [recipeListItems, setRecipeListItems] = useState<_RecipeList[]>([]);
  const [retrieve, setRetrieve] = useState(true);
  const scheme = useColorScheme();

  /* TODO:
  - spashscreen
  - loadingscreen?
  - createContext
  - https://github.com/Shopify/restyle
  - new recipe: mark as favorite (wird als erstes angezeigt)
  - new recipe: save picture?
  */

  useEffect(() => {
    // AsyncStorage.removeItem('@recipeList');
    const unsubscribe = navigation.addListener('focus', () => {
      const retrieveData = async () => {
        try {
          let itemsString = await AsyncStorage.getItem('@recipeList');
          if (!itemsString) {
            AsyncStorage.setItem('@recipeList', JSON.stringify(DEFAULTDATA));
            itemsString = await AsyncStorage.getItem('@recipeList');
          }
          const allItems = itemsString ? JSON.parse(itemsString) : [];
          setRecipeListItems(allItems);
        } catch (error) {
          console.log(error);
        }
      };

      if (retrieve) {
        retrieveData();
        setRetrieve(false);
      }
    });

    return unsubscribe;

  }, [navigation]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: StatusBar.currentHeight,
    },
    emptyScreen: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%'
    },
    emptyScreenText: {
      color: Colors[scheme].placeholder,
      fontSize: 16
    },
    item: {
      paddingVertical: 0,
      paddingLeft: 0,
      paddingRight: 15,
      borderBottomWidth: 0.25,
      borderBottomColor: Colors[scheme].border,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'transparent'
    },
    itemContent: {
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
    subtitle: {
      fontSize: 14,
      color: Colors[scheme].secondaryText,
    },
    saveButton: {
      backgroundColor: Colors[scheme].tint,
      borderRadius: 10,
      height: 45,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 15,
      paddingHorizontal: 25,
    },
    saveButtonText: {
      color: Colors[scheme].textOnTint,
      fontSize: 16,
      marginLeft: 5,
      fontWeight: 'bold',
    },
  });

  const onItemClick = (item: any) => {
    console.log(item)
  }

  const isListEmpty = () => {
    let isEmpty = true;
    recipeListItems.forEach((list: any) => {
      if (list.data.length > 0) {
        isEmpty = false;
      }
    });

    return isEmpty;
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
          <View style={styles.itemContent}>
            <MaterialIcons
              name='image'
              size={80}
              color={Colors[scheme].border}
            />
            <View>
              <Text style={styles.title}>{itemTitle}</Text>
              <Text style={styles.subtitle}>{item.duration}</Text>
            </View>
          </View>
          <MaterialIcons
            name='arrow-forward-ios'
            size={18}
            color={Colors[scheme].border}
          />
        </View>
      </Pressable>)
  };

  return (
    <SafeAreaView style={styles.container}>
      {isListEmpty()
        ?
        <View style={styles.emptyScreen}>
          <MaterialIcons
            name="fastfood"
            size={120}
            color={Colors[scheme].border}
          />
          <Text style={styles.emptyScreenText}>
            Noch keine Rezepte gespeichert
          </Text>
          <Pressable
            onPress={() => navigation.navigate('ModalNewRecipe')}
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1
            })}>
            <View style={styles.saveButton}>
              <MaterialIcons
                name="add"
                size={26}
                color={Colors[scheme].textOnTint}
              />
              <Text style={styles.saveButtonText}>Neues Rezept</Text>
            </View>
          </Pressable>
        </View>
        :
        <SectionList
          renderItem={({ item }) =>
            <Item item={item} />}
          sections={recipeListItems}
          keyExtractor={(item, index) => item.category + index}
          renderSectionHeader={({ section: { categoryName, data } }) => {
            if (data.length > 0) {
              return <Text style={styles.header}>{categoryName} ({data.length})</Text>
            }
            return null;
          }}
          stickySectionHeadersEnabled={false}
        />
      }
    </SafeAreaView>
  );
}
