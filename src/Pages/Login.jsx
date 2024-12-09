import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Box, 
  Link, 
  IconButton, 
  InputAdornment,
  Alert,
  Snackbar 
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { login } from '../service/authService';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { success } = await login(username, password);
      if (success) {
        console.log("Testing success")
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh' 
    }}>
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        padding: 3,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: 'white'
      }}>
        <Typography component="h1" variant="h5" sx={{ 
          mb: 3, 
          color: 'black', 
          fontWeight: 'bold' 
        }}>
          Limoni
          <Typography component="span" sx={{ 
            color: '#F6C000', 
            ml: 1, 
            fontSize: '1.5rem' 
          }}>
            •
          </Typography>
        </Typography>

        <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#F6C000',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#F6C000',
                },
              },
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#F6C000',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#F6C000',
                },
              },
            }}
          />
          
          <Link 
            href="#" 
            variant="body2" 
            sx={{ 
              display: 'block', 
              textAlign: 'right', 
              mt: 1, 
              color: 'black',
              '&:hover': {
                color: '#F6C000'
              }
            }}
          >
            Forgot Password?
          </Link>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: '#F6C000',
              color: 'black',
              '&:hover': {
                backgroundColor: '#FFD700'
              }
            }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}