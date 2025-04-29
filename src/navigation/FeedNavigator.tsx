import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FeedScreen from '../screens/Feed/FeedScreen';
import PostDetailScreen from '../screens/Feed/PostDetailScreen';

// Define the parameter list for the stack navigator
export type FeedStackParamList = {
  FeedHome: undefined;
  PostDetailScreen: { 
    post: {
      id: string;
      author: string;
      authorAvatar: string;
      content: string;
      image?: string;
      likes: number;
      comments: number;
      time: string;
      tags?: string[];
    } 
  };
};

const Stack = createStackNavigator<FeedStackParamList>();

const FeedNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="FeedHome"
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="FeedHome" component={FeedScreen} />
      <Stack.Screen name="PostDetailScreen" component={PostDetailScreen} />
    </Stack.Navigator>
  );
};

export default FeedNavigator; 