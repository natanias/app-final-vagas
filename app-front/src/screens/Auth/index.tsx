import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { RootStackParamList } from '../../utils/Types';

import List from '../List';
import Details from '../Details';
import Profile from '../Profile';
import theme from '../../theme';

// Configuração dos navegadores
const Tab = createBottomTabNavigator<RootStackParamList>();
const HomeStack = createNativeStackNavigator<RootStackParamList>();

export default function Auth({ navigation }) {
  const { userToken, isLoading } = useContext(AuthContext);

  // Mostra um spinner enquanto verifica a autenticação
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.COLORS.GREEN} />
      </View>
    );
  }

  // Redireciona para login caso o usuário não esteja autenticado
  if (!userToken) {
    navigation.replace('Login');
    return null;
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          const iconName =
            route.name === 'Home'
              ? focused
                ? 'home'
                : 'home-outline'
              : focused
              ? 'person'
              : 'person-outline';
          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: theme.COLORS.GREEN,
        tabBarInactiveTintColor: theme.COLORS.GRAY_03,
        tabBarStyle: {
          backgroundColor: theme.COLORS.GRAY_01,
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
