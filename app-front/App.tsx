import React, { useContext } from 'react';
import { ThemeProvider } from 'styled-components';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator } from 'react-native';

import { RootStackParamList } from './src/utils/Types'; // Importar a tipagem das rotas

import theme from './src/theme';
import Login from './src/screens/Login';
import FormScreen from './src/screens/Form';
import List from './src/screens/List';
import Profile from './src/screens/Profile';
import Details from './src/screens/Details';
import { AuthProvider, AuthContext } from './src/context/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();
const HomeStack = createNativeStackNavigator<RootStackParamList>();

function getTabIcon(routeName: string, focused: boolean) {
  switch (routeName) {
    case 'Home':
      return focused ? 'home' : 'home-outline';
    case 'Profile':
      return focused ? 'person' : 'person-outline';
    default:
      return 'ellipse-outline';
  }
}

function Auth() {
  const { userToken, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.COLORS.GREEN} />
      </View>
    );
  }

  if (!userToken) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.COLORS.RED} />
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          const iconName = getTabIcon(route.name, focused);
          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: theme.COLORS.GREEN,
        tabBarInactiveTintColor: theme.COLORS.GRAY_03,
        tabBarStyle: {
          backgroundColor: theme.COLORS.GRAY_01,
        },
        tabBarLabelStyle: {
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="Home">
        {() => (
          <HomeStack.Navigator screenOptions={{ headerShown: false }}>
            <HomeStack.Screen name="List" component={List} />
            <HomeStack.Screen name="Details" component={Details} />
          </HomeStack.Navigator>
        )}
      </Tab.Screen>
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <StatusBar style="auto" />
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="FormScreen" component={FormScreen} />
            <Stack.Screen name="Auth" component={Auth} />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}
