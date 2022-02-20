import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e',
      light: '#534bae',
      dark: '#000051',
      contrastText: '#fff',
    },
    secondary: {
      main: '#69f0ae',
      light: '#9fffe0',
      dark: '#2bbd7e',
      contrastText: '#000',
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
