import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CacProvider } from './cac/CacContext';
import LandingScreen from './screen/LandingScreen';
import LoginScreen from './screen/LoginScreen';
import HomeScreen from './screen/HomeScreen';
import CacHomeScreen from './screen/cac/CacHomeScreen';
import CacCatalogScreen from './screen/cac/CacCatalogScreen';
import CacCheckoutScreen from './screen/cac/CacCheckoutScreen';
import CacOrdersScreen from './screen/cac/CacOrdersScreen';
import CacB2BScreen from './screen/cac/CacB2BScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <CacProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="CacHome" component={CacHomeScreen} />
            <Stack.Screen name="CacCatalog" component={CacCatalogScreen} />
            <Stack.Screen name="CacCheckout" component={CacCheckoutScreen} />
            <Stack.Screen name="CacOrders" component={CacOrdersScreen} />
            <Stack.Screen name="CacB2B" component={CacB2BScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </CacProvider>
    </SafeAreaProvider>
  );
}
