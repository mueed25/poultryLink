import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import PostDetailScreen from '../screens/Profile/PostDetailScreen';

export type ProfileStackParamList = {
  Profile: undefined;
  PostDetail: { post: {
    id: string;
    image: string;
    caption: string;
    likes: number;
    comments: number;
    date: string;
  }};
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator; 