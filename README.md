# PoultryLink Mobile App

A mobile application built with React Native to help poultry farmers track bird health, access market information, and optimize farm operations.

## Features

- **Authentication**: Secure user accounts with email/password login and signup
- **Farm Profile Management**: Track farm details, bird types, and farm metrics
- **Health Monitoring**: Report bird health issues and get AI-powered diagnostic recommendations
- **Marketplace**: Buy supplies and connect with service providers
- **Dashboard**: Get weather alerts, daily tips, and farm management insights
- **Multi-language Support**: Currently supports English with plans for Hausa and Yoruba

## Technology Stack

- React Native
- TypeScript
- GluestackUI for component library
- React Navigation for navigation
- i18next for internationalization
- Mock services for demonstration (to be replaced with Firebase in production)

## Project Structure

```
PoultryLink/
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # Screen components organized by feature
│   │   ├── Auth/         # Authentication screens (SignIn, SignUp, etc.)
│   │   ├── Dashboard/    # Main dashboard
│   │   ├── Marketplace/  # Marketplace screens
│   │   ├── Onboarding/   # User onboarding screens
│   │   ├── Profile/      # User profile screens
│   │   └── ReportDisease/# Disease reporting and diagnosis
│   ├── navigation/       # Navigation configuration
│   ├── services/         # API and service integrations
│   └── i18n.ts           # Internationalization setup
├── assets/               # Static assets like images
└── App.tsx               # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- React Native development environment

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Run on iOS or Android:
   ```
   npm run ios
   # or
   npm run android
   ```

## Future Enhancements

- Connect to real Firebase backend
- Implement complete data synchronization
- Add offline support
- Integrate real-time weather API
- Expand the AI disease recognition capabilities
- Add image upload for disease diagnosis 