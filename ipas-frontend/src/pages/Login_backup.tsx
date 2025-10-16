import React from 'react';
import { Box } from '@mui/material';
import LoginForm from '../components/Auth/LoginForm';

const Login: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <LoginForm />
    </Box>
  );
};

export default Login;
