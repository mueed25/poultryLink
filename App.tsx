import React from 'react';
import { View, useColorScheme, SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/contexts/AuthContext';
import { CartProvider } from './src/contexts/CartContext';
import { SnackbarProvider } from './src/contexts/SnackbarContext';
import { RootNavigator } from './src/navigation/index'
import { CombinedDefaultTheme } from './src/theme/theme';

export default function App() {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7FAFC" />
      <SafeAreaView style={styles.safeArea}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  safeArea: {
    flex: 1,
    paddingTop: 8,
  },
});
