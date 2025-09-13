// src/auth/WelcomeCard.tsx
import * as React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
    Box, Paper, Stack, Typography, Button, Link as MuiLink
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import { Logo } from '../logo/Logo';

export default function WelcomeCard() {
    const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
    const history = useHistory();

    // Если уже залогинен — отправляем в приложение
    React.useEffect(() => {
        if (isAuthenticated) history.replace('/dashboard');
    }, [isAuthenticated, history]);

    const handleLogin = () =>
        loginWithRedirect({
            // откроется форма Log in
            authorizationParams: {
                screen_hint: 'login',          // 👈 логин сразу
            },
            appState: { returnTo: '/dashboard' }, // после логина сюда
        });

    const handleSignup = () =>
        loginWithRedirect({
            // откроется форма Sign up
            authorizationParams: {
                screen_hint: 'signup',         // 👈 регистрация сразу
            },
            appState: { returnTo: '/register-profile' }, // после регистрации сюда
        });

    return (
        <Box
            sx={{
                minHeight: '100dvh',
                display: 'grid',
                placeItems: 'center',
                bgcolor: 'background.default',
                px: 2,
            }}
        >
            <Paper elevation={0} sx={{ width: 462, height: 329, maxWidth: '92vw', p: 4 }}>
                <Logo />

                <Stack alignItems="center" textAlign="center" spacing={2} mb={3} mt={3}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Welcome to FarmProfit!
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        Your farm. Your data. Your rewards.
                    </Typography>
                </Stack>

                <Stack spacing={4} alignItems="stretch">
                    <Button
                        onClick={handleLogin}
                        variant="contained"
                        size="large"
                        fullWidth
                        aria-label="Log In"
                        disabled={isLoading}
                    >
                        Log In
                    </Button>

                    <MuiLink
                        onClick={handleSignup}
                        underline="none"
                        textAlign="center"
                        sx={{ fontWeight: 500, color: 'primary.main', cursor: 'pointer' }}
                    >
                        Create New Account
                    </MuiLink>
                </Stack>
            </Paper>
        </Box>
    );
}
