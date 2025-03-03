import { Box, Button, CircularProgress, Container, TextField } from "@mui/material";
import { useState } from "react";
import Message from "../reusable/Message";
import { useNavigate } from "react-router-dom";
import  './Login.css';
import {Typography} from '@mui/material';
import Logo from '../../assets/logo359 gallery-black.png';
import { login } from "../../api/authService";
import useNotification from "../hooks/useNotification";
import Copyright from "./Copyright";

const Login = () => {

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  let myStorage = window.localStorage;
  let navigate = useNavigate();
  const { error, showError, clearNotifications, isLoading, startLoading, stopLoading } = useNotification();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData(prev => ({...prev, [name]: value}));
    clearNotifications();
  };

  const handleLogin = async () => {
    startLoading();
    try {
      const response = await login(formData.email, formData.password);
    
      const { id, userName, email, superUser, createdAt } = response.data.user;
      myStorage.setItem('user', JSON.stringify({
        id,
        userName,
        email,
        superUser,
        createdAt
      }));
      stopLoading();
      navigate('/');
    } catch (error) {
      showError(error.response?.data?.message);
      stopLoading();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateEmail(formData.email)) {
      showError('Invalid email format!');
      return;
    }
    handleLogin();
  };

  const disableLogin = () => {
    return !formData.email || !formData.password || error.error;
  };

  return <>
    <Message 
      open={error.state} 
      handleClose={clearNotifications} 
      message={error.message} 
      severity="error"
    />        
    { isLoading ? 
      <CircularProgress className="loader" color="primary" /> 
      : 
      <Container
        sx={{
          '& .MuiContainer-root': {
            width: '100%'
          }
        }}
        component="main">
        <Box
          sx={{
            marginTop: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img className="login-logo" src={Logo} />
          <Typography component="h1" variant="h5">
                          Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              fullWidth
              name="email"
              label="email@example.com"
              variant="outlined"
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              required
              error={error.state}
              helperText={error.message}
            />
            <TextField
              fullWidth
              name="password"
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Button
              sx={{mt: 2}}
              type="submit"
              variant="contained"
              fullWidth
              disabled={disableLogin()}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Sign in'}
            </Button>
          </Box>
        </Box>
        <Copyright/>
      </Container> 
    }
  </>;
};

export default Login;