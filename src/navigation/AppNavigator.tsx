import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';

// Import navigation types
import { RootStackParamList, AppTabParamList } from './types';

// Main App Screens
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import { ReportDiseaseScreen } from '../screens/ReportDisease/ReportDiseaseScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import FeedScreen from '../screens/Feed/FeedScreen';
import PostDetailScreen from '../screens/Feed/PostDetailScreen';
import CreatePostScreen from '../screens/CreatePost/CreatePostScreen';
import TrainingQuizScreen from '../screens/Training/TrainingQuizScreen';

// Navigator
import MarketplaceNavigator from './MarketplaceNavigator';

// Stack navigators
const MainStack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<AppTabParamList>();

// Tab Navigator
const TabNavigator = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = 'home';

          if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'Feed') {
            iconName = 'rss-feed';
          } else if (route.name === 'Marketplace') {
            iconName = 'store';
          } else if (route.name === 'ReportDisease') {
            iconName = 'medical-services';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <MaterialIcons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.disabled,
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
          backgroundColor: theme.colors.surface,
        },
        tabBarLabelStyle: {
          fontFamily: theme.fonts.medium.fontFamily,
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Feed" 
        component={FeedScreen}
        options={{ title: 'Feed' }}
      />
      <Tab.Screen 
        name="Marketplace" 
        component={MarketplaceNavigator}
        options={{ title: 'Marketplace' }}
      />
      <Tab.Screen 
        name="ReportDisease" 
        component={ReportDiseaseScreen}
        options={{ title: 'Report Disease' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

// Main App Navigator
const AppNavigator = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainStack.Screen name="MainTabs" component={TabNavigator} />
      <MainStack.Screen name="PostDetail" component={PostDetailScreen} />
      <MainStack.Screen name="CreatePost" component={CreatePostScreen} />
      <MainStack.Screen name="TrainingQuiz" component={TrainingQuizScreen} />
    </MainStack.Navigator>
  );
};

export default AppNavigator; 