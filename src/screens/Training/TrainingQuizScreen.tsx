import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Surface, ProgressBar, Button, IconButton, Chip, Badge } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  image?: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  requirements: string[];
  unlocked: boolean;
}

const mockQuestions: Question[] = [
  {
    id: '1',
    question: 'What is the ideal temperature range for broiler chickens in their first week?',
    options: [
      '32-35°C',
      '28-30°C',
      '25-27°C',
      '20-22°C'
    ],
    correctAnswer: 0,
    explanation: 'Broiler chickens require higher temperatures (32-35°C) in their first week to maintain body temperature as they cannot regulate it effectively.',
    image: 'https://example.com/temperature-chart.jpg'
  },
  {
    id: '2',
    question: 'Which of these is NOT a common poultry disease?',
    options: [
      'Newcastle Disease',
      'Avian Influenza',
      'Foot and Mouth Disease',
      'Infectious Bronchitis'
    ],
    correctAnswer: 2,
    explanation: 'Foot and Mouth Disease affects cloven-hoofed animals, not poultry. The other options are common poultry diseases.',
  },
  // Add more questions as needed
];

const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Poultry Health Expert',
    description: 'Mastered poultry health and disease prevention',
    image: 'https://example.com/health-badge.png',
    requirements: [
      'Complete all health-related quizzes',
      'Score 90% or above in disease prevention',
      'Complete 5 practice scenarios'
    ],
    unlocked: false
  },
  {
    id: '2',
    name: 'Nutrition Specialist',
    description: 'Expert in poultry nutrition and feed management',
    image: 'https://example.com/nutrition-badge.png',
    requirements: [
      'Complete nutrition module',
      'Score 85% or above in feed formulation',
      'Submit 3 successful feed plans'
    ],
    unlocked: false
  },
  // Add more badges as needed
];

