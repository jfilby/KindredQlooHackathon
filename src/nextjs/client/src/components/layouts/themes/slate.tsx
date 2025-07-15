import { createTheme } from '@mui/material'

export const slateTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#334155', // Slate-700
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#64748B', // Slate-500 for consistent tone
      },
      background: {
        default: '#F8FAFC', // Slightly off-white for softness
        paper: '#FFFFFF',
      },
      text: {
        primary: '#1E293B', // Slate-800
        secondary: '#475569', // Slate-600
      },
    },
    typography: {
      fontFamily: 'Inter, Roboto, sans-serif',
      h6: {
        fontWeight: 600,
        fontSize: '1rem',
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          a: {
            color: '#334155',
            textDecoration: 'none',
            '&:visited': {
              color: '#334155',
            },
            '&:hover': {
              textDecoration: 'underline',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
  });
