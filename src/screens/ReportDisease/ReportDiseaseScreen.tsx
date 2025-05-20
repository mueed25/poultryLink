import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Chip, useTheme, Menu, IconButton, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';

interface Message {
  id: string;
  from: 'user' | 'bot';
  text: string;
}

type Language = 'en' | 'ha' | 'ig' | 'yo';

const LANG_LABELS: Record<Language, string> = {
  en: 'English',
  ha: 'Hausa',
  ig: 'Igbo',
  yo: 'Yoruba'
};

const QUICK_OPTIONS: string[] = [
  'Fever',
  'Cough',
  'Diarrhea',
  'Skin Rash',
  'Lethargy',
];

const BACKEND_URL = 'http://<backend-host>/ai/diagnose';

export const ReportDiseaseScreen: React.FC = () => {
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      from: 'bot',
      text: "Assalamu alaikum! I am your virtual vet assistant. Describe your animal's symptoms or choose an option below."
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [lang, setLang] = useState<Language>('en');
  const [menuVisible, setMenuVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), from: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post<{ reply: string }>(BACKEND_URL, {
        message: text,
        language: LANG_LABELS[lang].toLowerCase()
      });

      setIsTyping(false);
      const botMsg: Message = {
        id: 'bot_' + Date.now().toString(),
        from: 'bot',
        text: response.data.reply
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: 'err_' + Date.now().toString(),
          from: 'bot',
          text: lang === 'ha'
            ? 'An samu matsala wajen samun amsa. Don Allah a gwada sake.'
            : 'Failed to fetch response. Please try again.'
        }
      ]);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.bubble,
        item.from === 'user' ? styles.userBubble : styles.botBubble
      ]}
    >
      <Text style={
        item.from === 'user' ? styles.userText : styles.botText
      }>
        {item.text}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Vet Assistant</Text>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="translate"
              size={24}
              onPress={() => setMenuVisible(true)}
            />
          }
        >
          {Object.entries(LANG_LABELS).map(([key, label]) => (
            <Menu.Item
              key={key}
              onPress={() => { setLang(key as Language); setMenuVisible(false); }}
              title={label}
            />
          ))}
        </Menu>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatContainer}
        renderItem={renderMessage}
      />

      {isTyping && (
        <View style={styles.typingIndicator}>
          <ActivityIndicator animating />
          <Text style={styles.botText}>...</Text>
        </View>
      )}

      <View style={styles.optionsContainer}>
        {QUICK_OPTIONS.map(option => (
          <Chip
            key={option}
            style={styles.chip}
            onPress={() => sendMessage(option)}
          >
            {option}
          </Chip>
        ))}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { borderColor: theme.colors.primary }]}
          placeholder={
            lang === 'ha'
              ? 'Shigar da alamomi...'
              : lang === 'ig'
              ? 'Tinye mgbaàmà...'
              : lang === 'yo'
              ? 'Tẹ awọn aami...'
              : 'Describe symptoms...'
          }
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => sendMessage(input)}
        />
        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: theme.colors.primary }]}
          onPress={() => sendMessage(input)}
        >
          <Text style={styles.sendText}>
            {lang === 'ha'
              ? 'Aika'
              : lang === 'ig'
              ? 'Zipu'
              : lang === 'yo'
              ? 'Fi ranṣẹ'
              : 'Send'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2
  },
  headerText: { fontSize: 20, fontWeight: 'bold' },
  chatContainer: { padding: 16, paddingBottom: 0 },
  bubble: { marginVertical: 4, padding: 12, borderRadius: 12, maxWidth: '80%' },
  userBubble: { backgroundColor: '#DCF8C6', alignSelf: 'flex-end' },
  botBubble: { backgroundColor: '#FFFFFF', alignSelf: 'flex-start', elevation: 1 },
  userText: { color: '#000' },
  botText: { color: '#333' },
  typingIndicator: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 },
  optionsContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, paddingBottom: 8 },
  chip: { margin: 4 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#FFFFFF' },
  input: { flex: 1, borderWidth: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginRight: 8 },
  sendBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20 },
  sendText: { color: '#FFF', fontWeight: 'bold' }
});
