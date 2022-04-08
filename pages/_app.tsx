import { CacheProvider, EmotionCache } from '@emotion/react';
import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import React, { useCallback, useState } from 'react';
import { Provider } from 'react-redux';
import createEmotionCache from '../app/createEmoticonCache';
import store from '../app/store';
import theme from '../app/theme';
import Header from '../components/header';
import NavDrawer from '../components/navDrawer';
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
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = useCallback(() => {
    setDrawerOpen(!drawerOpen);
  }, [drawerOpen]);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header toggleDrawer={toggleDrawer} />
        <Provider store={store}>
          <Box maxWidth="xl" sx={{ mt: 4, display: 'flex' }}>
            <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
            <Container>
              <Component {...pageProps} />
            </Container>
          </Box>
        </Provider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default TraderPerf;
