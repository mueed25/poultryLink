import React from 'react';
import { StyleSheet, SafeAreaView, Image, View } from 'react-native';
import { Text, Title, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { LanguageToggle } from '../../components/LanguageToggle';

type LanguageSelectScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'LanguageSelect'>;

const LanguageSelectScreen = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<LanguageSelectScreenNavigationProp>();

  const handleLanguageChange = (language: 'en' | 'ha' | 'yo') => {
    i18n.changeLanguage(language);
  };

  const handleContinue = () => {
    navigation.navigate('SignIn');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.languageToggleContainer}>
          <LanguageToggle 
            onChangeLanguage={handleLanguageChange} 
            currentLanguage={i18n.language as 'en' | 'ha' | 'yo'}
          />
        </View>

        <Image
          source={require('../../../assets/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Title style={styles.heading}>
          {t('onboarding.welcome')}
        </Title>

        <Text style={styles.description}>
          {t('onboarding.welcomeDescription')}
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleContinue}
            style={styles.button}
            labelStyle={styles.buttonText}
          >
            {t('onboarding.getStarted')}
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
    padding: 24,
    alignItems: 'center',
  },
  languageToggleContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  logo: {
    width: 150,
    height: 150,
  },
  heading: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 32,
    color: '#276749',
  },
  description: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 24,
    marginTop: 8,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 24,
  },
  button: {
    backgroundColor: '#276749',
    borderRadius: 8,
    paddingVertical: 8,
  },
  buttonText: {
    fontSize: 16,
  }
});

export default LanguageSelectScreen; 