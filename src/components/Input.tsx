import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, HelperText, Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  required?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: 'email' | 'password' | 'off' | 'name' | 'tel';
  placeholder?: string;
  style?: any;
  multiline?: boolean;
  numberOfLines?: number;
}

export const Input = ({
  label,
  value,
  onChangeText,
  error,
  required = false,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  placeholder,
  style,
  multiline = false,
  numberOfLines = 1,
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={[styles.container, style]}>
      <TextInput
        label={required ? `${label} *` : label}
        value={value}
        onChangeText={onChangeText}
        error={!!error}
        secureTextEntry={secureTextEntry && !showPassword}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        placeholder={placeholder}
        mode="outlined"
        style={styles.input}
        multiline={multiline}
        numberOfLines={numberOfLines}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        right={
          secureTextEntry ? (
            <TextInput.Icon 
              icon={showPassword ? 'eye-off' : 'eye'} 
              onPress={toggleShowPassword} 
            />
          ) : null
        }
        {...props}
      />
      {error ? (
        <HelperText type="error" visible={!!error}>
          {error}
        </HelperText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
  },
}); 