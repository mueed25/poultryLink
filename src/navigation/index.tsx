import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View, useColorScheme } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';
import { useAuth } from '../contexts/AuthContext';
import { CombinedDefaultTheme } from '../theme/theme';
import { RootStackParamList } from './types';

// Create a root stack navigator
const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { user, loading } = useAuth();
  const colorScheme = useColorScheme();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7FAFC' }}>
        <ActivityIndicator size="large" color={CombinedDefaultTheme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer
      theme={{
        ...CombinedDefaultTheme,
        dark: colorScheme === 'dark',
        colors: {
          ...CombinedDefaultTheme.colors,
          background: colorScheme === 'dark' ? '#121212' : CombinedDefaultTheme.colors.background,
          card: colorScheme === 'dark' ? '#1E1E1E' : CombinedDefaultTheme.colors.surface,
          text: colorScheme === 'dark' ? '#FFFFFF' : CombinedDefaultTheme.colors.text,
          border: colorScheme === 'dark' ? '#2C2C2C' : '#E2E8F0',
        },
      }}
    >
      {user === null ? <AuthNavigator /> : <AppNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigator; 