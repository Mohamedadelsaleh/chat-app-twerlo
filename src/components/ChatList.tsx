import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  ListItemText,
  ListItemButton,
  useTheme,
  Typography,
} from '@mui/material';
import { useChat } from '../contexts/ChatContext';
import { mockUsers } from '../api/mockData';

const ChatList: React.FC = () => {
  const { chats, currentChat, selectChat } = useChat();
  const theme = useTheme();

  const getParticipant = (chatId: string, currentUserId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return null;
    
    const participantId = chat.participants.find(id => id !== currentUserId);
    return mockUsers.find(user => user.id === participantId);
  };

  return (
    <List>
      {chats.map(chat => {
        const participant = getParticipant(chat.id, '1');
        if (!participant) return null;

        return (
          <ListItem
            key={chat.id}
            disablePadding
            sx={{
                backgroundColor: currentChat?.id === chat.id 
                  ? (theme.palette.mode === 'dark' ? 'grey.800' : 'action.selected')
                  : 'transparent',
              }}
          >
            <ListItemButton
              selected={currentChat?.id === chat.id}
              onClick={() => selectChat(chat.id)}
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemAvatar>
                <Avatar src={participant.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography 
                    variant="body1"
                    color={theme.palette.mode === 'dark' ? 'text.primary' : 'text.primary'}
                  >
                    {participant.name}
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="body2"
                    color={theme.palette.mode === 'dark' ? 'text.secondary' : 'text.secondary'}
                  >
                    {chat.lastMessage
                      ? `${chat.lastMessage.content.substring(0, 30)}...`
                      : 'No messages yet'}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default ChatList;