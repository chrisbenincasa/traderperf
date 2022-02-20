import { CacheProvider, EmotionCache, ThemeProvider } from '@emotion/react';
import { Container, CssBaseline } from '@mui/material';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { Provider } from 'react-redux';
import createEmotionCache from '../app/createEmoticonCache';
import store from '../app/store';
import theme from '../app/theme';
import Header from '../components/header';
import '../styles/globals.css';

const clientSideEmotionCache = createEmotionCache();

type CustomProps = {
  emotionCache: EmotionCache;
};

function TraderPerf({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: AppProps & CustomProps) {
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <Provider store={store}>
          <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Component {...pageProps} />
          </Container>
        </Provider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default TraderPerf;