const TrainingQuizScreen = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [badges, setBadges] = useState<Badge[]>(mockBadges);

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, quizCompleted]);

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    if (index === mockQuestions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }
    
    setTimeout(() => {
      setShowExplanation(true);
    }, 1000);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeLeft(30);
    } else {
      setQuizCompleted(true);
      checkBadgeUnlock();
    }
  };

  const checkBadgeUnlock = () => {
    const scorePercentage = (score / mockQuestions.length) * 100;
    if (scorePercentage >= 90) {
      setBadges(prev => prev.map(badge => 
        badge.id === '1' ? { ...badge, unlocked: true } : badge
      ));
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizCompleted(false);
    setTimeLeft(30);
  };

  const renderQuestion = () => {
    const question = mockQuestions[currentQuestion];
    
    return (
      <View style={styles.questionContainer}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionNumber}>
            Question {currentQuestion + 1}/{mockQuestions.length}
          </Text>
          <Text style={styles.timer}>{timeLeft}s</Text>
        </View>
        
        <Text style={styles.questionText}>{question.question}</Text>
        
        {question.image && (
          <Image
            source={{ uri: question.image }}
            style={styles.questionImage}
            resizeMode="cover"
          />
        )}
        
        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                selectedAnswer === index && styles.selectedOption,
                selectedAnswer !== null && 
                index === question.correctAnswer && 
                styles.correctOption,
                selectedAnswer !== null && 
                selectedAnswer === index && 
                selectedAnswer !== question.correctAnswer && 
                styles.wrongOption
              ]}
              onPress={() => handleAnswerSelect(index)}
              disabled={selectedAnswer !== null}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {showExplanation && (
          <View style={styles.explanationContainer}>
            <Text style={styles.explanationTitle}>Explanation:</Text>
            <Text style={styles.explanationText}>{question.explanation}</Text>
          </View>
        )}
        
        {showExplanation && (
          <Button
            mode="contained"
            onPress={handleNextQuestion}
            style={styles.nextButton}
          >
            {currentQuestion < mockQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </Button>
        )}
      </View>
    );
  };

  const renderResults = () => {
    const scorePercentage = (score / mockQuestions.length) * 100;
    const timeSpent = (30 * mockQuestions.length) - timeLeft;
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    const performanceLevel = scorePercentage >= 90 ? 'Excellent' : 
                            scorePercentage >= 75 ? 'Good' : 
                            scorePercentage >= 60 ? 'Fair' : 'Needs Improvement';
    
    return (
      <View style={styles.resultsContainer}>
        <Surface style={styles.resultsCard}>
          <View style={styles.resultsHeader}>
            <MaterialIcons name="emoji-events" size={32} color="#276749" />
            <Text style={styles.resultsTitle}>Quiz Completed!</Text>
          </View>

          <View style={styles.scoreSection}>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreLabel}>Score</Text>
              <Text style={styles.scoreValue}>{score}/{mockQuestions.length}</Text>
              <Text style={styles.percentageText}>{scorePercentage}%</Text>
            </View>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <MaterialIcons name="timer" size={24} color="#4A5568" />
                <View style={styles.statInfo}>
                  <Text style={styles.statLabel}>Time Spent</Text>
                  <Text style={styles.statValue}>{minutes}m {seconds}s</Text>
                </View>
              </View>
              
              <View style={styles.statItem}>
                <MaterialIcons name="speed" size={24} color="#4A5568" />
                <View style={styles.statInfo}>
                  <Text style={styles.statLabel}>Performance</Text>
                  <Text style={styles.statValue}>{performanceLevel}</Text>
                </View>
              </View>
            </View>
          </View>

          <ProgressBar
            progress={scorePercentage / 100}
            color="#276749"
            style={styles.progressBar}
          />

          <View style={styles.performanceMessage}>
            <MaterialIcons 
              name={scorePercentage >= 90 ? "celebration" : 
                    scorePercentage >= 75 ? "thumb-up" : 
                    scorePercentage >= 60 ? "sentiment-neutral" : "sentiment-dissatisfied"} 
              size={24} 
              color="#276749" 
            />
            <Text style={styles.messageText}>
              {scorePercentage >= 90 ? "Outstanding performance! You've mastered this topic." :
               scorePercentage >= 75 ? "Great job! You have a good understanding of the material." :
               scorePercentage >= 60 ? "You're on the right track. Keep practicing!" :
               "Don't worry! Review the material and try again."}
            </Text>
          </View>
          
          {badges.some(badge => badge.unlocked) && (
            <View style={styles.badgesContainer}>
              <View style={styles.badgesHeader}>
                <MaterialIcons name="workspace-premium" size={24} color="#276749" />
                <Text style={styles.badgesTitle}>New Badges Earned!</Text>
              </View>
              {badges
                .filter(badge => badge.unlocked)
                .map(badge => (
                  <View key={badge.id} style={styles.badgeItem}>
                    <Image
                      source={{ uri: badge.image }}
                      style={styles.badgeImage}
                    />
                    <View style={styles.badgeInfo}>
                      <Text style={styles.badgeName}>{badge.name}</Text>
                      <Text style={styles.badgeDescription}>{badge.description}</Text>
                      <View style={styles.requirementsContainer}>
                        {badge.requirements.map((req, index) => (
                          <View key={index} style={styles.requirementItem}>
                            <MaterialIcons name="check-circle" size={16} color="#276749" />
                            <Text style={styles.requirementText}>{req}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                ))}
            </View>
          )}
          
          <View style={styles.actionsContainer}>
            <Button
              mode="contained"
              onPress={restartQuiz}
              style={styles.restartButton}
              labelStyle={styles.buttonText}
            >
              Try Again
            </Button>
            <Button
              mode="outlined"
              onPress={() => {}}
              style={styles.shareButton}
              labelStyle={styles.buttonText}
            >
              Share Results
            </Button>
          </View>
        </Surface>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {!quizCompleted ? renderQuestion() : renderResults()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  questionContainer: {
    padding: 16,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  questionNumber: {
    fontSize: 16,
    color: '#4A5568',
    fontWeight: '600',
  },
  timer: {
    fontSize: 16,
    color: '#E53E3E',
    fontWeight: '600',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 16,
  },
  questionImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  option: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedOption: {
    borderColor: '#276749',
    backgroundColor: '#F0FFF4',
  },
  correctOption: {
    borderColor: '#276749',
    backgroundColor: '#F0FFF4',
  },
  wrongOption: {
    borderColor: '#E53E3E',
    backgroundColor: '#FFF5F5',
  },
  optionText: {
    fontSize: 16,
    color: '#2D3748',
  },
  explanationContainer: {
    backgroundColor: '#F7FAFC',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
  },
  nextButton: {
    backgroundColor: '#276749',
    borderRadius: 8,
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  resultsCard: {
    borderRadius: 12,
    padding: 24,
    backgroundColor: '#FFFFFF',
    elevation: 4,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    marginLeft: 8,
  },
  scoreSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreBox: {
    alignItems: 'center',
    backgroundColor: '#F0FFF4',
    padding: 16,
    borderRadius: 12,
    minWidth: 120,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  statsContainer: {
    flex: 1,
    marginLeft: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statInfo: {
    marginLeft: 12,
  },
  statLabel: {
    fontSize: 14,
    color: '#4A5568',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  percentageText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#276749',
    marginBottom: 16,
    textAlign: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    marginBottom: 24,
    backgroundColor: '#E2E8F0',
  },
  badgesContainer: {
    width: '100%',
    marginBottom: 24,
    backgroundColor: '#F7FAFC',
    padding: 16,
    borderRadius: 8,
  },
  badgesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginLeft: 8,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  badgeImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 14,
    color: '#4A5568',
  },
  requirementsContainer: {
    marginTop: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  requirementText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#4A5568',
  },
  performanceMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  messageText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  restartButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#276749',
  },
  shareButton: {
    flex: 1,
    marginLeft: 8,
    borderColor: '#276749',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default TrainingQuizScreen; 