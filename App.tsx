import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, useColorScheme, SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/config/firebase';
import { AuthProvider } from './src/contexts/AuthContext';
import { CartProvider } from './src/contexts/CartContext';
import RootNavigator from './src/navigation';
import { CombinedDefaultTheme } from './src/theme/theme';

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setIsInitialized(true);
    });

    return () => unsubscribe();
  }, []);

  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F7FAFC" />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={CombinedDefaultTheme.colors.primary} />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7FAFC" />
      <SafeAreaView style={styles.safeArea}>
        <PaperProvider theme={CombinedDefaultTheme}>
          <AuthProvider>
            <CartProvider>
              <RootNavigator />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
