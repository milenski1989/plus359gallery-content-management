import React, { useState } from 'react'
import Message from '../reusable/Message'
import { Button, CircularProgress, TextField } from '@mui/material';
import { signup } from '../../api/authService';
import './AddNewUser.css'
import useNotification from '../hooks/useNotification';

function AddNewUser() {
    const { success, error, showSuccess, showError, clearNotifications, isLoading, startLoading, stopLoading } = useNotification();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmedPassword, setConfirmedPassword] = useState(false)
    const [userName, setUserName] = useState('')

    const handleSignupUser = async () => {
        startLoading()
    
        const data = {
            email,
            password,
            userName
        };

        try {
            const response = await signup(data);
            if (response.status === 200) {
                showSuccess('User created successfully!');
            }
            stopLoading()
            setEmail("");
            setUserName("");
            setPassword("");
            setConfirmedPassword(false);
        } catch (error) {
            stopLoading()
            console.log(error)
            showError(error.response.data.message);
        }
    };
    
    const handleSubmit = (event) => {
        event.preventDefault()
        startLoading()
        handleSignupUser()
    }

    const checkPasswordMatch = (e) => {
        if (e.target.value === password) setConfirmedPassword(true)
        else setConfirmedPassword(false)
    }

    return  <>
        <Message
            open={success.state}
            handleClose={clearNotifications}
            message={success.message}
            severity="success"
        />
        <Message
            open={error.state}
            handleClose={clearNotifications}
            message={error.message}
            severity="error" />
        {isLoading &&  <CircularProgress variant="determinate" className="loader" color="primary" />}
        {!isLoading &&
            <div className="add-new-user-section">
                <TextField
                    className="add-new-user-textfield"
                    label="Email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                    className="add-new-user-textfield"
                    label="User Name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />

                <TextField
                    className="add-new-user-textfield"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <TextField
                    label="Confirm Password"
                    onChange={checkPasswordMatch}
                    className="add-new-user-textfield"
                />
                {!confirmedPassword && password &&
                              <p className="text-red-400">
                                  Passwords do not match
                              </p>
                }
                <Button 
                    onClick={handleSubmit}
                    disabled={!email || !password || !confirmedPassword}
                    sx={{mt: 2}}
                    type="submit"
                    variant="contained"
                >
            Create
                </Button>
            </div>
        }
    </>
}

export default AddNewUser