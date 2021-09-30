import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  typography: {
    fontFamily: [
      'Acme',
      'Roboto',
      'sans-serif'
    ].join(','),
  },
});
