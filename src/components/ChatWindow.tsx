import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Avatar, Typography, Paper, IconButton, useTheme } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import { mockUsers } from '../api/mockData';

const ChatWindow: React.FC = () => {
  const { currentChat, messages, sendMessage } = useChat();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  const getParticipant = () => {
    if (!currentChat) return null;
    const participantId = currentChat.participants.find(id => id !== user?.id);
    return mockUsers.find(user => user.id === participantId);
  };

  const handleSendMessage = async () => {
    if (!message.trim() && !file) return;
    if (!currentChat || !user) return;

    const participantId = currentChat.participants.find(id => id !== user.id);
    if (!participantId) return;

    await sendMessage(message, participantId, false, file || undefined);
    setMessage('');
    setFile(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const receivedMessageStyle = {
  bgcolor:'#2d7a45',
  color: '#ffffff',
  borderRadius: '18px 18px 18px 4px'
};

const sentMessageStyle = {
  bgcolor: 'primary.main',
  color: '#ffffff',
  borderRadius: '18px 18px 4px 18px'
};

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!currentChat) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <Typography variant="h6" color="textSecondary">
          Select a chat to start messaging
        </Typography>
      </Box>
    );
  }

  const participant = getParticipant();

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="95%"
      p={2}
    >
      {participant && (
        <Box display="flex" alignItems="center" mb={2} p={2} borderBottom="1px solid #eee">
          <Avatar src={participant.avatar} />
          <Typography 
            variant="h6" 
            ml={2}
            color={theme.palette.mode === 'dark' ? 'text.primary' : 'text.primary'}
          >
            {participant.name}
          </Typography>
        </Box>
      )}

      <Box 
        flex={1} 
        overflow="auto" 
        mb={2}
        sx={{
            '&::-webkit-scrollbar': {
              width: '0.4em',
            },
            '&::-webkit-scrollbar-track': {
              background: theme.palette.background.default,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.400',
            },
          }}
      >
        {messages.map((msg) => (
          <Box
            key={msg.id}
            display="flex"
            justifyContent={msg.senderId === user?.id ? 'flex-end' : 'flex-start'}
            mb={2}
          >
            <Paper
              elevation={1}
              sx={{
                  p: 2,
                  maxWidth: '70%',
                  ...(msg.senderId === user?.id ? sentMessageStyle : receivedMessageStyle)
                }}
            >
              {msg.media && msg.media.type === 'image' && (
                <img
                  src={msg.media.url}
                  alt="Media"
                  style={{ maxWidth: '100%', maxHeight: '200px', marginBottom: '8px' }}
                />
              )}
              {msg.media && msg.media.type === 'video' && (
                <video
                  src={msg.media.url}
                  controls
                  style={{ maxWidth: '100%', maxHeight: '200px', marginBottom: '8px' }}
                />
              )}
              <Typography>{msg.content}</Typography>
              <Typography variant="caption" display="block" textAlign="right">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </Typography>
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      <Box 
        display="flex" 
        alignItems="center" 
        sx={{
          bgcolor: theme.palette.mode === 'dark' ? 'transparent' : 'background.paper',
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <IconButton component="label">
          <AttachFileIcon />
          <input type="file" hidden onChange={handleFileChange} />
        </IconButton>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          multiline
          maxRows={4}
          sx={{ mr: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          disabled={!message.trim() && !file}
          endIcon={<SendIcon />}
        >
          Send
        </Button>
      </Box>
      {file && (
        <Box mt={1}>
          <Typography variant="caption">
            Selected file: {file.name}
            <Button size="small" onClick={() => setFile(null)} sx={{ ml: 1 }}>
              Remove
            </Button>
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatWindow;