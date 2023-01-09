/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';

import { Colors, NavigationColors } from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import NotFoundScreen from '../screens/NotFoundScreen';
import ShoppingList from '../screens/ShoppingList';
import Recipes from '../screens/Recipes';
import Settings from '../screens/Settings';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../../types';
import LinkingConfiguration from './LinkingConfiguration';
import ModalNewRecipe from '../screens/ModalNewRecipe';
import ModalDetailRecipe from '../screens/ModalDetailRecipe';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme ? NavigationColors[colorScheme] : NavigationColors['light']}>
      <RootNavigator />
    </NavigationContainer>
  );
}

function getHeaderTitle(route: any): string {
  const routeName = getFocusedRouteNameFromRoute(route);

  switch (routeName) {
    case 'ShoppingList':
      return 'Einkaufsliste';
    case 'Recipes':
      return 'Meine Rezepte';
    case 'Settings':
      return 'Einstellungen';
  }
  return 'Einkaufsliste';
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const colorScheme = useColorScheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[colorScheme].tint,
        },
        headerTintColor: Colors[colorScheme].textOnTint,
      }}>
      <Stack.Group>
        <Stack.Screen name="Root" component={BottomTabNavigator} options={({ route, navigation }) => ({
          title: getHeaderTitle(route),
          headerRight: () => {
            return <Pressable
              onPress={() => getHeaderTitle(route) === 'Meine Rezepte' ? navigation.navigate('ModalNewRecipe') : null}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                width: 36,
                height: 36
              })}>
              {getHeaderTitle(route) === 'Meine Rezepte'
                ? <MaterialIcons
                  name="add"
                  size={36}
                  color={Colors[colorScheme].textOnTint} />
                : <></>}
            </Pressable>
          }
        })} />
        <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="ModalNewRecipe" component={ModalNewRecipe}
          options={({ navigation }) => ({
            title: 'Neues Rezept'
          })}
        />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'card' }}>
        <Stack.Screen name="ModalDetailRecipe" component={ModalDetailRecipe}
          options={({ navigation, route }) => ({
            headerBackTitle: ''
          })}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="ShoppingList"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: false
      }}>
      <BottomTab.Screen
        name="ShoppingList"
        component={ShoppingList}
        options={({ navigation }: RootTabScreenProps<'ShoppingList'>) => ({
          title: 'Einkaufsliste',
          tabBarIcon: ({ color }) => <TabBarIcon name="shopping-cart" color={color} />,
        })}
      />
      <BottomTab.Screen
        name="Recipes"
        component={Recipes}
        options={({ navigation }: RootTabScreenProps<'Recipes'>) => ({
          headerTitle: 'Meine Rezepte',
          tabBarIcon: ({ color }) => <TabBarIcon name="fastfood" color={color} />
        })}
      />
      <BottomTab.Screen
        name="Settings"
        component={Settings}
        options={{
          title: 'Einstellungen',
          tabBarIcon: ({ color }) => <TabBarIcon name="settings" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
}) {
  return <MaterialIcons size={30} style={{ marginBottom: -3 }} {...props} />;
}
