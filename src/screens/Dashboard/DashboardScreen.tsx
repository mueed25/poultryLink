import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, StyleSheet, View, Dimensions, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { Text, Card, Title, Paragraph, Button, ActivityIndicator, Badge, Divider, Avatar, List, Surface, IconButton, Menu } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import AIAlertService from '../../services/AIAlertService';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { supabase } from '../../config/superbase'

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
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
   const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState<boolean>(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [dailyTips, setDailyTips] = useState<DailyTip[]>([]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const API_KEY = '519e485f0f05b528872c3e8c7e89e4cf';
        const LAT = 6.5244;
        const LON = 3.3792;
        const resp = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&appid=${API_KEY}`
        );
        const d = resp.data;
        setWeatherData({
          temperature: d.main.temp,
          condition: d.weather[0].description,
          humidity: d.main.humidity,
          rainfall: d.rain?.['1h'] ? `${d.rain['1h']}mm` : '0mm',
          wind: `${d.wind.speed}km/h`,        
        });
      } catch (e: any) {
        console.error('Weather fetch error', e);
        setWeatherError('Unable to load weather');
      } finally {
        setLoadingWeather(false);
      }
    };
    fetchWeather();
  }, []);

  // Fetch weather alerts
  useEffect(() => {
    const fetchWeatherAlerts = async () => {
      try {
        const alerts = await AIAlertService.getInstance().getWeatherAlerts({
          latitude: 6.5244,
          longitude: 3.3792,
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

  // after your other useEffects, add one for dailyTips:
useEffect(() => {
  let subscription: any;

  const fetchTips = async () => {
    const { data, error } = await supabase
      .from<DailyTip>('daily_tips')
      .select('*')
      .order('inserted_at', { ascending: true });

    if (error) console.error('Error fetching tips:', error);
    else setDailyTips(data);
  };

  // initial load
  fetchTips();

  // subscribe to inserts/updates/deletes
  subscription = supabase
    .channel('public:daily_tips')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'daily_tips' },
      (payload) => {
        // payload.eventType === 'INSERT' | 'UPDATE' | 'DELETE'
        fetchTips(); // or update local state more granularly
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
}, []);


  const toggleComments = (postId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const toggleLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setShowLanguageMenu(false);
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
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Dashboard</Title>
        <View style={styles.headerActions}>
          <Menu
            visible={showLanguageMenu}
            onDismiss={() => setShowLanguageMenu(false)}
            anchor={
              <IconButton
                icon="translate"
                size={24}
                onPress={() => setShowLanguageMenu(true)}
                style={styles.languageButton}
              />
            }
          >
            <Menu.Item
              onPress={() => toggleLanguage('en')}
              title="English"
              leadingIcon={i18n.language === 'en' ? "check" : undefined}
            />
            <Menu.Item
              onPress={() => toggleLanguage('fr')}
              title="Français"
              leadingIcon={i18n.language === 'fr' ? "check" : undefined}
            />
            <Menu.Item
              onPress={() => toggleLanguage('es')}
              title="Español"
              leadingIcon={i18n.language === 'es' ? "check" : undefined}
            />
          </Menu>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Weather and Alerts Section */}
        <View style={styles.section}>
          <View style={styles.weatherAlertsContainer}>
            {/* Combined Weather and Alert Card */}
            <Surface style={styles.combinedCard}>
              <LinearGradient
                colors={['#276749', '#2F855A']}
                style={styles.weatherGradient}
              >
                <View style={styles.weatherOutbreakContainer}>
                  {/* Weather Info */}
                  <View style={styles.weatherInfoSection}>
                    <View style={styles.weatherRow}>
                      <View style={styles.weatherLeftColumn}>
                        <View style={styles.weatherHeader}>
                          <View style={styles.weatherTitleContainer}>
                            <MaterialIcons name="wb-sunny" size={24} color="#FFFFFF" />
                            <Text style={styles.weatherTitle}>Current Weather</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={styles.weatherContentRow}>
                      <View style={styles.temperatureContainer}>
                        <Text style={styles.temperatureValue}>{weatherData?.temperature}°</Text>
                        <Text style={styles.temperatureLabel}>{weatherData?.condition}</Text>
                      </View>
                      <View style={styles.weatherDetails}>
                        <View style={styles.weatherDetailRow}>
                          <MaterialIcons name="water-drop" size={16} color="#FFFFFF" />
                          <Text style={styles.weatherDetailText}>
                            Humidity: {weatherData?.humidity}%
                          </Text>
                        </View>
                        <View style={styles.weatherDetailRow}>
                          <MaterialIcons name="water" size={16} color="#FFFFFF" />
                          <Text style={styles.weatherDetailText}>
                            Rain: {weatherData?.rainfall}
                          </Text>
                        </View>
                        <View style={styles.weatherDetailRow}>
                          <MaterialIcons name="air" size={16} color="#FFFFFF" />
                          <Text style={styles.weatherDetailText}>
                            Wind: {weatherData?.wind}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <Divider style={styles.weatherDivider} />
                  {/* Outbreak Info */}
                  <View style={styles.outbreakContent}>
                    <View style={styles.outbreakHeader}>
                      <View style={styles.outbreakTitleContainer}>
                        <MaterialIcons name="warning" size={20} color="#FED7D7" />
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
              </LinearGradient>
            </Surface>

            {/* Weather Alerts */}
            {loadingAlerts ? (
              <Surface style={styles.alertsCard}>
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#276749" />
                  <Text style={styles.loadingText}>{t('common.loading')}</Text>
                </View>
              </Surface>
            ) : weatherAlerts.length > 0 ? (
              <Surface style={styles.alertsCard}>
                <View style={styles.alertHeader}>
                  <MaterialIcons name="notifications-active" size={20} color="#E53E3E" />
                  <Text style={styles.alertHeaderText}>Weather Alerts</Text>
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
                onPress={() => navigation.navigate('TrainingQuiz')}
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
            data={dailyTips}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderTipCard}
            keyExtractor={(item) => item.id}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageButton: {
    margin: 0,
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
    color: '#FFFFFF',
  },
  weatherContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  temperatureContainer: {
    alignItems: 'center',
    marginRight: 16,
    width: 100,
  },
  temperatureValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 40,
  },
  temperatureLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: -4,
  },
  weatherDetails: {
    flex: 1,
  },
  weatherDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  weatherDetailText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 8,
    opacity: 0.9,
  },
  weatherDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 12,
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
    color: '#FED7D7',
  },
  outbreakBadge: {
    backgroundColor: 'rgba(254, 215, 215, 0.2)',
    color: '#FED7D7',
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
    color: '#FED7D7',
  },
  percentageLabel: {
    fontSize: 10,
    color: '#FED7D7',
    opacity: 0.8,
  },
  outbreakDetails: {
    flex: 1,
  },
  outbreakDetailText: {
    fontSize: 12,
    color: '#FED7D7',
    opacity: 0.9,
  },
  outbreakTimeText: {
    fontSize: 10,
    color: '#FED7D7',
    opacity: 0.7,
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
  },
  alertHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A5568',
    marginLeft: 8,
  },
  alertDivider: {
    marginBottom: 8,
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
  },
  alertIconContainer: {
    marginRight: 8,
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
  weatherGradient: {
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default DashboardScreen; 