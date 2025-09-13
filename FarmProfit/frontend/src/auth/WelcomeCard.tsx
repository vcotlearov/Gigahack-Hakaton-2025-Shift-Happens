import {
    Box, Paper, Stack, Typography, Button, Link as MuiLink
} from '@mui/material';
import { Logo } from '../logo/Logo';

type WelcomeCardProps = {
    createAccountAction: () => void;
    loginAction: () => void;
};


export default function WelcomeCard({ createAccountAction, loginAction }: WelcomeCardProps) {
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
            <Paper
                elevation={0}
                sx={{
                    width: 462,
                    height: 329,                  // карточка как в макете
                    maxWidth: '92vw',
                    p: 4,
                }}
            >
                <Logo />

                {/* Заголовок + сабтекст */}
                <Stack alignItems="center" textAlign="center" spacing={2} mb={3} mt={3}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }} >
                        Welcome to FarmProfit!
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        Your farm. Your data. Your rewards.
                    </Typography>
                </Stack>

                {/* Кнопки */}
                <Stack spacing={4} alignItems="stretch">
                    <Button
                        onClick={loginAction}
                        variant="contained"
                        size="large"
                        fullWidth
                        aria-label="Log In"
                    >
                        Log In
                    </Button>

                    <MuiLink
                        // href="#create-account"
                        onClick={createAccountAction}
                        underline="none"
                        textAlign="center"
                        sx={{ fontWeight: 500, color: 'primary.main' }}
                    >
                        Create New Account
                    </MuiLink>
                </Stack>
            </Paper>
        </Box>
    );
}
