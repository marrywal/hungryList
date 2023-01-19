import { Keyboard, Pressable, SafeAreaView, SectionList, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../../types';
import useColorScheme from '../hooks/useColorScheme';
import { Colors } from "../constants/Colors";
import { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { _Recipe, _RecipeList } from '../constants/interfaces';
import { StyledHeader } from '../components/StyledHeader';
import { StyledButtonPressable } from '../components/StyledButtonPressable';
import dynamicSort from '../hooks/dynamicSort';
import { StyledTextInput } from '../components/StyledTextInput';
import { useGlobalStyles } from '../constants/styles';

const DEFAULTDATA = [
  {
    categoryName: "Vorspeisen",
    data: [

    ]
  },
  {
    categoryName: "Hauptspeisen",
    data: [
      {
        title: 'Thai Curry',
        personCount: 2,
        duration: '50 min',
        category: 'Hauptspeise',
        ingredientsPerPerson: [
          {
            key: 1,
            name: 'Kokosfett zum Braten',
            amount: '',
            unit: ''
          },
          {
            key: 2,
            name: 'große Zwiebel',
            amount: '0,5',
            unit: ''
          },
          {
            key: 3,
            name: 'Zehen Knoblauch',
            amount: '0,5',
            unit: ''
          },
          {
            key: 4,
            name: 'Currypaste, Menge je nach Paste und gewünschter Schärfe',
            amount: '2,5',
            unit: 'EL'
          },
          {
            key: 5,
            name: 'Hähnchenbrust',
            amount: '200',
            unit: 'gr'
          },
          {
            key: 6,
            name: 'Kokosmilch, frisch oder aus der Dose',
            amount: '0,5',
            unit: 'Liter'
          },
          {
            key: 7,
            name: 'Geflügelbrühe oder Milch',
            amount: '100',
            unit: 'ml'
          },
          {
            key: 8,
            name: 'Fischsauce',
            amount: '1,5',
            unit: 'EL'
          },
          {
            key: 9,
            name: 'Kaffir-Limettenblätter, TK oder frisch',
            amount: '1,5',
            unit: ''
          },
          {
            key: 10,
            name: 'Palmzucker, alternativ Honig verwenden',
            amount: '1',
            unit: 'TL'
          },
          {
            key: 11,
            name: 'Gemüse, Sorten nach Wahl, auch gemischt',
            amount: '150',
            unit: 'gr'
          },
          {
            key: 12,
            name: 'Reis',
            amount: '200',
            unit: 'gr'
          },
        ],
        prepSteps: [
          {
            key: 1,
            step: 'Zwiebel und Knoblauch würfeln, Gemüse und Fleisch in kleine Stücke schneiden und bereitlegen. Brühe erhitzen, alternativ kann kalte Milch verwendet werden. Lässt man diese Zutat weg, wird das Curry sehr cremig und dickflüssig. Die Brühe bzw. das Glutamat gibt dem Curry den gewissen Kick, ist aber Geschmackssache.'
          },
          {
            key: 2,
            step: 'Zwiebel und Knoblauch glasig anbraten. Die Thaicurry-Paste hinzugeben - anfangs aufgrund der Schärfe vorsichtig dosieren (bei grün und rot sehr vorsichtig, nachwürzen kann man auch zum Ende noch) - und alles bei hoher Temperatur in etwas Öl bräunen, dabei mit etwas Kokosmilch vermischen und kurz aufkochen lassen, bis sich ein Ölfilm oben absetzt (ca 2 min). Geflügelbrühe oder Milch hinzugeben und verrühren.'
          },
          {
            key: 3,
            step: 'Nun langsam mit der restlichen Kokosmilch verrühren. Hitze reduzieren, dass es nur noch köchelt. Kaffirlimettenblätter entweder im Stück oder zum mitessen in dünne Scheiben schneiden und hinzugeben. Mit Fischsauce, Palmzucker (oder Honig) würzen. Nun kann man es schon mal wegen der Schärfe abschmecken. Ist es zuwenig, dann einfach noch 1 - 2 EL Currypaste hinzugeben und köchelnd einrühren.'
          },
          {
            key: 4,
            step: 'Fisch oder Fleisch hinzugeben, Fleisch in kleinen Stücken, Fisch kann auch als kleines Filet oder im Stücke hinzugegeben werden. Bei Fleisch gibt es zwei Möglichkeiten, entweder vorher scharf anbraten und während der ersten Schritte ruhen lassen, dann noch 10 Minuten mitgaren. Oder in kleine Stücke schneiden und nur mitgaren lassen, was insbesondere bei Hühnchen gut klappt. In beiden Fällen erreicht man gute Ergebnisse.'
          },
          {
            key: 5,
            step: 'Gemüse, z. B. 1 Paprikaschote, eine Handvoll TK-Erbsen und Bohnen, Champignons, kurz vor Ende hinzufügen. Maximal 10 - 15 Minuten mitköcheln lassen, um es bissfest zu halten.'
          },
          {
            key: 6,
            step: 'Für ein leckeres Panang Erdnuss Curry einfach die Erdnussbutter (crunchy oder cremig) in das Curry einrühren, optional einige Erdnüsse dazugeben.'
          },
          {
            key: 7,
            step: 'Zum Abrunden des Currys verwende ich Fischsauce als Salzersatz. Wem es immer noch nicht scharf genug ist, kann nochmal etwas Paste hinzugeben. Oder beim nächsten Mal eine andere probieren. Die Schärfe kann auch zwischen den Herstellern stark schwanken.'
          },
          {
            key: 8,
            step: 'Während des Kochens den Reis aufsetzen, ich verwende Basmati oder Thaireis.'
          },
          {
            key: 9,
            step: 'Den Reis zum Curry anrichten und mit etwas Thaibasilikum servieren.'
          },
          {
            key: 10,
            step: 'Tipp: Die in den Zutaten angegebene Milch bzw. Brühe wird direkt nach dem Aufgießen der Currypaste mit der Kokosmilch hinzugegeben und verrührt. Das ist vor allem bei größeren Portionen hilfreich für mehr Flüssigkeit und preislich günstiger als nur Kokosmilch zu verwenden und wird von vielen Asiaten genauso gemacht. Im Gegensatz zur Milch die den Geschmack eher neutralisiert (bei Schärfe hilfreich) sorgt die Brühe für zusätzliche Würze. Natürlich kann man es auch nur mit Kokosmilch machen, hier sollte man vorher auf die Packung schauen wie konzentriert diese ist. Wenn man ein sehr cremiges Curry macht, gibt es spezielle cremige Kokosmilch dafür.'
          },
        ],
        isFavorite: false
      },
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
  const [masterDataSource, setMasterDataSource] = useState<_RecipeList[]>([]);
  const [recipeListItems, setRecipeListItems] = useState<_RecipeList[]>([]);
  const [retrieve, setRetrieve] = useState(true);
  const [search, setSearch] = useState("");
  const scheme = useColorScheme();
  const styles = useGlobalStyles();

  /* TODO:
  - spashscreen
  - loadingscreen?
  - https://github.com/Shopify/restyle
  - new recipe: save picture?
  - id hinzufügen oder name schon vorhanden prüfen
  */

  useEffect(() => {
    // AsyncStorage.removeItem('@recipeList');
    navigation.addListener('focus', () => {
      const retrieveData = async () => {
        try {
          let itemsString = await AsyncStorage.getItem('@recipeList');
          if (!itemsString) {
            AsyncStorage.setItem('@recipeList', JSON.stringify(DEFAULTDATA));
            itemsString = await AsyncStorage.getItem('@recipeList');
          }
          let allItems = itemsString ? JSON.parse(itemsString) : [];

          sortByFavoriteAndTitle(allItems);

          setRecipeListItems([...allItems]);
          setMasterDataSource([...allItems]);
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

  const sortByFavoriteAndTitle = (allItems: _RecipeList[]) => {
    return allItems.forEach((cat: _RecipeList) => {
      let favItems: _Recipe[] = [];
      let notFavItems: _Recipe[] = [];
      cat.data.forEach((item: _Recipe) => {
        if (item.isFavorite) {
          favItems.push(item);
        } else {
          notFavItems.push(item);
        }
      });
      favItems = favItems.sort(dynamicSort("title"));
      notFavItems = notFavItems.sort(dynamicSort("title"));
      cat.data = favItems;
      cat.data.push(...notFavItems);
    });
  }

  const onItemClick = (item: any) => {
    navigation.navigate('ModalDetailRecipe', item);
  }

  const isListEmpty = (list: _RecipeList[]) => {
    let isEmpty = true;
    list.forEach((list: any) => {
      if (list.data.length > 0) {
        isEmpty = false;
      }
    });

    return isEmpty;
  }

  const Item = ({ item }: { item: any }) => {
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
            <View style={styles.titleBox}>
              <Text numberOfLines={1} style={styles.title}>
                {item.title}
              </Text>
              <View style={styles.subtitle}>
                {item.isFavorite ? <MaterialIcons
                  name='star'
                  size={16}
                  color={Colors[scheme].warning}
                  style={{ marginRight: 4 }}
                /> : <></>}
                <Text style={styles.subtitleText}>{item.duration}</Text>
              </View>
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

  const updateSearch = (search: string) => {
    if (search === '') {
      setRecipeListItems([...masterDataSource]);
      setSearch(search);
      return;
    }

    let filteredItems = JSON.parse(JSON.stringify(masterDataSource));
    filteredItems.forEach((cat: _RecipeList) => {
      let filteredData: _Recipe[] = [];
      cat.data.forEach((item: _Recipe) => {
        if (item.title.toLowerCase().includes(search.toLowerCase())) {
          filteredData.push(item);
        }
      });
      cat.data = filteredData;
    });
    setRecipeListItems(filteredItems);
    setSearch(search);
  };

  const deleteSearch = () => {
    setRecipeListItems(masterDataSource);
    setSearch('');
  }

  return (
    <SafeAreaView style={styles.container}>
      {isListEmpty(masterDataSource)
        ?
        <View style={styles.emptyScreen}>
          <MaterialIcons
            name="menu-book"
            size={120}
            color={Colors[scheme].border}
          />
          <Text style={styles.emptyScreenText}>
            Noch keine Rezepte gespeichert
          </Text>
          <StyledButtonPressable
            onPress={() => navigation.navigate('ModalNewRecipe', ['add'])}
            text='Neues Rezept'
            icon='add'
            color='default'
            customWidth={true}
          />
        </View>
        :
        <View style={{ height: '100%' }}>
          <View style={{...styles.inputContainer, ...styles.inputContainerTop}}>
            <MaterialIcons
              name='search'
              size={18}
              color={Colors[scheme].border}
              style={styles.searchIcon}
            />
            <StyledTextInput
              returnKeyType='default'
              placeholder="Durchsuchen..."
              onChangeText={(text) => updateSearch(text)}
              value={search}
              style={styles.searchbar}
              blurOnSubmit={true}
            />
          </View>

          {isListEmpty(recipeListItems)
            ?
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.emptyScreen}>
              <MaterialIcons
                name="menu-book"
                size={120}
                color={Colors[scheme].border}
              />
              <Text style={styles.emptyScreenText}>
                Keine Rezepte gefunden
              </Text>
              <StyledButtonPressable
                onPress={deleteSearch}
                text='Suche löschen'
                icon='search'
                color='default'
                customWidth={true}
              />
            </View>
            </TouchableWithoutFeedback>
            :
            <SectionList
              renderItem={({ item }) =>
                <Item item={item} />}
              sections={recipeListItems}
              keyExtractor={(item, index) => item.category + index}
              renderSectionHeader={({ section: { categoryName, data } }) => {
                if (data.length > 0) {
                  return <StyledHeader text={categoryName} count={data.length} />
                }
                return null;
              }}
              stickySectionHeadersEnabled={true}
              contentInset={{top: -15}}
            />
          }
        </View>
      }
    </SafeAreaView>
  );
}
