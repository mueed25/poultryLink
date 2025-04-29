import React from 'react';
import { StyleSheet, SafeAreaView, TouchableOpacity, Image, View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';

type WelcomeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Welcome'>;

const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  const handleSignIn = () => {
    navigation.navigate('SignIn');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../../assets/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>Welcome to PoultryLink</Text>
        <Text style={styles.subtitle}>
          Your all-in-one platform for poultry farming management
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSignIn}
            style={[styles.button, styles.signInButton]}
            labelStyle={styles.buttonLabel}
          >
            Sign In
          </Button>

          <Button
            mode="outlined"
            onPress={handleSignUp}
            style={[styles.button, styles.signUpButton]}
            labelStyle={[styles.buttonLabel, styles.signUpButtonLabel]}
          >
            Sign Up
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#276749',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 48,
    paddingHorizontal: 32,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    width: '100%',
    paddingVertical: 8,
  },
  signInButton: {
    backgroundColor: '#276749',
  },
  signUpButton: {
    borderColor: '#276749',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  signUpButtonLabel: {
    color: '#276749',
  },
});

export default WelcomeScreen; 