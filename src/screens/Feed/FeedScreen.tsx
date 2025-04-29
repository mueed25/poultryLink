import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import PostCard from '../../components/Feed/PostCard';
import { RootStackParamList } from '../../navigation/types';
import { MaterialIcons } from '@expo/vector-icons';

type FeedScreenNavigationProp = StackNavigationProp<RootStackParamList>;

// Mock data for posts
const MOCK_POSTS = [
  {
    id: '1',
    author: 'Sarah Johnson',
    authorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    content: 'Just upgraded our chicken coop with an automated door system. The chickens are loving it! Has anyone else tried this?',
    image: 'https://images.unsplash.com/photo-1548550019-d29a3b1e0f21?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpY2tlbiUyMGNvb3B8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
    likes: 24,
    comments: 7,
    time: '2 hours ago',
    tags: ['CoopDesign', 'Automation'],
  },
  {
    id: '2',
    author: 'Michael Chen',
    authorAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    content: 'Egg production is up 30% this month after changing to the new organic feed mix. Highly recommend!',
    likes: 15,
    comments: 3,
    time: '5 hours ago',
    tags: ['OrganicFeed', 'EggProduction'],
  },
  {
    id: '3',
    author: 'Emily Rodriguez',
    authorAvatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    content: 'Looking for advice on vaccinating new chicks. What schedule has worked best for everyone?',
    image: 'https://images.unsplash.com/photo-1508252323578-e855df5d2281?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8Y2hpY2tzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    likes: 8,
    comments: 12,
    time: '1 day ago',
    tags: ['ChickCare', 'Vaccination'],
  },
];

const FeedScreen = () => {
  const navigation = useNavigation<FeedScreenNavigationProp>();
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate a network request
    setTimeout(() => {
      setRefreshing(false);
      // You might want to refresh the posts here from a real API
    }, 2000);
  }, []);

  const handlePostPress = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      navigation.navigate('PostDetail', { postId });
    }
  };

  const handleCreatePost = () => {
    navigation.navigate('CreatePost');
  };

  const renderItem = ({ item }: { item: typeof posts[0] }) => (
    <PostCard 
      post={item} 
      onPress={() => handlePostPress(item.id)} 
    />
  );

  const ItemSeparator = () => <View style={styles.separator} />;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Feed</Text>
        <TouchableOpacity 
          style={styles.createPostButton}
          onPress={handleCreatePost}
        >
          <MaterialIcons name="add" color="#FFFFFF" size={22} />
        </TouchableOpacity>
      </View>

      {/* Posts List */}
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={ItemSeparator}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#4CAF50']}
            tintColor="#4CAF50"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  createPostButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  listContent: {
    paddingVertical: 8,
  },
  separator: {
    height: 8,
  },
});

export default FeedScreen; 