import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView, View } from 'react-native';
import { Button, Text, Title, Surface, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { Input } from '../../components/Input';
import { signUp } from '../../services/authService';

type SignUpScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignUp'>;

const SignUpScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<SignUpScreenNavigationProp>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateInputs = () => {
    let isValid = true;

    // Validate name
    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }

    // Validate email
    if (!email) {
      setEmailError(t('auth.emailRequired'));
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(t('auth.validEmail'));
      isValid = false;
    } else {
      setEmailError('');
    }

    // Validate password
    if (!password) {
      setPasswordError(t('auth.passwordRequired'));
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError(t('auth.passwordRequirements'));
      isValid = false;
    } else {
      setPasswordError('');
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      setConfirmPasswordError(t('auth.passwordsDoNotMatch'));
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    return isValid;
  };

  const handleSignUp = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      await signUp(email, password, name, 'farmer');
      navigation.navigate('FarmProfile');
    } catch (error: any) {
      console.error('Sign up error:', error);
      setEmailError('Account creation failed. This email might be in use already.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignIn = () => {
    navigation.navigate('SignIn');
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

          <Title style={styles.title}>{t('sign Up')}</Title>

          <View style={styles.formContainer}>
            <Input
              label={t('name')}
              value={name}
              onChangeText={setName}
              error={nameError}
              autoCapitalize="words"
              required
            />

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

            <Input
              label={t('confirm Password')}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={confirmPasswordError}
              secureTextEntry
              required
            />

            <Text style={styles.passwordRequirements}>
              {t('password Requirements')}
            </Text>

            <Button
              mode="contained"
              onPress={handleSignUp}
              loading={loading}
              disabled={loading}
              style={styles.signUpButton}
              labelStyle={styles.buttonLabel}
            >
              {loading ? t('loading') : t('create Account')}
            </Button>

            <View style={styles.dividerContainer}>
              <Divider style={styles.divider} />
              <Text style={styles.dividerText}>{t('or Continue With')}</Text>
              <Divider style={styles.divider} />
            </View>

            <View style={styles.socialContainer}>
              {/* Social login buttons would go here */}
            </View>

            <View style={styles.signInContainer}>
              <Text>{t('already Have Account')}</Text>
              <TouchableOpacity onPress={navigateToSignIn}>
                <Text style={styles.signInLink}>{t('signIn')}</Text>
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
  formContainer: {
    width: '100%',
    marginTop: 24,
  },
  passwordRequirements: {
    fontSize: 12,
    color: '#718096',
    marginTop: 8,
    marginBottom: 16,
  },
  signUpButton: {
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
    color: '#718096',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  signInLink: {
    color: '#276749',
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default SignUpScreen; 