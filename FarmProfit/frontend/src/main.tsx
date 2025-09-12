import React from 'react';
import ReactDOM from 'react-dom/client';

import { ThemeProvider, CssBaseline, Container } from '@mui/material';
import { theme } from './theme';
import { BrowserRouter } from 'react-router-dom';

import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

import App from './App';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  </React.StrictMode>
);
