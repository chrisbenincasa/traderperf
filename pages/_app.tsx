import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Header from '../components/header';
import React from 'react';

function TraderPerf({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <Header />
      <Component {...pageProps} />
    </React.Fragment>
  );
}

export default TraderPerf;
