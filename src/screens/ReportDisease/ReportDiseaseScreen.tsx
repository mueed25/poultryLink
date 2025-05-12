import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../contexts/AuthContext';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { generateAIResponse } from '../../services/AIService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  attachments?: string[];
}

export const ReportDiseaseScreen = () => {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const pickImage = async () => {
    if (selectedImages.length >= 3) {
      showSnackbar('You can only attach up to 3 images', 'warning');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImages([...selectedImages, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!inputText.trim() && selectedImages.length === 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      attachments: selectedImages,
    };

    setMessages([...messages, newMessage]);
    setInputText('');
    setSelectedImages([]);
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse({
        message: inputText,
        images: selectedImages,
        context: 'poultry_health',
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      showSnackbar('Failed to get AI response', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (message: Message) => {
    const isAI = message.sender === 'ai';
    
    return (
      <Animated.View
        key={message.id}
        style={[
          styles.messageContainer,
          isAI ? styles.aiMessage : styles.userMessage,
        ]}
      >
        {isAI && (
          <View style={styles.aiHeader}>
            <MaterialIcons name="smart-toy" size={24} color="#276749" />
            <Text style={styles.aiName}>Poultry Health AI</Text>
          </View>
        )}
        
        <Text style={styles.messageText}>{message.text}</Text>
        
        {message.attachments && message.attachments.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.attachmentsContainer}
          >
            {message.attachments.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.attachmentImage} />
                {isAI && (
                  <View style={styles.imageOverlay}>
                    <MaterialIcons name="zoom-in" size={24} color="#FFFFFF" />
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        )}

        <Text style={styles.timestamp}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </Animated.View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Health Assistant</Text>
        <Text style={styles.subtitle}>
          Describe any health issues. Our AI consultant will help you.
        </Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map(renderMessage)}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#276749" />
            <Text style={styles.loadingText}>AI is analyzing...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        {selectedImages.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.imageScroll}
          >
            {selectedImages.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeImage}
                  onPress={() => removeImage(index)}
                >
                  <MaterialIcons name="close" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}
            {selectedImages.length < 3 && (
              <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                <MaterialIcons name="add-a-photo" size={24} color="#666666" />
                <Text style={styles.addImageText}>Add Photo</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        )}

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Describe the symptoms or health issues..."
            placeholderTextColor="#999999"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            disabled={isLoading || (!inputText.trim() && selectedImages.length === 0)}
          >
            <MaterialIcons
              name="send"
              size={24}
              color={isLoading || (!inputText.trim() && selectedImages.length === 0) ? '#999999' : '#276749'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 16,
    backgroundColor: '#F7FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#4A5568',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#F0FFF4',
    borderTopRightRadius: 4,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F7FAFC',
    borderTopLeftRadius: 4,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#276749',
    marginLeft: 8,
  },
  messageText: {
    fontSize: 14,
    color: '#2D3748',
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: '#718096',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  attachmentsContainer: {
    marginTop: 8,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 8,
  },
  attachmentImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    marginBottom: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4A5568',
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  imageScroll: {
    marginBottom: 8,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
  removeImage: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 2,
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 24,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    fontSize: 14,
    color: '#2D3748',
    paddingVertical: 8,
  },
  sendButton: {
    padding: 8,
  },
});