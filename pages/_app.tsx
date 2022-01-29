import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Header from '../components/header';
import React from 'react';

import store from '../app/store';
import { Provider } from 'react-redux';

function TraderPerf({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <Header />
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </React.Fragment>
  );
}

export default TraderPerf;
