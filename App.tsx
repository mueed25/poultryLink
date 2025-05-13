import React from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/contexts/AuthContext';
import { CartProvider } from './src/contexts/CartContext';
import { SnackbarProvider } from './src/contexts/SnackbarContext';
import RootNavigator from './src/navigation';
import { CombinedDefaultTheme } from './src/theme/theme';

export default function App() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#F7FAFC" />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <PaperProvider theme={CombinedDefaultTheme}>
          <AuthProvider>
            <CartProvider>
              <SnackbarProvider>
                <RootNavigator />
              </SnackbarProvider>
            </CartProvider>
          </AuthProvider>
        </PaperProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
});
