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
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/Card';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { signOut } from '../../services/authService';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

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
const USER_POSTS: UserPost[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1569597967185-cd6120712154?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    caption: 'Just implemented a new feeding system that increased my egg production by 15%!',
    likes: 24,
    comments: 7,
    date: '3 days ago',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1567450133695-a2295c419120?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    caption: 'New isolation pen for birds with potential disease symptoms',
    likes: 42,
    comments: 12,
    date: '1 week ago',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    caption: 'Solar-powered ventilation system for the poultry house',
    likes: 78,
    comments: 23,
    date: '3 weeks ago',
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    caption: 'Improved ventilation for better air quality',
    likes: 35,
    comments: 8,
    date: '1 month ago',
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1534470397334-1975940ece1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    caption: 'New feed mix with enhanced nutrition',
    likes: 62,
    comments: 17,
    date: '2 months ago',
  },
];

const ProfileScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
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
      await signOut();
      // Navigate to login screen
      // navigation.navigate('SignIn');
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
  
  const renderPostItem = ({ item, index }: { item: UserPost; index: number }) => {
    // Calculate number of columns (3) to determine dimensions
    const imageSize = width / 3;
    return (
      <TouchableOpacity 
        style={[styles.postItem, { width: imageSize, height: imageSize }]}
        onPress={() => console.log('View post', item.id)}
      >
        <Image 
          source={{ uri: item.image }} 
          style={styles.postImage} 
          resizeMode="cover"
        />
        {item.comments > 0 && (
          <View style={styles.commentsIndicator}>
            <MaterialIcons name="chat-bubble" size={12} color="#FFF" />
            <Text style={styles.commentCount}>{item.comments}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

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
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.username}>{userData.username}</Text>
            {userData.isVerified && (
              <MaterialIcons name="verified" size={20} color="#3182CE" style={styles.verifiedBadge} />
            )}
          </View>
          <View style={styles.headerRight}>
            <IconButton 
              icon="plus-box-outline" 
              size={24} 
              iconColor="#276749" 
              onPress={openCreatePost} 
            />
            <IconButton 
              icon="menu" 
              size={24} 
              iconColor="#276749" 
              onPress={toggleSettings} 
            />
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {showSettings ? (
            <View style={styles.settingsContainer}>
              <Surface style={styles.settingsCard} elevation={2}>
                <LinearGradient
                  colors={['#F7FAFC', '#EDF2F7']}
                  style={styles.settingGradient}
                >
                  <View style={styles.settingHeader}>
                    <Title style={styles.settingTitle}>{t('profile.settings')}</Title>
                    <IconButton 
                      icon="close" 
                      size={24} 
                      iconColor="#4A5568" 
                      onPress={toggleSettings} 
                    />
                  </View>
                </LinearGradient>
                <Divider />
                
                <TouchableOpacity onPress={handleEditProfile}>
                  <View style={styles.settingItem}>
                    <View style={styles.settingLeft}>
                      <View style={styles.iconCircle}>
                        <MaterialIcons name="account-circle" size={20} color="#276749" />
                      </View>
                      <Text style={styles.settingText}>{t('profile.editProfile')}</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color="#A0AEC0" />
                  </View>
                </TouchableOpacity>
                <Divider />
                
                <View style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <View style={styles.iconCircle}>
                      <MaterialIcons name="notifications" size={20} color="#276749" />
                    </View>
                    <Text style={styles.settingText}>{t('profile.notifications')}</Text>
                  </View>
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    color="#276749"
                  />
                </View>
                <Divider />
                
                <View style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <View style={styles.iconCircle}>
                      <MaterialIcons name="brightness-4" size={20} color="#276749" />
                    </View>
                    <Text style={styles.settingText}>{t('profile.darkMode')}</Text>
                  </View>
                  <Switch
                    value={darkMode}
                    onValueChange={setDarkMode}
                    color="#276749"
                  />
                </View>
                <Divider />
                
                <TouchableOpacity>
                  <View style={styles.settingItem}>
                    <View style={styles.settingLeft}>
                      <View style={styles.iconCircle}>
                        <MaterialIcons name="security" size={20} color="#276749" />
                      </View>
                      <Text style={styles.settingText}>{t('profile.privacy')}</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color="#A0AEC0" />
                  </View>
                </TouchableOpacity>
                <Divider />
                
                <TouchableOpacity>
                  <View style={styles.settingItem}>
                    <View style={styles.settingLeft}>
                      <View style={styles.iconCircle}>
                        <MaterialIcons name="help-outline" size={20} color="#276749" />
                      </View>
                      <Text style={styles.settingText}>{t('profile.help')}</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color="#A0AEC0" />
                  </View>
                </TouchableOpacity>
                <Divider />
                
                <TouchableOpacity onPress={confirmLogout}>
                  <View style={styles.settingItem}>
                    <View style={styles.settingLeft}>
                      <View style={[styles.iconCircle, styles.logoutIconCircle]}>
                        <MaterialIcons name="logout" size={20} color="#E53E3E" />
                      </View>
                      <Text style={styles.logoutText}>{t('common.logout')}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Surface>
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
                    <MaterialIcons name="location-on" size={14} color="#718096" />
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
                
                <View style={styles.buttonRow}>
                  <Button 
                    mode="outlined" 
                    onPress={handleEditProfile}
                    style={styles.editProfileButton}
                    labelStyle={styles.editButtonLabel}
                  >
                    {t('profile.editProfile')}
                  </Button>
                  <Button 
                    mode="outlined" 
                    onPress={() => console.log('Share profile')}
                    style={styles.shareProfileButton}
                    labelStyle={styles.shareButtonLabel}
                  >
                    {t('profile.shareProfile')}
                  </Button>
                </View>

                <View style={styles.highlightsContainer}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {/* Story highlights */}
                    <View style={styles.highlightItem}>
                      <View style={styles.highlightCircle}>
                        <MaterialIcons name="add" size={24} color="#276749" />
                      </View>
                      <Text style={styles.highlightText}>New</Text>
                    </View>
                    <View style={styles.highlightItem}>
                      <View style={styles.highlightCircle}>
                        <Image 
                          source={{ uri: 'https://images.unsplash.com/photo-1569597967185-cd6120712154?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }} 
                          style={styles.highlightImage} 
                        />
                      </View>
                      <Text style={styles.highlightText}>Feeding</Text>
                    </View>
                    <View style={styles.highlightItem}>
                      <View style={styles.highlightCircle}>
                        <Image 
                          source={{ uri: 'https://images.unsplash.com/photo-1567450133695-a2295c419120?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }} 
                          style={styles.highlightImage} 
                        />
                      </View>
                      <Text style={styles.highlightText}>Health</Text>
                    </View>
                    <View style={styles.highlightItem}>
                      <View style={styles.highlightCircle}>
                        <Image 
                          source={{ uri: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }} 
                          style={styles.highlightImage} 
                        />
                      </View>
                      <Text style={styles.highlightText}>Systems</Text>
                    </View>
                  </ScrollView>
                </View>
              </View>
              
              <View style={styles.tabsContainer}>
                <TouchableOpacity 
                  style={[
                    styles.tab, 
                    activeTab === 'posts' && styles.activeTab
                  ]}
                  onPress={() => setActiveTab('posts')}
                >
                  <MaterialIcons 
                    name="grid-on" 
                    size={24} 
                    color={activeTab === 'posts' ? '#276749' : '#718096'} 
                  />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.tab, 
                    activeTab === 'saved' && styles.activeTab
                  ]}
                  onPress={() => setActiveTab('saved')}
                >
                  <MaterialIcons 
                    name="bookmark-border" 
                    size={24} 
                    color={activeTab === 'saved' ? '#276749' : '#718096'} 
                  />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.tab, 
                    activeTab === 'tagged' && styles.activeTab
                  ]}
                  onPress={() => setActiveTab('tagged')}
                >
                  <MaterialIcons 
                    name="person-pin" 
                    size={24} 
                    color={activeTab === 'tagged' ? '#276749' : '#718096'} 
                  />
                </TouchableOpacity>
              </View>
              
              {activeTab === 'posts' && (
                <FlatList
                  data={posts}
                  renderItem={renderPostItem}
                  keyExtractor={item => item.id}
                  numColumns={3}
                  scrollEnabled={false}
                  contentContainerStyle={styles.postsGrid}
                />
              )}
              
              {activeTab === 'saved' && (
                <View style={styles.emptyStateContainer}>
                  <MaterialIcons name="bookmark" size={48} color="#CBD5E0" />
                  <Text style={styles.emptyStateText}>No saved posts yet</Text>
                </View>
              )}
              
              {activeTab === 'tagged' && (
                <View style={styles.emptyStateContainer}>
                  <MaterialIcons name="person-pin" size={48} color="#CBD5E0" />
                  <Text style={styles.emptyStateText}>No tagged posts</Text>
                </View>
              )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A202C',
  },
  verifiedBadge: {
    marginLeft: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
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
    borderWidth: 3,
    borderColor: '#276749',
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
    fontWeight: 'bold',
    color: '#1A202C',
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
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
    fontWeight: 'bold',
    color: '#1A202C',
  },
  farmName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#276749',
    marginBottom: 4,
  },
  bioText: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 4,
    lineHeight: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#718096',
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
    backgroundColor: '#F0FFF4',
  },
  badgeText: {
    fontSize: 10,
    color: '#276749',
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  editProfileButton: {
    flex: 1,
    marginRight: 8,
    borderRadius: 6,
    borderColor: '#E2E8F0',
  },
  editButtonLabel: {
    fontSize: 14,
    color: '#1A202C',
  },
  shareProfileButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 6,
    borderColor: '#E2E8F0',
  },
  shareButtonLabel: {
    fontSize: 14,
    color: '#1A202C',
  },
  highlightsContainer: {
    marginBottom: 16,
  },
  highlightItem: {
    alignItems: 'center',
    marginRight: 14,
  },
  highlightCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    overflow: 'hidden',
  },
  highlightImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  highlightText: {
    fontSize: 12,
    color: '#718096',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#276749',
  },
  postsGrid: {
    flexGrow: 1,
  },
  postItem: {
    position: 'relative',
    borderWidth: 0.5,
    borderColor: '#FFFFFF',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  commentsIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentCount: {
    color: '#FFFFFF',
    fontSize: 10,
    marginLeft: 2,
  },
  emptyStateContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    marginTop: 12,
    color: '#718096',
    fontSize: 16,
  },
  settingsContainer: {
    padding: 16,
  },
  settingsCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingGradient: {
    width: '100%',
  },
  settingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingTitle: {
    fontSize: 18,
    color: '#276749',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    backgroundColor: '#F0FFF4',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoutIconCircle: {
    backgroundColor: '#FFF5F5',
  },
  settingText: {
    fontSize: 16,
    color: '#4A5568',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  logoutText: {
    fontSize: 16,
    color: '#E53E3E',
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