import React, { useState, useEffect } from 'react';
import { 
  Box, 
  useTheme, 
  Fab, 
  Tooltip, 
  Drawer,
  IconButton,
  useMediaQuery
} from '@mui/material';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import BroadcastDialog from '../components/BroadcastDialog';
import BroadcastOnPersonalIcon from '@mui/icons-material/BroadcastOnPersonal';
import { useThemeContext } from '../contexts/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ChatLayout: React.FC = () => {
  const theme = useTheme();
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const { toggleTheme, mode } = useThemeContext();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showChatList, setShowChatList] = useState(!isMobile);
  const [showChatWindow, setShowChatWindow] = useState(!isMobile);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!isMobile) {
      setShowChatList(true);
      setShowChatWindow(true);
    } else {
      // On mobile, we show either chat list or chat window
      setShowChatList(!showChatWindow);
    }
  }, [isMobile, showChatWindow]);

  const handleSelectChat = () => {
    if (isMobile) {
      setShowChatWindow(true);
      setShowMenu(false);
    }
  };


  return (
    <Box
      display="flex"
      height="100vh"
      bgcolor={theme.palette.background.default}
      position="relative"
    >
      {/* Mobile drawer for chat list */}
      {isMobile && (
        <Drawer
          variant={showChatList ? "persistent" : "temporary"}
          open={showChatList}
          onClose={() => setShowChatList(false)}
          sx={{
            width: '100%',
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: '100%',
              boxSizing: 'border-box',
            },
          }}
        >
          <Box sx={{ p: 1 }}>
            <IconButton onClick={() => setShowChatList(false)}>
              <ArrowBackIcon />
            </IconButton>
          </Box>
          <ChatList onSelectChat={handleSelectChat} />
        </Drawer>
      )}

      {/* Desktop chat list */}
      {!isMobile && (
        <Box width={350} borderRight={`1px solid ${theme.palette.divider}`}>
          <ChatList />
        </Box>
      )}

      {/* Chat window - hidden on mobile when chat list is shown */}
      {(!isMobile || showChatWindow) && (
        <Box flex={1} display="flex" flexDirection="column">
          {isMobile && (
            <Box sx={{ marginTop: 1, marginLeft: 1 }}>
              <IconButton onClick={() => {                
                  setShowChatWindow(false)
                  setShowMenu(true);
                }}>
                <ArrowBackIcon />
              </IconButton>
            </Box>
          )}
          <ChatWindow />
        </Box>
      )}

      {/* Floating action buttons */}
      <Box sx={ !isMobile ? { position: 'fixed', bottom: 32, left: 23, display: 'flex', gap: 2 } : { position: 'fixed', top: 15, right: 23, display: 'flex', gap: 2 } }>
        <Tooltip title="Toggle theme">
          <Fab color="primary" onClick={toggleTheme}>
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </Fab>
        </Tooltip>

        <Tooltip title="Broadcast message">
          <Fab color="primary" onClick={() => setBroadcastOpen(true)}>
            <BroadcastOnPersonalIcon />
          </Fab>
        </Tooltip>

        {isMobile && !showChatList && showMenu && (
          <Tooltip title="Chat list">
            <Fab color="primary" onClick={() => setShowChatList(true)}>
              <MenuIcon />
            </Fab>
          </Tooltip>
        )}
      </Box>

      <BroadcastDialog
        open={broadcastOpen}
        onClose={() => setBroadcastOpen(false)}
      />
    </Box>
  );
};

export default ChatLayout;