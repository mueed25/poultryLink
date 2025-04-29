import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, StyleSheet, View, Dimensions, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { Text, Card, Title, Paragraph, Button, ActivityIndicator, Badge, Divider, Avatar, List, Surface, IconButton } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import AIAlertService from '../../services/AIAlertService';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Define types for data structures
interface DailyTip {
  id: string;
  title: string;
  content: string;
  image: string;
  icon: string;
}

interface Comment {
  id: string;
  user: string;
  comment: string;
  timePosted: string;
}

interface User {
  name: string;
  avatar: string;
  location: string;
}

interface CommunityPost {
  id: string;
  user: User;
  timePosted: string;
  content: string;
  image: string;
  likes: number;
  comments: Comment[];
}

interface OutbreakData {
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  region: string;
  diseaseType: string;
  lastUpdated: string;
}

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  rainfall: string;
  wind: string;
}

// Mock data for daily tips
const DAILY_TIPS: DailyTip[] = [
  {
    id: '1',
    title: 'Proper Ventilation',
    content: 'Ensure proper airflow in your poultry house to reduce heat stress and ammonia buildup.',
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    icon: 'air',
  },
  {
    id: '2',
    title: 'Water Quality',
    content: 'Check water quality weekly. Clean drinkers daily to prevent bacterial growth.',
    image: 'https://images.unsplash.com/photo-1588421357574-87938a86fa28?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    icon: 'water-drop',
  },
  {
    id: '3',
    title: 'Balanced Nutrition',
    content: 'Provide a balanced diet with proper protein levels based on bird age and purpose.',
    image: 'https://images.unsplash.com/photo-1534470397334-1975940ece1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    icon: 'restaurant',
  },
];

// Mock disease outbreak data
const OUTBREAK_DATA: OutbreakData = {
  percentage: 15,
  trend: 'up', // 'up', 'down', 'stable'
  region: 'Lagos State',
  diseaseType: 'Newcastle Disease',
  lastUpdated: '2 hours ago'
};

// Mock weather data
const WEATHER_DATA: WeatherData = {
  temperature: 32,
  condition: 'Partly Cloudy',
  humidity: 65,
  rainfall: '0.2mm',
  wind: '12km/h'
};

// Mock training data for user
const TRAINING_DATA = {
  level: 3,
  points: 735,
  leaderboardRank: 26,
  certifications: [
    { name: 'Poultry Health Basics', completed: true },
    { name: 'Nutrition Management', completed: true },
    { name: 'Farm Operations', completed: false }
  ],
  nextQuiz: 'Disease Prevention',
  quizAvailable: true
};

