import React from 'react';
import { Box, Typography } from '@mui/material';
import ChatInterface from '../components/Chat/ChatInterface';

const Chat: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#1976d2' }}>
        AI Assistant Chat
      </Typography>
      
      <ChatInterface />
    </Box>
  );
};

export default Chat;
