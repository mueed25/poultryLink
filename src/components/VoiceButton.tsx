import React from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

interface VoiceButtonProps {
  onPress: () => void;
  isRecording: boolean;
  size?: number;
  style?: any;
}

export const VoiceButton = ({ onPress, isRecording, size = 50, style }: VoiceButtonProps) => {
  return (
    <FAB
      icon="microphone"
      color="#FFFFFF"
      style={[
        styles.fab, 
        isRecording ? styles.recording : styles.notRecording,
        style
      ]}
      size="medium"
      onPress={onPress}
      customSize={size}
    />
  );
};

const styles = StyleSheet.create({
  fab: {
    margin: 10,
  },
  recording: {
    backgroundColor: '#E53E3E',
    shadowColor: '#FF0000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  notRecording: {
    backgroundColor: '#276749',
  },
}); 