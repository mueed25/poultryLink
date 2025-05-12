import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSnackbar } from '../contexts/SnackbarContext';

const Snackbar = () => {
  const { message, type, visible, hideSnackbar } = useSnackbar();
  const translateY = React.useRef(new Animated.Value(100)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        hideSnackbar();
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      Animated.spring(translateY, {
        toValue: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, hideSnackbar]);

  if (!visible) return null;

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#48BB78';
      case 'error':
        return '#E53E3E';
      case 'warning':
        return '#DD6B20';
      default:
        return '#4299E1';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: getBackgroundColor(), transform: [{ translateY }] },
      ]}
    >
      <View style={styles.content}>
        <MaterialIcons name={getIcon()} size={24} color="#FFFFFF" />
        <Text style={styles.message}>{message}</Text>
      </View>
      <TouchableOpacity onPress={hideSnackbar} style={styles.closeButton}>
        <MaterialIcons name="close" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1000,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
});

export default Snackbar; 