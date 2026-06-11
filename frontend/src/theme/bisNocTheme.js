import { createTheme } from '@mui/material/styles';

const bisNocTheme = createTheme({
    palette: {
        primary: {
            main: '#000000',
            light: '#333333',
            dark: '#000000',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#666666',
            light: '#999999',
            dark: '#333333',
            contrastText: '#ffffff',
        },
        background: {
            default: '#ffffff',
            paper: '#ffffff',
        },
        text: {
            primary: '#000000',
            secondary: '#666666',
        },
    },
    typography: {
        fontFamily: "'Poppins', sans-serif",
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    border: '1px solid #f0f0f0',
                },
            },
        },
    },
});

export default bisNocTheme;
