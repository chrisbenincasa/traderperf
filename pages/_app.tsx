import type { AppProps } from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';
import store from '../app/store';
import Header from '../components/header';
import '../styles/globals.css';

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
