import {
    Box, Paper, Stack, Typography, Button, Link as MuiLink
} from '@mui/material';

// Минималистичный инлайн-логотип (SVG), похожий на иконку фермы
function FarmLogo() {
    return (<svg width="42" height="41" viewBox="0 0 42 41" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.8334 23.9166V7.68746C13.8334 6.55476 13.3834 5.46846 12.5825 4.66752C11.7815 3.86659 10.6952 3.41663 9.56254 3.41663C8.42985 3.41663 7.34354 3.86659 6.54261 4.66752C5.74167 5.46846 5.29171 6.55476 5.29171 7.68746V23.9166M13.8334 13.6666L24.0834 5.12496L37.75 15.375M34.3334 6.83329V23.9166M20.6667 23.9166H27.5V17.0833H20.6667V23.9166ZM20.6667 23.9166L12.125 37.5833M3.58337 23.9166H37.75M3.58337 37.5833L12.125 23.9166M37.75 37.5833H20.6667L29.2084 23.9166M25.7917 30.75H37.75" stroke="#262626" stroke-width="2.5625" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    );
}

export default function WelcomeCard() {
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
                {/* Брендовая строка */}
                <Stack direction="row" alignItems="center" justifyContent="center" mb={2} spacing={"12px"}>
                    <FarmLogo />
                    <Typography
                        component="div"
                        sx={{ fontWeight: 700, fontSize: 28, lineHeight: 1.1 }}
                    >
                        <Box component="span" sx={{ color: 'text.primary' }}>Farm</Box>
                        <Box component="span" sx={{ color: 'primary.main' }}>Profit</Box>
                    </Typography>
                </Stack>

                {/* Заголовок + сабтекст */}
                <Stack alignItems="center" textAlign="center" spacing={1} mb={3}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Welcome to FarmProfit!
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        Your farm. Your data. Your rewards.
                    </Typography>
                </Stack>

                {/* Кнопки */}
                <Stack spacing={4} alignItems="stretch">
                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        aria-label="Log In"
                    >
                        Log In
                    </Button>

                    <MuiLink
                        href="#create-account"
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
