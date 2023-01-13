import { Platform, Pressable, SafeAreaView, SectionList, StatusBar, StyleSheet, Switch } from 'react-native';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../../types';
import { useState } from 'react';
import { Colors } from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { StyledHeader } from '../components/StyledHeader';
const DEFAULTDATA = [
  {
    categoryName: "Anzeige",
    data: [
      {
        title: 'Dark mode',
        state: true,
      },
      {
        title: 'Bilder anzeigen',
        state: false,
      },
    ]
  },
  {
    categoryName: "",
    data: [
    ]
  },
  {
    categoryName: "",
    data: []
  },
];
export default function Settings({ navigation }: RootTabScreenProps<'Settings'>) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [settings, setSettings] = useState(DEFAULTDATA);
  const scheme = useColorScheme();
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: StatusBar.currentHeight,
    },
    title: {
      fontSize: 18,
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: '80%',
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
  });
  const Item = ({ item }: { item: any }) => {
    return (
      <Pressable
        // onPress={() => onItemClick(item)}
        style={({ pressed }) => ({
          backgroundColor: pressed
            ? Colors[scheme].tintBackground
            : Colors[scheme].background
        })}>
        <View style={styles.item}>
          <Text style={styles.title}>{item.title}</Text>
          <Switch
            // trackColor={{ false: "#767577", true: "#81B0FF" }}
            thumbColor={isEnabled && Platform.OS === 'android' ? Colors[scheme].tint : "#fff"}
            // onValueChange={}
            value={item.state}
          />
        </View>
      </Pressable>)
  };
  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        renderItem={({ item }) =>
          <Item item={item} />}
        sections={DEFAULTDATA}
        keyExtractor={(item, index) => index.toString()}
        renderSectionHeader={({ section: { categoryName, data } }) => {
          if (data.length > 0) {
            return <StyledHeader text={categoryName} />
          }
          return null;
        }}
      />
    </SafeAreaView>
  );
}
/* TODO:
mögliche optionen:
- rezept-kategorien aus/einblenden
- rezept-kategorien reihenfolge ändern
- dark-light mode switch
- bilder aus/einblenden
- favoriten funktion aus/einblenden
- größere schrift für kochen (rezept) ein/ausschalten
*/