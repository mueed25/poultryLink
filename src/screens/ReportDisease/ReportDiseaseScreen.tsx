import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { HealthResponseCard } from '../../components/HealthResponseCard';
import {
  analyzeHealthIssue,
  saveConsultation,
  getAnonymousUsageCount,
} from '../../services/HealthConsultantService';

export const ReportDiseaseScreen = () => {
  const { user } = useAuth();
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [consultation, setConsultation] = useState<any>(null);
  const [anonymousUsageCount, setAnonymousUsageCount] = useState(0);

  useEffect(() => {
    checkAnonymousUsage();
  }, []);

  const checkAnonymousUsage = async () => {
    if (!user) {
      const count = await getAnonymousUsageCount();
      setAnonymousUsageCount(count);
    }
  };

  const handleSubmit = async () => {
    if (!userInput.trim()) {
      Alert.alert('Error', 'Please describe the health issue');
      return;
    }

    if (!user && anonymousUsageCount >= 2) {
      Alert.alert(
        'Sign In Required',
        'You have used your free consultations. Please sign in to continue.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Sign In',
            onPress: () => {
              // Navigate to sign in screen
            },
          },
        ]
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await analyzeHealthIssue(userInput);
      const consultationData = {
        userId: user?.uid || null,
        question: userInput,
        response,
      };
      const savedConsultation = await saveConsultation(consultationData);
      setConsultation(savedConsultation);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (isHelpful: boolean) => {
    if (isHelpful) {
      // Show confetti animation or success message
      Alert.alert('Thank you!', 'Your feedback helps us improve our service.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Health Assistant</Text>
          <Text style={styles.subtitle}>
            Describe any health issues. Our AI consultant will help you.
          </Text>
                </View>

        {!user && (
          <View style={styles.usageInfo}>
            <Text style={styles.usageText}>
              Free consultations remaining: {2 - anonymousUsageCount}
            </Text>
                      </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Describe the symptoms or health issues you're observing..."
            value={userInput}
            onChangeText={setUserInput}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
                </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <MaterialIcons name="send" size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Ask Consultant</Text>
            </>
          )}
        </TouchableOpacity>

        {consultation && (
          <HealthResponseCard
            consultationId={consultation.id}
            response={consultation.response}
            onFeedback={handleFeedback}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#276749',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4A5568',
    lineHeight: 24,
  },
  usageInfo: {
    backgroundColor: '#E6FFFA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  usageText: {
    color: '#276749',
    fontSize: 14,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButton: {
    backgroundColor: '#276749',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});