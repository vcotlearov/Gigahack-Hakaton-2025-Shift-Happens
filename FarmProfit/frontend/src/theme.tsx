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
                        '0px 1px 1px rgba(0,0,0,0.04), 0px 1px 1px rgba(0,0,0,0.08)',
                    borderRadius: 6,
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    borderRadius: 1, // Multiplies by theme.shape.borderRadius (default 4px), resulting in 8px
                },
            },
        },
    },
});
