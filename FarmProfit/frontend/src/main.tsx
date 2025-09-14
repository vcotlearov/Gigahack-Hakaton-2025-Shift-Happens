// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';


import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

import App from './App';
const AUTH0_DOMAIN = 'dev-iqadq0gbmsvx3bju.us.auth0.com';
const AUTH0_CLIENT_ID = 'utJdfLIrJOZwHnMNLrEK0wjfHj5fcxVh';
const AUTH0_AUDIENCE = 'https://farm-profit-webapp.azurewebsites.net';


const onRedirectCallback = (appState?: { returnTo?: string }) => {
  const target = appState?.returnTo || '/my-businesses'; // дефолт после логина
  window.history.replaceState({}, document.title, target);
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Auth0Provider
        domain={AUTH0_DOMAIN}
        clientId={AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: window.location.origin, // вернёмся на этот origin
          audience: AUTH0_AUDIENCE,
        }}
        cacheLocation="localstorage"
        useRefreshTokens
        onRedirectCallback={onRedirectCallback}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Auth0Provider>
    </ThemeProvider>
  </React.StrictMode>
);
