import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { updateConsultationFeedback } from '../services/HealthConsultantService';

interface HealthResponseCardProps {
  consultationId: string;
  response: {
    suspectedIssue: string;
    actionPlan: string;
    naturalRemedy: string;
    tip: string;
  };
  onFeedback?: (isHelpful: boolean) => void;
}

export const HealthResponseCard: React.FC<HealthResponseCardProps> = ({
  consultationId,
  response,
  onFeedback,
}) => {
  const [feedbackGiven, setFeedbackGiven] = React.useState<boolean | null>(null);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleFeedback = async (isHelpful: boolean) => {
    try {
      await updateConsultationFeedback(consultationId, isHelpful);
      setFeedbackGiven(isHelpful);
      onFeedback?.(isHelpful);
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  const renderSection = (icon: string, title: string, content: string) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <MaterialIcons name={icon as any} size={24} color="#276749" />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Text style={styles.sectionContent}>{content}</Text>
    </View>
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {renderSection('science', 'Suspected Issue', response.suspectedIssue)}
      {renderSection('medical-services', 'Action Plan', response.actionPlan)}
      {renderSection('eco', 'Natural Remedy', response.naturalRemedy)}
      {renderSection('lightbulb', 'Tip', response.tip)}

      {!feedbackGiven && (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackText}>Was this helpful?</Text>
          <View style={styles.feedbackButtons}>
            <TouchableOpacity
              style={styles.feedbackButton}
              onPress={() => handleFeedback(true)}
            >
              <MaterialIcons name="thumb-up" size={24} color="#276749" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.feedbackButton}
              onPress={() => handleFeedback(false)}
            >
              <MaterialIcons name="thumb-down" size={24} color="#E53E3E" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#276749',
    marginLeft: 8,
  },
  sectionContent: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
  },
  feedbackContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 8,
  },
  feedbackButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  feedbackButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F7FAFC',
  },
}); 