const DashboardScreen = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const [weatherAlerts, setWeatherAlerts] = useState<string[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState(true);
  const [expandedComments, setExpandedComments] = useState<{[key: string]: boolean}>({});

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    const fetchWeatherAlerts = async () => {
      try {
        // Simulate fetching weather alerts
        const alerts = await AIAlertService.getInstance().getWeatherAlerts({
          latitude: 6.5244,
          longitude: 3.3792, // Lagos, Nigeria
        });
        setWeatherAlerts(alerts.map(alert => alert.description));
      } catch (error) {
        console.error('Error fetching weather alerts:', error);
      } finally {
        setLoadingAlerts(false);
      }
    };

    fetchWeatherAlerts();
  }, []);

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const renderTipCard = ({ item }: { item: DailyTip }) => (
    <Surface style={styles.tipCard}>
      <ImageBackground 
        source={{ uri: item.image }} 
        style={styles.tipImage}
        imageStyle={{ borderRadius: 12 }}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
          style={styles.tipGradient}
        >
          <View style={styles.tipIconContainer}>
            <MaterialIcons name={item.icon as any} size={24} color="#FFFFFF" />
          </View>
          <View style={styles.tipContentOverlay}>
            <Title style={styles.tipTitle}>{item.title}</Title>
            <Paragraph style={styles.tipText} numberOfLines={2}>
              {item.content}
            </Paragraph>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Surface>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Title style={styles.headerTitle}>{t('dashboard.title')}</Title>
          <IconButton 
            icon="translate" 
            onPress={toggleLanguage}
            iconColor="#276749"
          />
        </View>

        {/* Weather and Alerts Section */}
        <View style={styles.section}>
          <View style={styles.weatherAlertsContainer}>
            {/* Combined Weather and Alert Card */}
            <Surface style={[styles.combinedCard, styles.weatherCard]}>
              <View style={styles.weatherOutbreakContainer}>
                {/* Weather Info */}
                <View style={styles.weatherInfoSection}>
                  <View style={styles.weatherRow}>
                    <View style={styles.weatherLeftColumn}>
                      <View style={styles.weatherHeader}>
                        <View style={styles.weatherTitleContainer}>
                          <MaterialIcons name="wb-sunny" size={22} color="#FFD700" />
                          <Text style={styles.weatherTitle}>Current Weather</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.weatherContentRow}>
                    <View style={styles.temperatureContainer}>
                      <Text style={styles.temperatureValue}>{WEATHER_DATA.temperature}°C</Text>
                      <Text style={styles.temperatureLabel}>Partly Cloudy</Text>
                    </View>
                    <View style={styles.weatherDetails}>
                      <Text style={styles.weatherDetailText}>
                        Humidity: {WEATHER_DATA.humidity}% | Rain: {WEATHER_DATA.rainfall} | Wind: {WEATHER_DATA.wind}
                      </Text>
                      <Text style={styles.weatherTimeText}>Updated 15 minutes ago</Text>
                    </View>
                  </View>
                </View>
                <Divider style={styles.weatherDivider} />
                {/* Outbreak Info */}
                <View style={styles.outbreakContent}>
                  <View style={styles.outbreakHeader}>
                    <View style={styles.outbreakTitleContainer}>
                      <MaterialIcons name="warning" size={20} color="#E53E3E" />
                      <Text style={styles.outbreakTitle}>Disease Alert</Text>
                    </View>
                    <Badge style={styles.outbreakBadge}>
                      {OUTBREAK_DATA.trend === 'up' ? '↑' : OUTBREAK_DATA.trend === 'down' ? '↓' : '='}
                    </Badge>
                  </View>
                  <View style={styles.outbreakContentRow}>
                    <View style={styles.percentageContainer}>
                      <Text style={styles.percentageText}>{OUTBREAK_DATA.percentage}%</Text>
                      <Text style={styles.percentageLabel}>Risk Level</Text>
                    </View>
                    <View style={styles.outbreakDetails}>
                      <Text style={styles.outbreakDetailText}>
                        {OUTBREAK_DATA.diseaseType} outbreak reported in {OUTBREAK_DATA.region}
                      </Text>
                      <Text style={styles.outbreakTimeText}>Updated {OUTBREAK_DATA.lastUpdated}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </Surface>

            {/* Weather Alerts */}
            {loadingAlerts ? (
              <Surface style={[styles.alertsCard, styles.loadingCard]}>
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#276749" />
                  <Text style={styles.loadingText}>{t('common.loading')}</Text>
                </View>
              </Surface>
            ) : weatherAlerts.length > 0 ? (
              <Surface style={[styles.alertsCard, styles.alertCard]}>
                <View style={styles.alertHeader}>
                  <MaterialIcons name="notifications-active" size={20} color="#E53E3E" />
                  <Text style={styles.alertHeaderText}>{t('dashboard.weatherAlerts')}</Text>
                </View>
                <Divider style={styles.alertDivider} />
                {weatherAlerts.map((alert: string, index: number) => (
                  <View key={index} style={styles.alertItem}>
                    <View style={styles.alertIconContainer}>
                      <MaterialIcons name="warning" size={18} color="#E53E3E" />
                    </View>
                    <View style={styles.alertContent}>
                      <Paragraph style={styles.alertText}>{alert}</Paragraph>
                    </View>
                  </View>
                ))}
              </Surface>
            ) : null}
          </View>
        </View>

        {/* Training Section */}
        <View style={styles.section}>
          <Surface style={styles.trainingSection}>
            <View style={styles.trainingSectionHeader}>
              <View style={styles.trainingSectionTitle}>
                <MaterialIcons name="school" size={22} color="#276749" />
                <Title style={styles.trainingTitle}>Self Training</Title>
              </View>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>Level {TRAINING_DATA.level}</Text>
              </View>
            </View>
            <Divider style={styles.trainingDivider} />
            
            <View style={styles.trainingContent}>
              <View style={styles.trainingStats}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{TRAINING_DATA.points}</Text>
                  <Text style={styles.statLabel}>Points</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>#{TRAINING_DATA.leaderboardRank}</Text>
                  <Text style={styles.statLabel}>Rank</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{TRAINING_DATA.certifications.filter(c => c.completed).length}/{TRAINING_DATA.certifications.length}</Text>
                  <Text style={styles.statLabel}>Certs</Text>
                </View>
              </View>
              
              <View style={styles.certificationList}>
                {TRAINING_DATA.certifications.map((cert, index) => (
                  <View key={index} style={styles.certItem}>
                    <MaterialIcons 
                      name={cert.completed ? "check-circle" : "radio-button-unchecked"} 
                      size={16} 
                      color={cert.completed ? "#276749" : "#CBD5E0"} 
                    />
                    <Text style={[
                      styles.certName, 
                      cert.completed ? styles.completedCert : styles.pendingCert
                    ]}>
                      {cert.name}
                    </Text>
                  </View>
                ))}
              </View>
              
              <Button
                mode="contained"
                icon="play-circle"
                onPress={() => console.log('Start training')}
                style={styles.startQuizButton}
              >
                Start {TRAINING_DATA.nextQuiz} Quiz
              </Button>
            </View>
          </Surface>
        </View>

        {/* Daily Tips Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>{t('dashboard.dailyTips')}</Title>
          </View>

          <FlatList
            data={DAILY_TIPS}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderTipCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.tipsContainer}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: '#276749',
  },
  section: {
    marginVertical: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#276749',
    fontWeight: 'bold',
  },
  weatherAlertsContainer: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  combinedCard: {
    width: '100%',
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  weatherOutbreakContainer: {
    flexDirection: 'column',
  },
  weatherInfoSection: {
    padding: 12,
  },
  weatherRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  weatherLeftColumn: {
    alignItems: 'flex-start',
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#276749',
  },
  weatherContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  temperatureContainer: {
    alignItems: 'center',
    marginRight: 16,
    width: 60,
  },
  temperatureValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#276749',
  },
  temperatureLabel: {
    fontSize: 10,
    color: '#4A5568',
  },
  weatherDetails: {
    flex: 1,
  },
  weatherDetailText: {
    fontSize: 12,
    color: '#4A5568',
    marginBottom: 4,
  },
  weatherTimeText: {
    fontSize: 10,
    color: '#718096',
  },
  weatherDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  outbreakContent: {
    padding: 12,
  },
  outbreakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  outbreakTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  outbreakTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#E53E3E',
  },
  outbreakBadge: {
    backgroundColor: '#FED7D7',
    color: '#E53E3E',
  },
  outbreakContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentageContainer: {
    alignItems: 'center',
    marginRight: 16,
    width: 60,
  },
  percentageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E53E3E',
  },
  percentageLabel: {
    fontSize: 10,
    color: '#4A5568',
  },
  outbreakDetails: {
    flex: 1,
  },
  outbreakDetailText: {
    fontSize: 12,
    color: '#4A5568',
    marginBottom: 4,
  },
  outbreakTimeText: {
    fontSize: 10,
    color: '#718096',
  },
  alertsCard: {
    width: '100%',
    borderRadius: 12,
    elevation: 2,
    padding: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  alertHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E53E3E',
    marginLeft: 8,
  },
  alertDivider: {
    marginBottom: 8,
    backgroundColor: '#FED7D7',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#4A5568',
  },
  alertItem: {
    flexDirection: 'row',
    marginVertical: 6,
    alignItems: 'flex-start',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  alertIconContainer: {
    marginRight: 8,
    backgroundColor: '#FED7D7',
    padding: 4,
    borderRadius: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertText: {
    color: '#4A5568',
    fontSize: 12,
    lineHeight: 16,
  },
  noAlertsContainer: {
    padding: 16,
    alignItems: 'center',
  },
  noAlertsText: {
    marginTop: 8,
    color: '#4A5568',
    textAlign: 'center',
  },
  tipsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  tipCard: {
    width: width * 0.75,
    marginRight: 16,
    borderRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  tipImage: {
    height: 180,
    width: '100%',
    justifyContent: 'flex-end',
  },
  tipGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    padding: 16,
    justifyContent: 'flex-end',
    borderRadius: 12,
  },
  tipIconContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 8,
    borderRadius: 20,
  },
  tipContentOverlay: {
    justifyContent: 'flex-end',
  },
  tipTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  tipText: {
    color: '#FFFFFF',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  trainingSection: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  trainingSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  trainingSectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trainingTitle: {
    fontSize: 18,
    color: '#276749',
    marginLeft: 8,
  },
  levelBadge: {
    backgroundColor: '#F0FFF4',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  levelText: {
    color: '#276749',
    fontWeight: 'bold',
    fontSize: 14,
  },
  trainingDivider: {
    backgroundColor: '#E6FFEC',
  },
  trainingContent: {
    padding: 16,
  },
  trainingStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statBox: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
  certificationList: {
    marginBottom: 16,
  },
  certItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  certName: {
    marginLeft: 8,
    fontSize: 14,
  },
  completedCert: {
    color: '#276749',
    fontWeight: '500',
  },
  pendingCert: {
    color: '#718096',
  },
  startQuizButton: {
    backgroundColor: '#276749',
    borderRadius: 8,
  },
  weatherCard: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderLeftColor: '#3182CE',
  },
  alertCard: {
    backgroundColor: '#FFF5F5',
    borderLeftWidth: 4,
    borderLeftColor: '#E53E3E',
  },
  loadingCard: {
    backgroundColor: '#F7FAFC',
    borderLeftWidth: 4,
    borderLeftColor: '#CBD5E0',
  },
});

export default DashboardScreen; 