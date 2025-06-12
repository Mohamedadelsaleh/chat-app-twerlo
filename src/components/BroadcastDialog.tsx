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
  useMediaQuery,
  useTheme,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth fullScreen={isMobile}>
      <DialogTitle>Broadcast Message</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Message"
          fullWidth
          variant="outlined"
          multiline
          rows={isMobile ? 2 : 4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Select recipients:
        </Typography>
        <List sx={{ maxHeight: isMobile ? '60vh' : '40vh', overflow: 'auto' }}>
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
                  <Avatar src={user.avatar} sx={{ width: 40, height: 40 }} />
                </ListItemAvatar>
                <ListItemText primary={user.name} primaryTypographyProps={{ noWrap: true }}/>
                <Checkbox
                  edge="end"
                  checked={selectedUsers.includes(user.id)}
                  tabIndex={-1}
                  disableRipple
                  size={isMobile ? "small" : "medium"}
                />
              </ListItem>
            ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} size={isMobile ? "small" : "medium"} sx={{
              px: 3,
              fontWeight: 'bold',
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': {
                bgcolor: theme.palette.action.hover
              }
            }}>Cancel</Button>
        <Button
          onClick={handleSendBroadcast}
          color="primary"
          disabled={!message.trim() || selectedUsers.length === 0}
          size={isMobile ? "small" : "medium"}
          sx={{
              px: 3,
              fontWeight: 'bold',
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
                bgcolor: theme.palette.primary.dark
              },
              '&:disabled': {
                bgcolor: theme.palette.action.disabledBackground,
                color: theme.palette.action.disabled
              }
            }}
        >
          Send Broadcast
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BroadcastDialog;