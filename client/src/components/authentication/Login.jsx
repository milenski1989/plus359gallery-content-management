import { Box, Button, CircularProgress, Container, CssBaseline, Link, TextField } from "@mui/material"
import { useState } from "react"
import Message from "../reusable/Message"
import { useNavigate } from "react-router-dom";
import  './Login.css'
import {Typography} from '@mui/material';
import Logo from '../../assets/logo359 gallery-black.png'
import { login } from "../../api/authService";
import useNotification from "../hooks/useNotification";

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="http://plus359gallery.com" style={{textDecoration: 'none', color: '#007bff'}}>
          +359 Gallery
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    let myStorage = window.localStorage
    let navigate = useNavigate();
    const { error, showError, clearNotifications, isLoading, startLoading, stopLoading } = useNotification();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };


    const handleLogin = async () => {
        const _email = email
        const _password = password
        startLoading()
        try {
            const response = await login(_email, _password)
            if (response.status === 200) {
                const { id, userName, email, superUser, createdAt } = response.data.user;
                myStorage.setItem('user', JSON.stringify({
                    id,
                    userName,
                    email,
                    superUser,
                    createdAt
                }));
                stopLoading()
                navigate('/');
            }
        } catch (error) {
            showError(error.response?.data?.message);
            stopLoading()
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault()
        if (!validateEmail(email)) {
            showError('Invalid email format!');
            return;
        }
        handleLogin()
    }

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
                <CssBaseline />
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
                            label="email@example.com"
                            variant="outlined"
                            margin="normal"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                clearNotifications
                            }}
                            required
                            error={error.state}
                            helperText={error.message}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button
                            sx={{mt: 2}}
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={!email || !password || isLoading || error.error}
                        >
                            {isLoading ? <CircularProgress size={24} /> : 'Sign in'}
                        </Button>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>

               
        }
    </>
}

export default Login