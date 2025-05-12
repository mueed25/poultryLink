import { NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  FarmProfile: undefined;
};

// App Tab Navigator
export type AppTabParamList = {
  Dashboard: undefined;
  Feed: undefined;
  Marketplace: undefined;
  ReportDisease: undefined;
  Profile: undefined;
};

// Feed Stack
export type FeedStackParamList = {
  FeedHome: undefined;
  PostDetail: { postId: string };
  CreatePost: undefined;
};

// Main navigator that contains Auth and App stacks
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<AppTabParamList>;
  PostDetail: { postId: string };
  CreatePost: undefined;
  TrainingQuiz: undefined;
};

// Declare global type augmentation for navigation typing
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 