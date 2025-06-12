// src/components/BroadcastDialog.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Checkbox,
  Typography,
} from '@mui/material';
import { mockUsers } from '../api/mockData';
import { useChat } from '../contexts/ChatContext';

interface BroadcastDialogProps {
  open: boolean;
  onClose: () => void;
}

const BroadcastDialog: React.FC<BroadcastDialogProps> = ({ open, onClose }) => {
  const [message, setMessage] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { broadcastMessage } = useChat();

  const handleToggleUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSendBroadcast = async () => {
    if (!message.trim() || selectedUsers.length === 0) return;
    
    await broadcastMessage(message, selectedUsers);
    setMessage('');
    setSelectedUsers([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Broadcast Message</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Message"
          fullWidth
          variant="outlined"
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Select recipients:
        </Typography>
        <List>
          {mockUsers
            .filter(user => user.id !== '1') // Exclude current user (hardcoded for demo)
            .filter(user => user.id !== '4') // Exclude bot
            .map(user => (
              <ListItem
                key={user.id}
                component="button"
                onClick={() => handleToggleUser(user.id)}
                  sx={{
                        '&:hover': {
                        backgroundColor: 'action.hover',
                        },
                    }}
              >
                <ListItemAvatar>
                  <Avatar src={user.avatar} />
                </ListItemAvatar>
                <ListItemText primary={user.name} />
                <Checkbox
                  edge="end"
                  checked={selectedUsers.includes(user.id)}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItem>
            ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSendBroadcast}
          color="primary"
          disabled={!message.trim() || selectedUsers.length === 0}
        >
          Send Broadcast
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BroadcastDialog;