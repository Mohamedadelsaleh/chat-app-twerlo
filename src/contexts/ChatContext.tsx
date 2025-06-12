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
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages);

      const uniqueMessages = parsedMessages.filter(
        (msg: Message, index: number, self: Message[]) =>
          index === self.findIndex((m: Message) => m.id === msg.id)
      );
      setMessages(uniqueMessages);
    } else {
      setMessages([]);
    }
  }
}, [currentChat]);

  const selectChat = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId) || null;
    setCurrentChat(chat);
  };

  const saveMessage = (message: Message) => {
    if (messages.some(m => m.id === message.id)) return;

    setMessages(prev => [...prev, message]);
    
    setChats(prev => {
      const updatedChats = prev.map(chat => {
        if (chat.id === message.receiverId || 
            (chat.participants.includes(message.senderId) && chat.participants.includes(message.receiverId))) {
          return { ...chat, lastMessage: message };
        }
        return chat;
      });

      localStorage.setItem('chatAppChats', JSON.stringify(updatedChats));
      localStorage.setItem(`chatAppMessages_${currentChat?.id}`, JSON.stringify([...messages, message]));
      
      return updatedChats;
    });
  };

const sendMessage = async (content: string, receiverId: string, isBroadcast = false, media?: File) => {
  if (!user) return;

  if (media) {
    const total = media.size;
    let loaded = 0;
    const chunkSize = total / 10;
    
    const progressInterval = setInterval(() => {
      loaded += chunkSize;
      if (loaded >= total) {
        loaded = total;
        clearInterval(progressInterval);
      }
    }, 200);

    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  const newMessage: Message = {
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

  saveMessage(newMessage);

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
    return 'Hello there! How can I help you today?';
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

  const broadcastId = uuidv4();
  const timestamp = new Date();

  receiverIds.forEach(receiverId => {
    const newMessage: Message = {
      id: `${broadcastId}-${receiverId}`,
      senderId: user.id,
      receiverId,
      content,
      timestamp,
      isBroadcast: true
    };
    saveMessage(newMessage);
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