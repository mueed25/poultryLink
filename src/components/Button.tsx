import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';

interface ButtonProps {
  label?: string;
  children?: React.ReactNode;
  mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
  onPress?: () => void;
  style?: any;
  labelStyle?: any;
  disabled?: boolean;
  loading?: boolean;
  color?: string;
  dark?: boolean;
}

export const Button = ({ 
  label, 
  children, 
  mode = 'contained', 
  color = '#276749', 
  style,
  ...props 
}: ButtonProps) => {
  return (
    <PaperButton
      mode={mode}
      style={[styles.button, style]}
      labelStyle={styles.label}
      buttonColor={color}
      {...props}
    >
      {label || children}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 