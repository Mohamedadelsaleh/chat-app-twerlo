import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, Chat, ChatContextType } from '../types/chat';
import { useAuth } from './AuthContext';
import { mockChats } from '../api/mockData';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const savedChats = localStorage.getItem('chatAppChats');
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
  }, []);

useEffect(() => {
  if (currentChat) {
    const savedMessages = localStorage.getItem(`chatAppMessages_${currentChat.id}`);
    const parsedMessages = savedMessages ? JSON.parse(savedMessages) : [];
    
    // Filter out any potential duplicates or invalid messages
    const validMessages = parsedMessages.filter((msg: Message) => 
      msg && msg.id && msg.content && msg.timestamp
    );
    
    setMessages(validMessages);
  }
}, [currentChat]);

  const selectChat = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId) || null;
    setCurrentChat(chat);
  };

const saveMessage = (message: Message) => {
  // First update the messages state
  setMessages(prev => {
    const newMessages = [...prev, message];
    
    // Then save to localStorage
    if (currentChat) {
      localStorage.setItem(
        `chatAppMessages_${currentChat.id}`, 
        JSON.stringify(newMessages)
      );
    }
    
    // Update last message in chats
    const updatedChats = chats.map(chat => {
      if (chat.id === currentChat?.id) {
        return { ...chat, lastMessage: message };
      }
      return chat;
    });
    
    localStorage.setItem('chatAppChats', JSON.stringify(updatedChats));
    setChats(updatedChats);
    
    return newMessages;
  });
};

const sendMessage = async (content: string, receiverId: string, isBroadcast = false, media?: File) => {
  if (!user || !currentChat) return;
  if (!user || isBroadcast) return;
  // Create and save user's message immediately
  const userMessage: Message = {
    id: uuidv4(),
    senderId: user.id,
    receiverId,
    content,
    timestamp: new Date(),
    isBroadcast,
    media: media ? {
      url: URL.createObjectURL(media),
      type: media.type.startsWith('image') ? 'image' : 'video'
    } : undefined
  };

  saveMessage(userMessage);

  // If sending to the bot, simulate response after delay
  if (receiverId === '4') {
    setTimeout(() => {
      const botResponse: Message = {
        id: uuidv4(),
        senderId: '4',
        receiverId: user.id,
        content: getBotResponse(content),
        timestamp: new Date(),
      };
      saveMessage(botResponse);
    }, 1000 + Math.random() * 2000);
  }
};

const getBotResponse = (message: string): string => {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
    return 'Hello there! How are you today?';
  }
    if (lowerMsg.includes('good') || lowerMsg.includes('fine') || lowerMsg.includes('well')) {
    return 'Great to hear that! How can I help you today?';
  }
  if (lowerMsg.includes('how are you')) {
    return "I'm just a bot, but I'm functioning well! Thanks for asking.";
  }
  if (lowerMsg.includes('help')) {
    return 'I can answer simple questions. Try asking about the weather or telling me hello!';
  }
  if (lowerMsg.includes('weather')) {
    return 'The weather is always perfect in the virtual world!';
  }
  
  return "I'm not sure I understand. Can you try asking something else?";
};

const broadcastMessage = async (content: string, receiverIds: string[]) => {
  if (!user) return;

  // Create a unique broadcast ID for tracking
  const broadcastId = uuidv4();
  const timestamp = new Date();

  // Save to each recipient's chat
  receiverIds.forEach(receiverId => {
    // Find or create the chat with this recipient
    const chatId = [user.id, receiverId].sort().join('-');
    let chat = chats.find(c => c.id === chatId);
    
    if (!chat) {
      // Create new chat if it doesn't exist
      chat = {
        id: chatId,
        participants: [user.id, receiverId]
      };
      setChats(prev => [...prev, chat!]);
    }

    // Create the broadcast message
    const newMessage: Message = {
      id: `${broadcastId}-${receiverId}`,
      senderId: user.id,
      receiverId,
      content,
      timestamp,
      isBroadcast: true
    };

    // Save to the recipient's chat storage
    const chatKey = `chatAppMessages_${chatId}`;
    const existingMessages: Message[] = JSON.parse(localStorage.getItem(chatKey) || '[]');
    localStorage.setItem(chatKey, JSON.stringify([...existingMessages, newMessage]));

    // Update last message in chats list
    const updatedChats = chats.map(c => 
      c.id === chatId ? { ...c, lastMessage: newMessage } : c
    );
    localStorage.setItem('chatAppChats', JSON.stringify(updatedChats));
    setChats(updatedChats);
  });
};

  return (
    <ChatContext.Provider value={{ chats, currentChat, messages, sendMessage, selectChat, broadcastMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};