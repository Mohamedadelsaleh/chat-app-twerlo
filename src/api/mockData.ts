import { User } from '../types/auth';
import { Chat } from '../types/chat';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'test@chat.com',
    name: 'Test User',
    avatar: 'https://i.pravatar.cc/150?img=3'
  },
  {
    id: '2',
    email: 'john@example.com',
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: '3',
    email: 'jane@example.com',
    name: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: '4',
    email: 'bot@chat.com',
    name: 'ChatBot',
    avatar: 'https://i.pravatar.cc/150?img=8'
  }
];

export const mockChats: Chat[] = [
  {
    id: '1-2',
    participants: ['1', '2']
  },
  {
    id: '1-3',
    participants: ['1', '3']
  },
  {
    id: '1-4',
    participants: ['1', '4']
  }
];