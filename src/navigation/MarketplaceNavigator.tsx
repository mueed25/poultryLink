import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import MarketplaceScreen from '../screens/Marketplace/MarketplaceScreen';
import ProductDetailScreen from '../screens/Marketplace/ProductDetailScreen';
import CartScreen from '../screens/Marketplace/CartScreen';

// Define navigation types
export type MarketplaceStackParamList = {
  MarketplaceHome: undefined;
  ProductDetailScreen: {
    product: {
      id: string;
      name: string;
      price: number;
      image: string;
      seller: string;
      rating: number;
      ratingCount: number;
      isHot: boolean;
      description?: string;
      features?: string[];
      category: string;
      location: string;
    }
  };
  CartScreen: undefined;
};

const Stack = createStackNavigator<MarketplaceStackParamList>();

const MarketplaceNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="MarketplaceHome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="MarketplaceHome" 
        component={MarketplaceScreen} 
      />
      <Stack.Screen 
        name="ProductDetailScreen" 
        component={ProductDetailScreen} 
      />
      <Stack.Screen 
        name="CartScreen" 
        component={CartScreen} 
      />
    </Stack.Navigator>
  );
};

export default MarketplaceNavigator; 