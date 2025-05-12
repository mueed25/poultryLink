import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView, View } from 'react-native';
import { Button, Text, Title } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { Input } from '../../components/Input';
import { resetPassword } from '../../services/authService';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);

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

    return isValid;
  };

  const handleResetPassword = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      await resetPassword(email);
      setIsEmailSent(true);
    } catch (error) {
      console.error('Password reset error:', error);
      setEmailError('Failed to send password reset email. Please check your email address.');
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

          <Title style={styles.title}>
            {isEmailSent ? t('check Your Email') : t('auth.forgotPassword')}
          </Title>

          {isEmailSent ? (
            <View style={styles.formContainer}>
              <Text style={styles.instructionText}>
                {t('auth.resetPasswordInstructions')}
              </Text>

              <Button
                mode="contained"
                onPress={navigateToSignIn}
                style={styles.button}
                labelStyle={styles.buttonLabel}
              >
                {t('auth.backToSignIn')}
              </Button>
            </View>
          ) : (
            <View style={styles.formContainer}>
              <Text style={styles.instructionText}>
                {t('auth.forgotPasswordInstructions')}
              </Text>

              <Input
                label={t('auth.email')}
                value={email}
                onChangeText={setEmail}
                error={emailError}
                keyboardType="email-address"
                autoCapitalize="none"
                required
              />

              <Button
                mode="contained"
                onPress={handleResetPassword}
                loading={loading}
                disabled={loading}
                style={styles.button}
                labelStyle={styles.buttonLabel}
              >
                {loading ? t('common.loading') : t('auth.resetPassword')}
              </Button>

              <View style={styles.signInContainer}>
                <Text>{t('auth.rememberPassword')}</Text>
                <TouchableOpacity onPress={navigateToSignIn}>
                  <Text style={styles.signInLink}>{t('auth.signIn')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
  instructionText: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#4A5568',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#276749',
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
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

export default ForgotPasswordScreen; 