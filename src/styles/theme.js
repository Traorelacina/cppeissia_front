import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1B7A3E',
      dark: '#0f4a25',
      light: '#eaf4ee',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F5A623',
      dark: '#b87b0f',
      light: '#fff8ea',
      contrastText: '#0f4a25',
    },
    success: {
      main: '#15803d',
      light: '#dcfce7',
    },
    warning: {
      main: '#ca8a04',
      light: '#fef9c3',
    },
    error: {
      main: '#dc2626',
      light: '#fee2e2',
    },
    background: {
      default: '#f0f4f1',
      paper: '#ffffff',
    },
    text: {
      primary: '#2d3a30',
      secondary: '#6b7c70',
    },
    divider: '#dae8df',
  },
  typography: {
    fontFamily: "'Outfit', sans-serif",
    h1: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700 },
    h2: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700 },
    h3: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700 },
    h4: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontFamily: "'Outfit', sans-serif",
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 600,
          textTransform: 'none',
          borderRadius: '10px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 16px rgba(27,122,62,0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          border: '1px solid #dae8df',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 600,
          borderRadius: '6px',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          fontSize: '11.5px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          color: '#6b7c70',
          borderBottomColor: '#dae8df',
        },
        body: {
          fontSize: '13px',
          color: '#2d3a30',
          borderBottomColor: '#f3f7f4',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            '& fieldset': {
              borderColor: '#dae8df',
            },
            '&:hover fieldset': {
              borderColor: '#1B7A3E',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1B7A3E',
            },
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0f1f14',
          borderRight: 'none',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
  },
})

export default theme