import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Text, IconButton, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width } = Dimensions.get('window');

type ProfileStackParamList = {
  Profile: undefined;
  PostDetail: { post: UserPost };
};

type PostDetailScreenRouteProp = RouteProp<ProfileStackParamList, 'PostDetail'>;
type PostDetailScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'PostDetail'>;

interface UserPost {
  id: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  date: string;
}

const PostDetailScreen = () => {
  const navigation = useNavigation<PostDetailScreenNavigationProp>();
  const route = useRoute<PostDetailScreenRouteProp>();
  const { post } = route.params;
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Post Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.postHeader}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }}
            style={styles.profileImage}
          />
          <View style={styles.postHeaderInfo}>
            <Text style={styles.username}>johndoe_poultry</Text>
            <Text style={styles.date}>{post.date}</Text>
          </View>
        </View>

        <Image
          source={{ uri: post.image }}
          style={styles.postImage}
          resizeMode="cover"
        />

        <View style={styles.postContent}>
          <Text style={styles.caption}>{post.caption}</Text>
          
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
              <MaterialIcons
                name={isLiked ? 'favorite' : 'favorite-border'}
                size={24}
                color={isLiked ? '#E53E3E' : '#666666'}
              />
              <Text style={styles.actionText}>{likes}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="chat-bubble-outline" size={24} color="#666666" />
              <Text style={styles.actionText}>{post.comments}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="share" size={24} color="#666666" />
            </TouchableOpacity>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>Comments</Text>
            <View style={styles.comment}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }}
                style={styles.commentProfileImage}
              />
              <View style={styles.commentContent}>
                <Text style={styles.commentUsername}>marysmith</Text>
                <Text style={styles.commentText}>Great post! Keep up the good work!</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  content: {
    flex: 1,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  postHeaderInfo: {
    marginLeft: 12,
  },
  username: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  date: {
    fontSize: 12,
    color: '#666666',
  },
  postImage: {
    width: width,
    height: width,
  },
  postContent: {
    padding: 12,
  },
  caption: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  divider: {
    marginVertical: 12,
  },
  commentsSection: {
    marginTop: 8,
  },
  commentsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 12,
  },
  comment: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  commentProfileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentContent: {
    marginLeft: 12,
    flex: 1,
  },
  commentUsername: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333333',
  },
  commentText: {
    fontSize: 13,
    color: '#333333',
    marginTop: 2,
  },
});

export default PostDetailScreen; 