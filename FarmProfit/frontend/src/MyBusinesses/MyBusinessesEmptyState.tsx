import { Box, Stack, Typography, Button, Breadcrumbs, Link } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { EmptyPage } from '../icons/EmptyPage';

type Props = {
    onRegister: () => void;           // что делать при клике на кнопку
    showBreadcrumbs?: boolean;        // нужно ли показывать хлебные крошки
};

export default function MyBusinessesEmptyState({ onRegister, showBreadcrumbs = false }: Props) {
    return (
        <Box
            sx={{
                backgroundColor: '#ECECEC',
                height: '100%',
                width: '100%',                               // занять высоту родителя (у лэйаута уже calc(100vh - 64px))
                // bgcolor: (t) => t.palette.grey[100],      // светло-серый фон как на макете
            }}
        >
            <Box sx={{ maxWidth: 980, mx: 'auto', height: 1 }}>
                {showBreadcrumbs && (
                    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2, color: 'text.secondary' }}>
                        <Link underline="hover" color="inherit" href="/my-businesses">My Businesses</Link>
                        <Typography color="text.primary">Register Business</Typography>
                    </Breadcrumbs>
                )}

                <Stack
                    spacing={2.5}
                    alignItems="center"
                    justifyContent="center"
                    sx={{ height: { xs: '70vh', md: '100%' }, textAlign: 'center' }}
                >
                    {/* ИЛЛЮСТРАЦИЯ (простая, стилизованная под макет) */}
                    <Box
                        sx={{
                            display: 'grid', placeItems: 'center',
                            position: 'relative',
                        }}
                    >
                        <EmptyPage />
                        {/* «конфетти» точки вокруг */}
                        {[...Array(8)].map((_, i) => (
                            <Box
                                key={i}
                                sx={{
                                    width: 6, height: 6, borderRadius: '50%',
                                    bgcolor: (t) => alpha(t.palette.success.main, 0.25),
                                    position: 'absolute',
                                    transform: `rotate(${i * 45}deg) translate(86px)`,
                                }}
                            />
                        ))}
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        You currently have no business
                    </Typography>

                    <Typography sx={{ color: 'text.secondary', maxWidth: 520 }}>
                        Register your business and instantly earn <b>1000 lei (MDL)</b>
                    </Typography>

                    <Button
                        onClick={onRegister}
                        variant="contained"
                        size="large"
                        sx={{
                            px: 20,
                            // 
                            // borderRadius: 9999,                 // pill
                            // textTransform: 'none',
                            // fontWeight: 600,
                            // width: { xs: '100%', sm: 360 },
                        }}
                    >
                        Register Business
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
}
