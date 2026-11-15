// App.js
// Mis Finanzas
// Tabs (Inicio, Agregar, Movimientos, Estadísticas) + Stack para el detalle de un movimiento
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import AppLayout from './components/AppLayout';
import { ExpenseProvider } from './context/ExpenseContext';

import HomeScreen from './screens/HomeScreen';
import AddAssetsScreen from './screens/AddAssetsScreen';
import TransactionScreen from './screens/TransactionScreen';
import TransactionDetailScreen from './screens/TransactionDetailScreen';
import StatsScreen from './screens/StatsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: 'rgba(80, 3, 136, 1)',
    primary: '#C0C0C0',
    background: '#1ABC9C',
  },
};

// HOC: envuelve cada pantalla con AppLayout (degradado de fondo)
function withAppLayout(Component) {
  return function Wrapper(props) {
    return (
      <AppLayout>
        <Component {...props} />
      </AppLayout>
    );
  };
}

const HomeScreenWithLayout = withAppLayout(HomeScreen);
const AddAssetsScreenWithLayout = withAppLayout(AddAssetsScreen);
const TransactionScreenWithLayout = withAppLayout(TransactionScreen);
const TransactionDetailScreenWithLayout = withAppLayout(TransactionDetailScreen);
const StatsScreenWithLayout = withAppLayout(StatsScreen);

function getTabIcon(routeName, focused) {
  if (routeName === 'Inicio') return focused ? 'home' : 'home-outline';
  if (routeName === 'Agregar') return focused ? 'add-circle' : 'add-circle-outline';
  if (routeName === 'Movimientos') return focused ? 'wallet' : 'wallet-outline';
  if (routeName === 'Estadísticas') return focused ? 'bar-chart' : 'bar-chart-outline';
  return 'ellipse-outline';
}

// Stack para la pestaña Movimientos (lista y detalle)
function TransactionStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Transactions'
        component={TransactionScreenWithLayout}
        options={{ title: 'Movimientos' }}
      />
      <Stack.Screen
        name='TransactionDetail'
        component={TransactionDetailScreenWithLayout}
        options={{ title: 'Detalle' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    // El Provider envuelve toda la app para que todas las pantallas compartan los movimientos
    <ExpenseProvider>
      <NavigationContainer theme={MyTheme}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarShowLabel: true,
            tabBarActiveTintColor: '#5F9EA0',
            tabBarInactiveTintColor: '#5F9EA0',
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={getTabIcon(route.name, focused)}
                size={size || 24}
                color={color}
              />
            ),
          })}
        >
          <Tab.Screen name='Inicio' component={HomeScreenWithLayout} />
          <Tab.Screen name='Agregar' component={AddAssetsScreenWithLayout} />
          <Tab.Screen name='Movimientos' component={TransactionStack} />
          <Tab.Screen name='Estadísticas' component={StatsScreenWithLayout} />
        </Tab.Navigator>
      </NavigationContainer>
    </ExpenseProvider>
  );
}
