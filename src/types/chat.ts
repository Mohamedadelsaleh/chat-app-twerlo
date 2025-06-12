export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isBroadcast?: boolean;
  media?: {
    url: string;
    type: 'image' | 'video';
  };
}

export interface Chat {
  id: string;
  participants: string[]; // User IDs
  lastMessage?: Message;
  unreadCount?: number;
}

export interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  sendMessage: (content: string, receiverId: string, isBroadcast?: boolean, media?: File) => Promise<void>;
  selectChat: (chatId: string) => void;
  broadcastMessage: (content: string, receiverIds: string[]) => Promise<void>;
}