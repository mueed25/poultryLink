import React, { useState } from 'react';
import { Alert, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView, View } from 'react-native';
import { Button, Text, Title, Surface, Card, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { Input } from '../../components/Input';
import { useAuth } from '../../contexts/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';


type SignInScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignIn'>;

const SignInScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<SignInScreenNavigationProp>();
  const { user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const { login, loginWithGoogle } = useAuth()
  const [googleLoginLoading, setGoogleLoginLoading] = useState(false);

  const validateInputs = () => {
    let isValid = true;

    // Validate email
    if (!email) {
      setEmailError(t('email Required'));
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(t('valid Email'));
      isValid = false;
    } else {
      setEmailError('');
    }

    // Validate password
    if (!password) {
      setPasswordError(t('password Required'));
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSignIn = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    setGeneralError('');
    
    try {
      await login(email, password);
      // Navigation will be handled by the auth state listener
    } catch (error: any) {
      const authError = error as Error;
      Alert.alert('Login Failed', authError.message);
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignUp = () => {
    navigation.navigate('SignUp');
  };

  const navigateToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setGoogleLoginLoading(true);
      await loginWithGoogle();
      // Auth state listener will handle navigation
    } catch (error) {
      const authError = error as Error;
      Alert.alert('Google Login Failed', authError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Image
            source={require('../../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Title style={styles.title}>{t('welcome Back')}</Title>

          {generalError ? (
            <Surface style={styles.errorContainer}>
              <Text style={styles.errorText}>{generalError}</Text>
            </Surface>
          ) : null}

          <View style={styles.formContainer}>
            <Input
              label={t('email')}
              value={email}
              onChangeText={setEmail}
              error={emailError}
              keyboardType="email-address"
              autoCapitalize="none"
              required
            />

            <Input
              label={t('password')}
              value={password}
              onChangeText={setPassword}
              error={passwordError}
              secureTextEntry
              required
            />

            <TouchableOpacity onPress={navigateToForgotPassword} style={styles.forgotPasswordLink}>
              <Text style={styles.forgotPasswordText}>{t('forgot Password')}</Text>
            </TouchableOpacity>

            <Button
              mode="contained"
              onPress={handleSignIn}
              loading={loading}
              disabled={loading}
              style={styles.signInButton}
              labelStyle={styles.buttonLabel}
            >
              {loading ? t('loading') : t('sign In')}
            </Button>

            <View style={styles.dividerContainer}>
              <Divider style={styles.divider} />
              <Text style={styles.dividerText}>{t('or Continue With')}</Text>
              <Divider style={styles.divider} />
            </View>

            <View style={{ width: '100%' }}>
                <Button
                  mode="contained"
                  onPress={handleGoogleLogin}
                  loading={googleLoginLoading}
                  disabled={googleLoginLoading}
                  style={styles.signInButton}
                  labelStyle={styles.buttonLabel}
                  icon={({ size, color }) => (
                    <MaterialCommunityIcons name="google" size={size} color={color} />
                  )}
                >
                  {googleLoginLoading ? t('loading..') : t('Sign in with Google')}
                </Button>


            </View>

            <View style={styles.signUpContainer}>
              <Text>{t('dont Have Account')}</Text>
              <TouchableOpacity onPress={navigateToSignUp}>
                <Text style={styles.signUpLink}>{t('signUp')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    color: '#276749',
    marginTop: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FED7D7',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    marginBottom: 16,
  },
  errorText: {
    color: '#E53E3E',
  },
  formContainer: {
    width: '100%',
    marginTop: 24,
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginTop: 4,
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: '#276749',
  },
  signInButton: {
    marginTop: 16,
    backgroundColor: '#276749',
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 8,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    elevation: 1,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  signUpLink: {
    color: '#276749',
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default SignInScreen; 