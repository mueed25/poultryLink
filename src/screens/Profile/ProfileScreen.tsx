import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, TouchableOpacity, Image, Alert, View, ScrollView, FlatList, Dimensions, Modal, TextInput, Platform } from 'react-native';
import {
  Text,
  Title,
  Button,
  Divider,
  Avatar,
  Switch,
  Snackbar,
  IconButton,
  Badge,
  Surface,
  Chip,
  FAB,
  Portal,
  Provider as PaperProvider,
  Card,
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { logout } from '../../services/authService';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width } = Dimensions.get('window');

// Interface definitions
interface UserPost {
  id: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  date: string;
}

interface UserData {
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  farmName: string;
  location: string;
  memberSince: string;
  profileImage: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  isVerified: boolean;
  badges: string[];
}

// Mock data for user posts
const USER_POSTS = [
  {
    id: '1',
    author: 'John Doe',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    content: 'Just implemented a new feeding system that increased my egg production by 15%!',
    image: 'https://images.unsplash.com/photo-1569597967185-cd6120712154?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    likes: 24,
    comments: 7,
    time: '3 days ago',
    tags: ['EggProduction', 'FeedingSystem'],
  },
  {
    id: '2',
    author: 'John Doe',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    content: 'New isolation pen for birds with potential disease symptoms',
    image: 'https://images.unsplash.com/photo-1567450133695-a2295c419120?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    likes: 42,
    comments: 12,
    time: '1 week ago',
    tags: ['DiseasePrevention', 'BirdHealth'],
  },
  {
    id: '3',
    author: 'John Doe',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    content: 'Solar-powered ventilation system for the poultry house',
    image: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    likes: 78,
    comments: 23,
    time: '3 weeks ago',
    tags: ['Sustainability', 'Ventilation'],
  },
];

type ProfileStackParamList = {
  Profile: undefined;
  PostDetail: { postId: string; post: UserPost };
};

type ProfileScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'Profile'>;

const ProfileScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
  const [activeTab, setActiveTab] = useState('posts'); // 'posts', 'saved', 'tagged'
  const [showSettings, setShowSettings] = useState(false);
  const [createPostVisible, setCreatePostVisible] = useState(false);
  const [postImage, setPostImage] = useState<string | null>(null);
  const [postCaption, setPostCaption] = useState('');
  const [posts, setPosts] = useState<UserPost[]>(USER_POSTS);
  const [fabOpen, setFabOpen] = useState(false);
  
  // Dummy user data - in a real app, you would fetch this from Firebase
  const [userData, setUserData] = useState<UserData>({
    name: 'John Doe',
    username: 'johndoe_poultry',
    email: 'john.doe@example.com',
    phoneNumber: '+234 801 234 5678',
    farmName: 'Green Valley Poultry',
    location: 'Lagos, Nigeria',
    memberSince: 'January 2023',
    profileImage: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    bio: 'Passionate poultry farmer focused on sustainable practices and optimal bird health. 5 years experience in both layers and broilers.',
    followers: 128,
    following: 87,
    posts: 23,
    isVerified: true,
    badges: ['verified_seller', 'verified_buyer'],
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  useEffect(() => {
    // In a real app, you would fetch user data here
    const fetchUserData = async () => {
      try {
        // Implement real data fetching here
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchUserData();
  }, []);
  
  const handleEditProfile = () => {
    // Navigate to edit profile screen
    console.log('Navigate to edit profile');
    // navigation.navigate('EditProfile');
  };
  
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      // Navigate to Welcome screen after successful logout
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
      setSnackbarMessage(t('profile.logoutSuccess'));
      setSnackbarType('success');
      setSnackbarVisible(true);
    } catch (error) {
      console.error('Error logging out:', error);
      setSnackbarMessage(t('profile.logoutError'));
      setSnackbarType('error');
      setSnackbarVisible(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  const confirmLogout = () => {
    Alert.alert(
      t('profile.logoutTitle'),
      t('profile.logoutConfirm'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.logout'),
          onPress: handleLogout,
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };
  
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const openCreatePost = () => {
    setCreatePostVisible(true);
  };

  const closeCreatePost = () => {
    setCreatePostVisible(false);
    setPostImage(null);
    setPostCaption('');
  };

  const pickImage = async () => {
    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        setSnackbarMessage('Media library permission is required');
        setSnackbarType('error');
        setSnackbarVisible(true);
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPostImage(result.assets[0].uri);
        setFabOpen(false);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      setSnackbarMessage('Failed to pick image');
      setSnackbarType('error');
      setSnackbarVisible(true);
    }
  };

  const takePhoto = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        setSnackbarMessage('Camera permission is required');
        setSnackbarType('error');
        setSnackbarVisible(true);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPostImage(result.assets[0].uri);
        setFabOpen(false);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      setSnackbarMessage('Failed to take photo');
      setSnackbarType('error');
      setSnackbarVisible(true);
    }
  };

  const createPost = () => {
    if (!postImage) {
      setSnackbarMessage('Please select an image');
      setSnackbarType('error');
      setSnackbarVisible(true);
      return;
    }

    if (!postCaption.trim()) {
      setSnackbarMessage('Please add a caption');
      setSnackbarType('error');
      setSnackbarVisible(true);
      return;
    }

    // Create new post
    const newPost: UserPost = {
      id: `${Date.now()}`,
      image: postImage,
      caption: postCaption,
      likes: 0,
      comments: 0,
      date: 'Just now',
    };

    // Add to posts list
    setPosts([newPost, ...posts]);

    // Update user data
    setUserData(prev => ({
      ...prev,
      posts: prev.posts + 1,
    }));

    // Close modal
    closeCreatePost();

    // Show success message
    setSnackbarMessage('Post created successfully!');
    setSnackbarType('success');
    setSnackbarVisible(true);

    // In a real app, you would send this to the server
    console.log('New post created:', newPost);
  };
  
  const handlePostPress = (post: typeof USER_POSTS[0]) => {
    navigation.navigate('PostDetail', { 
      postId: post.id,
      post: {
        id: post.id,
        author: post.author,
        authorAvatar: post.authorAvatar,
        content: post.content,
        image: post.image,
        likes: post.likes,
        comments: post.comments,
        time: post.time,
        tags: post.tags
      }
    });
  };

  const renderPostItem = ({ item }: { item: typeof USER_POSTS[0] }) => (
    <Card style={styles.card} onPress={() => handlePostPress(item)}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.header}>
          <Avatar.Image 
            source={{ uri: item.authorAvatar }} 
            size={40}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.authorName}>{item.author}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <MaterialIcons name="more-vert" size={20} color="#757575" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.content}>{item.content}</Text>
        
        {item.image && (
        <Image 
          source={{ uri: item.image }} 
            style={styles.image} 
          resizeMode="cover"
        />
        )}
        
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.map((tag, index) => (
              <View key={index} style={styles.tagContainer}>
                <Text style={styles.tag}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="favorite-border" size={20} color="#757575" />
            <Text style={styles.actionText}>{item.likes}</Text>
      </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="chat-bubble-outline" size={20} color="#757575" />
            <Text style={styles.actionText}>{item.comments}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="share" size={20} color="#757575" />
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  const renderBadge = (badgeType: string) => {
    switch (badgeType) {
      case 'verified_seller':
        return (
          <Chip 
            style={styles.badgeChip}
            textStyle={styles.badgeText}
            icon={() => <FontAwesome5 name="store" size={14} color="#276749" />}
          >
            Verified Seller
          </Chip>
        );
      case 'verified_buyer':
        return (
          <Chip 
            style={styles.badgeChip}
            textStyle={styles.badgeText}
            icon={() => <FontAwesome5 name="shopping-cart" size={14} color="#276749" />}
          >
            Verified Buyer
          </Chip>
        );
      default:
        return null;
    }
  };
  
  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.appHeader}>
          <Text style={styles.companyName}>PoultryLink</Text>
            <IconButton 
            icon="cog" 
              size={24} 
            iconColor="#666666" 
              onPress={toggleSettings} 
            />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {showSettings ? (
            <View style={styles.settingsContainer}>
              <View style={styles.settingsHeader}>
                <Text style={styles.settingsTitle}>Settings</Text>
                    <IconButton 
                      icon="close" 
                      size={24} 
                  iconColor="#666666" 
                      onPress={toggleSettings} 
                    />
                  </View>

              <View style={styles.settingsSection}>
                <Text style={styles.settingsSectionTitle}>Account</Text>
                <TouchableOpacity style={styles.settingItem} onPress={handleEditProfile}>
                  <View style={styles.settingItemLeft}>
                    <View style={[styles.settingIcon, { backgroundColor: '#E6F3FF' }]}>
                      <MaterialIcons name="person" size={20} color="#3182CE" />
                      </View>
                    <Text style={styles.settingItemText}>Edit Profile</Text>
                    </View>
                  <MaterialIcons name="chevron-right" size={24} color="#666666" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                  <View style={styles.settingItemLeft}>
                    <View style={[styles.settingIcon, { backgroundColor: '#F0FFF4' }]}>
                      <MaterialIcons name="notifications" size={20} color="#276749" />
                    </View>
                    <Text style={styles.settingItemText}>Notifications</Text>
                  </View>
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    color="#276749"
                  />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                  <View style={styles.settingItemLeft}>
                    <View style={[styles.settingIcon, { backgroundColor: '#FFF5F5' }]}>
                      <MaterialIcons name="security" size={20} color="#E53E3E" />
                </View>
                    <Text style={styles.settingItemText}>Privacy & Security</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color="#666666" />
                </TouchableOpacity>
              </View>

              <View style={styles.settingsSection}>
                <Text style={styles.settingsSectionTitle}>Appearance</Text>
                <TouchableOpacity style={styles.settingItem}>
                  <View style={styles.settingItemLeft}>
                    <View style={[styles.settingIcon, { backgroundColor: '#F0F9FF' }]}>
                      <MaterialIcons name="brightness-4" size={20} color="#3182CE" />
                    </View>
                    <Text style={styles.settingItemText}>Dark Mode</Text>
                  </View>
                  <Switch
                    value={darkMode}
                    onValueChange={setDarkMode}
                    color="#3182CE"
                  />
                </TouchableOpacity>
                </View>

              <View style={styles.settingsSection}>
                <Text style={styles.settingsSectionTitle}>Support</Text>
                <TouchableOpacity style={styles.settingItem}>
                  <View style={styles.settingItemLeft}>
                    <View style={[styles.settingIcon, { backgroundColor: '#F0F9FF' }]}>
                      <MaterialIcons name="help" size={20} color="#3182CE" />
                      </View>
                    <Text style={styles.settingItemText}>Help Center</Text>
                    </View>
                  <MaterialIcons name="chevron-right" size={24} color="#666666" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                  <View style={styles.settingItemLeft}>
                    <View style={[styles.settingIcon, { backgroundColor: '#F0F9FF' }]}>
                      <MaterialIcons name="info" size={20} color="#3182CE" />
                      </View>
                    <Text style={styles.settingItemText}>About</Text>
                    </View>
                  <MaterialIcons name="chevron-right" size={24} color="#666666" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
                <View style={styles.settingItemLeft}>
                  <View style={[styles.settingIcon, { backgroundColor: '#FFF5F5' }]}>
                        <MaterialIcons name="logout" size={20} color="#E53E3E" />
                      </View>
                  <Text style={[styles.settingItemText, { color: '#E53E3E' }]}>Logout</Text>
                  </View>
                </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.profileSection}>
                <View style={styles.profileHeader}>
                  <View style={styles.profileImageContainer}>
                    <Avatar.Image 
                      size={90} 
                      source={{ uri: userData.profileImage }} 
                      style={styles.avatar}
                    />
                  </View>
                  <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                      <Text style={styles.statNumber}>{userData.posts}</Text>
                      <Text style={styles.statLabel}>{t('profile.posts')}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statNumber}>{userData.followers}</Text>
                      <Text style={styles.statLabel}>{t('profile.followers')}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.bioSection}>
                  <View style={styles.nameRow}>
                    <Text style={styles.displayName}>{userData.name}</Text>
                    {userData.isVerified && (
                      <MaterialIcons name="verified" size={16} color="#3182CE" style={styles.verifiedBadge} />
                    )}
                  </View>
                  <Text style={styles.farmName}>{userData.farmName}</Text>
                  <Text style={styles.bioText}>{userData.bio}</Text>
                  <View style={styles.locationContainer}>
                    <MaterialIcons name="location-on" size={14} color="#666666" />
                    <Text style={styles.locationText}>{userData.location}</Text>
                  </View>

                  <View style={styles.badgesContainer}>
                    {userData.badges.map((badge, index) => (
                      <View key={index} style={styles.badgeItem}>
                        {renderBadge(badge)}
                      </View>
                    ))}
                  </View>
                </View>
                </View>

              <View style={styles.postsSection}>
                <View style={styles.postsHeader}>
                  <Text style={styles.postsTitle}>Recent Posts</Text>
                  <IconButton 
                    icon="plus" 
                    size={24} 
                    iconColor="#666666" 
                    onPress={openCreatePost} 
                  />
              </View>
                <FlatList
                  data={USER_POSTS}
                  renderItem={renderPostItem}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.postsList}
                  showsVerticalScrollIndicator={false}
                />
                </View>
            </>
          )}
        </ScrollView>

        {/* Create Post Modal */}
        <Modal
          visible={createPostVisible}
          animationType="slide"
          transparent={false}
          onRequestClose={closeCreatePost}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <IconButton
                icon="close"
                size={24}
                onPress={closeCreatePost}
                iconColor="#4A5568"
              />
              <Text style={styles.modalTitle}>Create Post</Text>
              <Button
                mode="text"
                onPress={createPost}
                loading={isLoading}
                disabled={!postImage || !postCaption.trim()}
                labelStyle={{ color: '#276749' }}
              >
                Share
              </Button>
            </View>
            <Divider />

            <ScrollView style={styles.modalContent}>
              {!postImage ? (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>No image selected</Text>
                  
                  <Portal>
                    <FAB.Group
                      visible
                      open={fabOpen}
                      icon={fabOpen ? 'close' : 'image'}
                      actions={[
                        {
                          icon: 'camera',
                          label: 'Take Photo',
                          onPress: takePhoto,
                        },
                        {
                          icon: 'image-album',
                          label: 'Choose from Gallery',
                          onPress: pickImage,
                        },
                      ]}
                      onStateChange={({ open }) => setFabOpen(open)}
                      fabStyle={styles.fab}
                    />
                  </Portal>
                </View>
              ) : (
                <>
                  <Image
                    source={{ uri: postImage }}
                    style={styles.selectedImage}
                    resizeMode="cover"
                  />
                  <IconButton
                    icon="close-circle"
                    size={28}
                    iconColor="#E53E3E"
                    style={styles.removeImageButton}
                    onPress={() => setPostImage(null)}
                  />
                </>
              )}

              <View style={styles.captionContainer}>
                <TextInput
                  style={styles.captionInput}
                  placeholder="Write a caption..."
                  placeholderTextColor="#A0AEC0"
                  multiline
                  value={postCaption}
                  onChangeText={setPostCaption}
                />
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          style={snackbarType === 'error' ? styles.errorSnackbar : styles.successSnackbar}
        >
          {snackbarMessage}
        </Snackbar>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  companyName: {
    fontSize: 20,
    fontWeight: '500',
    color: '#333333',
  },
  profileSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  profileImageContainer: {
    marginRight: 20,
  },
  avatar: {
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
  },
  bioSection: {
    marginBottom: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  displayName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  farmName: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  bioText: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
    lineHeight: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 2,
  },
  badgesContainer: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  badgeItem: {
    marginRight: 8,
    marginBottom: 4,
  },
  badgeChip: {
    backgroundColor: '#F5F5F5',
  },
  badgeText: {
    fontSize: 10,
    color: '#666666',
  },
  postsSection: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  postsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  postsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  postsList: {
    paddingVertical: 8,
  },
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
  settingsContainer: {
    padding: 16,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333333',
  },
  settingsSection: {
    marginBottom: 20,
  },
  settingsSectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingItemText: {
    fontSize: 15,
    color: '#333333',
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 10,
  },
  successSnackbar: {
    backgroundColor: '#276749',
  },
  errorSnackbar: {
    backgroundColor: '#E53E3E',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    height: 56,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A202C',
  },
  modalContent: {
    flex: 1,
  },
  imagePlaceholder: {
    height: 300,
    backgroundColor: '#EDF2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: '#718096',
    marginBottom: 16,
  },
  selectedImage: {
    width: '100%',
    height: 300,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 24,
  },
  captionContainer: {
    padding: 16,
  },
  captionInput: {
    fontSize: 16,
    color: '#1A202C',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  fab: {
    backgroundColor: '#276749',
  },
});

export default ProfileScreen; 