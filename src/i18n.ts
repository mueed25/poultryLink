import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { I18nManager } from 'react-native';

// Import language files
import en from './locales/en.json';
import ha from './locales/ha.json';
import yo from './locales/yo.json';

// English translations
const enTranslations = {
  common: {
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    skip: 'Skip',
    back: 'Back',
    logout: 'Logout',
  },
  auth: {
    signIn: 'Sign In',
    signUp: 'Sign Up',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    name: 'Name',
    forgotPassword: 'Forgot Password?',
    resetPassword: 'Reset Password',
    createAccount: 'Create Account',
    orContinueWith: 'Or continue with',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    welcomeBack: 'Welcome Back',
    emailRequired: 'Email is required',
    validEmail: 'Please enter a valid email',
    passwordRequired: 'Password is required',
    passwordsDoNotMatch: 'Passwords do not match',
    passwordRequirements: 'Password must be at least 8 characters',
    invalidCredentials: 'Invalid email or password',
  },
  onboarding: {
    setupProfile: 'Set Up Your Farm Profile',
    farmName: 'Farm Name',
    farmLocation: 'Farm Location',
    farmSize: 'Farm Size',
    numberOfBirds: 'Number of Birds',
    birdTypes: 'Bird Types',
    layer: 'Layer',
    broiler: 'Broiler',
    native: 'Native',
  },
  dashboard: {
    weatherAlert: 'Weather Alert',
    dailyTips: 'Daily Tips',
    localMarket: 'Local Market',
    viewAll: 'View All',
    profile: 'Profile',
    alerts: 'Alerts',
  },
  marketplace: {
    search: 'Search products...',
    products: 'Products',
    filter: 'Filter',
    addToCart: 'Add to Cart',
    placeOrder: 'Place Order',
    feeds: 'Feeds',
    medications: 'Medications',
    equipment: 'Equipment',
    birds: 'Birds',
    services: 'Services',
  },
  reportDisease: {
    reportProblem: 'Report Health Issue',
    symptomDescription: 'Symptom Description',
    recommendations: 'Recommendations',
    possibleCauses: 'Possible Causes',
    vetContact: 'Please contact a veterinarian immediately',
    submitReport: 'Submit Report',
  },
  profile: {
    editProfile: 'Edit Profile',
    farmDetails: 'Farm Details',
    email: 'Email',
    phone: 'Phone',
    memberSince: 'Member Since',
    menu: 'Menu',
    settings: 'Settings',
    logout: 'Logout',
    logoutTitle: 'Sign Out',
    logoutConfirm: 'Are you sure you want to sign out?',
    logoutSuccess: 'Successfully signed out',
    logoutError: 'Error signing out',
    darkMode: 'Dark Mode',
    notifications: 'Notifications',
    language: 'Language',
    version: 'Version {{version}}',
    farmProfile: 'Farm Profile',
    records: 'Records',
    orders: 'Orders',
    savedItems: 'Saved Items',
    help: 'Help & Support',
  },
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      ha: { translation: ha },
      yo: { translation: yo },
    },
    lng: Localization.locale.split('-')[0] || 'en',
    fallbackLng: 'en',
    
    // Allow 30% more space for translations
    interpolation: {
      escapeValue: false,
    },
    
    // Enable nesting for more organized translations
    nesting: true,
    
    // Avoid unnecessary rerenders
    react: {
      useSuspense: false,
    },
  });

export default i18n; 