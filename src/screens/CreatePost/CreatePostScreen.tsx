import React, { useState } from 'react';
import { View, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, Platform, Alert } from 'react-native';
import { Text, Button, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { MaterialIcons } from '@expo/vector-icons';

type CreatePostScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const CreatePostScreen = () => {
  const navigation = useNavigation<CreatePostScreenNavigationProp>();
  const [postContent, setPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');

  const handleAddTag = () => {
    if (currentTag.trim() !== '' && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSelectImage = () => {
    // Mock image selection
    // In a real app, you would use react-native-image-picker or expo-image-picker
    const mockImages = [
      'https://images.unsplash.com/photo-1548550019-d29a3b1e0f21',
      'https://images.unsplash.com/photo-1508252323578-e855df5d2281',
      'https://images.unsplash.com/photo-1569428034239-f9565e32e224',
    ];
    
    setSelectedImage(mockImages[Math.floor(Math.random() * mockImages.length)]);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const handlePublishPost = () => {
    if (postContent.trim() === '') {
      Alert.alert('Error', 'Please enter some content for your post');
      return;
    }
    
    // Here you would send the post to your API
    // For now, we'll just navigate back to the feed
    
    Alert.alert('Success', 'Your post has been published!', [
      {
        text: 'OK',
        onPress: () => navigation.goBack()
      }
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <Button
          mode="contained"
          style={styles.publishButton}
          labelStyle={styles.publishButtonText}
          disabled={postContent.trim() === ''}
          onPress={handlePublishPost}
        >
          Publish
        </Button>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Post Input */}
        <TextInput
          style={styles.input}
          placeholder="What's on your mind about poultry farming?"
          placeholderTextColor="#9E9E9E"
          multiline
          value={postContent}
          onChangeText={setPostContent}
          autoFocus
        />
        
        {/* Selected Image Preview */}
        {selectedImage && (
          <View style={styles.imagePreviewContainer}>
            <Image 
              source={{ uri: selectedImage }} 
              style={styles.imagePreview} 
              resizeMode="cover"
            />
            <TouchableOpacity 
              style={styles.removeImageButton}
              onPress={handleRemoveImage}
            >
              <MaterialIcons name="cancel" color="#FFFFFF" size={24} />
            </TouchableOpacity>
          </View>
        )}
        
        {/* Tags Input */}
        <View style={styles.tagsInputContainer}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.tagInput}>
            <TextInput
              style={styles.tagInputField}
              placeholder="Add relevant tags (e.g. CoopDesign)"
              placeholderTextColor="#9E9E9E"
              value={currentTag}
              onChangeText={setCurrentTag}
              onSubmitEditing={handleAddTag}
            />
            <TouchableOpacity
              style={styles.addTagButton}
              onPress={handleAddTag}
              disabled={currentTag.trim() === ''}
            >
              <MaterialIcons 
                name="add" 
                color={currentTag.trim() === '' ? '#BDBDBD' : '#4CAF50'} 
                size={20} 
              />
            </TouchableOpacity>
          </View>
          
          {/* Tags Display */}
          {tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <View key={index} style={styles.tagContainer}>
                  <Text style={styles.tag}>#{tag}</Text>
                  <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                    <MaterialIcons name="close" color="#4CAF50" size={16} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Footer with actions */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={handleSelectImage}
        >
          <MaterialIcons name="image" color="#4CAF50" size={24} />
          <Text style={styles.footerButtonText}>Photo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.footerButton}>
          <MaterialIcons name="camera-alt" color="#4CAF50" size={24} />
          <Text style={styles.footerButtonText}>Camera</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.footerButton}>
          <MaterialIcons name="attach-file" color="#4CAF50" size={24} />
          <Text style={styles.footerButtonText}>Attach</Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  publishButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
  },
  publishButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  input: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  imagePreviewContainer: {
    marginTop: 16,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 4,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#333333',
  },
  tagsInputContainer: {
    marginTop: 16,
  },
  tagInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  tagInputField: {
    flex: 1,
    paddingVertical: 8,
  },
  addTagButton: {
    padding: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tagContainer: {
    backgroundColor: '#F0F5F0',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    fontSize: 14,
    color: '#4CAF50',
    marginRight: 4,
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  footerButtonText: {
    marginLeft: 4,
    color: '#4CAF50',
  },
});

export default CreatePostScreen; 