import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, FlatList, View, TextInput, KeyboardAvoidingView, Platform, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Text, Button, Divider, Avatar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/types';

type PostDetailRouteProp = RouteProp<RootStackParamList, 'PostDetail'>;

// Mock comments data
const MOCK_COMMENTS = [
  {
    id: 'c1',
    postId: '1',
    author: 'Emma Johnson',
    authorAvatar: 'https://randomuser.me/api/portraits/women/11.jpg',
    content: 'This is amazing! I\'ve been looking for a solution like this for months. How much did it cost to implement?',
    time: '3 hours ago',
  },
  {
    id: 'c2',
    postId: '1',
    author: 'Linda Johnson',
    authorAvatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    content: 'Have you noticed any difference in your energy bill? I\'m trying to make my farm more efficient.',
    time: '45 minutes ago',
  },
  {
    id: 'c3',
    postId: '1',
    author: 'Michael Brown',
    authorAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    content: 'I installed a similar system last year. It paid for itself in time savings within a few months!',
    time: '7 hours ago',
  },
  {
    id: 'c4',
    postId: '2',
    author: 'Ava Wilson',
    authorAvatar: 'https://randomuser.me/api/portraits/women/10.jpg',
    content: 'What brand of feed are you using? I\'ve been trying to find a good organic option.',
    time: '3 hours ago',
  },
  {
    id: 'c5',
    postId: '2',
    author: 'Robert Miller',
    authorAvatar: 'https://randomuser.me/api/portraits/men/20.jpg',
    content: 'That\'s an impressive increase! Have you also changed their water supply?',
    time: '2 hours ago',
  },
  {
    id: 'c6',
    postId: '3',
    author: 'Susan Davis',
    authorAvatar: 'https://randomuser.me/api/portraits/women/20.jpg',
    content: 'I follow a strict 2-week, 6-week, and 16-week vaccination schedule for my chicks. Works great!',
    time: '1 day ago',
  },
  {
    id: 'c7',
    postId: '3',
    author: 'James Wilson',
    authorAvatar: 'https://randomuser.me/api/portraits/men/30.jpg',
    content: 'Don\'t forget to monitor them for reactions after vaccinations. I keep detailed health records.',
    time: '20 hours ago',
  },
];

// Mock posts data (simplified version of the FeedScreen data)
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

const PostDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<PostDetailRouteProp>();
  const { postId } = route.params;
  
  const post = MOCK_POSTS.find(p => p.id === postId);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(MOCK_COMMENTS.filter(comment => comment.postId === postId));
  const [liked, setLiked] = useState(false);

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#333333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post Not Found</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.centeredContent}>
          <Text>The post could not be found.</Text>
          <Button 
            mode="contained" 
            onPress={() => navigation.goBack()}
            style={styles.goBackButton}
          >
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddComment = () => {
    if (newComment.trim() === '') return;
    
    const newCommentObj = {
      id: `c${Date.now()}`,
      postId: post.id,
      author: 'Current User', // In a real app, get from auth context
      authorAvatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      content: newComment,
      time: 'Just now',
    };
    
    setComments([...comments, newCommentObj]);
    setNewComment('');
  };

  const handleToggleLike = () => {
    setLiked(!liked);
  };

  const renderCommentItem = ({ item }: { item: typeof MOCK_COMMENTS[0] }) => (
    <View style={styles.commentContainer}>
      <Avatar.Image 
        source={{ uri: item.authorAvatar }} 
        size={40}
        style={styles.commentAvatar}
      />
      <View style={styles.commentContent}>
        <View style={styles.commentBubble}>
          <Text style={styles.commentAuthor}>{item.author}</Text>
          <Text>{item.content}</Text>
        </View>
        <Text style={styles.commentTime}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
        <MaterialIcons name="share" size={22} color="#333333" />
      </View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
        keyboardVerticalOffset={100}
      >
        <ScrollView style={styles.scrollView}>
          {/* Post Content */}
          <View style={styles.postContainer}>
            <View style={styles.postHeader}>
              <Avatar.Image
                source={{ uri: post.authorAvatar }}
                size={50}
              />
              <View style={styles.postAuthorContainer}>
                <Text style={styles.postAuthorName}>{post.author}</Text>
                <Text style={styles.postTime}>{post.time}</Text>
              </View>
            </View>
            
            <Text style={styles.postContent}>{post.content}</Text>
            
            {post.image && (
              <Image
                source={{ uri: post.image }}
                style={styles.postImage}
                resizeMode="cover"
              />
            )}
            
            {post.tags && post.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {post.tags.map((tag, index) => (
                  <View key={index} style={styles.tagContainer}>
                    <Text style={styles.tag}>#{tag}</Text>
                  </View>
                ))}
              </View>
            )}
            
            <View style={styles.postStats}>
              <TouchableOpacity 
                style={styles.statButton}
                onPress={handleToggleLike}
              >
                <MaterialIcons 
                  name={liked ? "favorite" : "favorite-border"} 
                  size={18} 
                  color={liked ? "#E53E3E" : "#757575"} 
                />
                <Text style={styles.statText}>{post.likes + (liked ? 1 : 0)} likes</Text>
              </TouchableOpacity>
              
              <View style={styles.statButton}>
                <MaterialIcons name="chat-bubble-outline" size={18} color="#757575" />
                <Text style={styles.statText}>{comments.length} comments</Text>
              </View>
            </View>
          </View>
          
          <Divider style={styles.divider} />
          
          {/* Comments Section */}
          <View style={styles.commentsContainer}>
            <Text style={styles.commentsTitle}>Comments</Text>
            
            {comments.length === 0 ? (
              <Text style={styles.noCommentsText}>No comments yet. Be the first to comment!</Text>
            ) : (
              <FlatList
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id}
                scrollEnabled={false}
              />
            )}
          </View>
        </ScrollView>
        
        {/* Comment Input */}
        <View style={styles.inputContainer}>
          <Avatar.Image 
            source={{ uri: 'https://randomuser.me/api/portraits/women/65.jpg' }}
            size={40}
          />
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity
            disabled={newComment.trim() === ''}
            onPress={handleAddComment}
            style={[
              styles.sendButton,
              {
                backgroundColor: newComment.trim() === '' ? '#E2E8F0' : '#4CAF50'
              }
            ]}
          >
            <MaterialIcons 
              name="send" 
              size={16} 
              color={newComment.trim() === '' ? '#A0AEC0' : '#FFFFFF'} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  goBackButton: {
    marginTop: 16,
    width: 120,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  postContainer: {
    padding: 16,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAuthorContainer: {
    marginLeft: 12,
  },
  postAuthorName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333333',
  },
  postTime: {
    fontSize: 12,
    color: '#757575',
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 240,
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
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  statText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#757575',
  },
  divider: {
    marginVertical: 8,
  },
  commentsContainer: {
    padding: 16,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  noCommentsText: {
    color: '#757575',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    marginRight: 8,
  },
  commentContent: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 12,
    borderTopLeftRadius: 4,
  },
  commentAuthor: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 14,
  },
  commentTime: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    marginHorizontal: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PostDetailScreen; 