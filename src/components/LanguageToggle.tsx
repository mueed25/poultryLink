import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Menu, Divider, IconButton } from 'react-native-paper';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface LanguageToggleProps {
  onChangeLanguage: (language: 'en' | 'ha' | 'yo') => void;
  currentLanguage: 'en' | 'ha' | 'yo';
}

export const LanguageToggle = ({ onChangeLanguage, currentLanguage }: LanguageToggleProps) => {
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ha', label: 'Hausa' },
    { code: 'yo', label: 'Yoruba' },
  ];

  const getLanguageLabel = () => {
    switch (currentLanguage) {
      case 'en': return 'EN';
      case 'ha': return 'HA';
      case 'yo': return 'YO';
      default: return 'EN';
    }
  };

  return (
    <View style={styles.container}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <Button
            mode="contained"
            onPress={openMenu}
            style={styles.languageButton}
            labelStyle={styles.languageButtonText}
          >
            {getLanguageLabel()}
          </Button>
        }
      >
        {languages.map((lang, index) => (
          <React.Fragment key={lang.code}>
            <Menu.Item
              leadingIcon={currentLanguage === lang.code ? "check" : undefined}
              onPress={() => {
                onChangeLanguage(lang.code as 'en' | 'ha' | 'yo');
                closeMenu();
              }}
              title={lang.label}
            />
            {index < languages.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageButton: {
    borderRadius: 20,
    backgroundColor: '#276749',
    paddingHorizontal: 8,
    minWidth: 45,
  },
  languageButtonText: {
    fontSize: 14,
  }
}); 