import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { Text, Card, Avatar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

type PostProps = {
  post: {
    id: string;
    author: string;
    authorAvatar: string;
    content: string;
    image?: string;
    likes: number;
    comments: number;
    time: string;
    tags: string[];
  };
  onPress: () => void;
};

const PostCard = ({ post, onPress }: PostProps) => {
  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content style={styles.cardContent}>
        {/* Header with author info */}
        <View style={styles.header}>
          <Avatar.Image 
            source={{ uri: post.authorAvatar }} 
            size={40}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.authorName}>{post.author}</Text>
            <Text style={styles.time}>{post.time}</Text>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <MaterialIcons name="more-vert" size={20} color="#757575" />
          </TouchableOpacity>
        </View>
        
        {/* Post content */}
        <Text style={styles.content}>{post.content}</Text>
        
        {/* Post image if available */}
        {post.image && (
          <Image 
            source={{ uri: post.image }} 
            style={styles.image} 
            resizeMode="cover"
          />
        )}
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {post.tags.map((tag, index) => (
              <View key={index} style={styles.tagContainer}>
                <Text style={styles.tag}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}
        
        {/* Post stats and actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="favorite-border" size={20} color="#757575" />
            <Text style={styles.actionText}>{post.likes}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="chat-bubble-outline" size={20} color="#757575" />
            <Text style={styles.actionText}>{post.comments}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="share" size={20} color="#757575" />
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 0,
    borderRadius: 10,
    marginVertical: 4,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  authorName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  time: {
    fontSize: 12,
    color: '#757575',
  },
  moreButton: {
    padding: 4,
  },
  content: {
    marginBottom: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tagContainer: {
    backgroundColor: '#F0F5F0',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  tag: {
    fontSize: 12,
    color: '#4CAF50',
  },
  actionsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#757575',
  },
});

export default PostCard; 