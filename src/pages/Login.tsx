import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, TextField, Button, Typography, Paper, useMediaQuery } from '@mui/material';

const Login: React.FC = () => {
  const [email, setEmail] = useState('test@chat.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="background.default"
      px={isMobile ? 2 : 0}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          padding: isMobile ? 3 : 4, 
          width: isMobile ? '100%' : 400 
        }}
      >
        <Typography variant={isMobile ? "h5" : "h4"} align="center" gutterBottom>
          Chat App Login
        </Typography>
        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size={isMobile ? "small" : "medium"}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size={isMobile ? "small" : "medium"}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size={isMobile ? "medium" : "large"}
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;