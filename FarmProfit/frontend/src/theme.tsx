import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#0EA76A' },         // зелёная кнопка
        background: {
            default: '#EEEEEE',                  // серый фон как в макете
            paper: '#FFFFFF',
        },
    },
    shape: { borderRadius: 12 },
    typography: {
        fontFamily: [
            'Poppins',
            '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'
        ].join(','),
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 16,               // pill
                    height: 48,
                    fontWeight: 500,
                    fontSize: '1rem',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow:
                        '0px 2px 4px rgba(0,0,0,0.04), 0px 8px 24px rgba(0,0,0,0.08)',
                    borderRadius: 6,
                },
            },
        },
    },
});
