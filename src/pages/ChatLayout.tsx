// Update ChatLayout.tsx
import React, { useState } from 'react';
import { Box, useTheme, Fab, Tooltip } from '@mui/material';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import BroadcastDialog from '../components/BroadcastDialog';
import BroadcastOnPersonalIcon from '@mui/icons-material/BroadcastOnPersonal';
import { useThemeContext } from '../contexts/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const ChatLayout: React.FC = () => {
  const theme = useTheme();
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const { toggleTheme, mode } = useThemeContext();

  return (
    <Box
      display="flex"
      height="100vh"
      bgcolor={theme.palette.background.default}
      position="relative"
    >
      <Box width={350} borderRight={`1px solid ${theme.palette.divider}`}>
        <ChatList />
      </Box>
      <Box flex={1}>
        <ChatWindow />
      </Box>

      <Tooltip title="Toggle theme">
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 32, left: 23 }}
          onClick={toggleTheme}
        >
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </Fab>
      </Tooltip>

      <Tooltip title="Broadcast message">
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 32, left: 96 }}
          onClick={() => setBroadcastOpen(true)}
        >
          <BroadcastOnPersonalIcon />
        </Fab>
      </Tooltip>

      <BroadcastDialog
        open={broadcastOpen}
        onClose={() => setBroadcastOpen(false)}
      />
    </Box>
  );
};

export default ChatLayout;