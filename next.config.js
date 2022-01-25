/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  // webpack5: false,
  // webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
  //   config.module.rules.push({
  //     test: /\.css$/,
  //     include: path.join(__dirname, 'src/components'),
  //     use: [
  //       'style-loader',
  //       {
  //         loader: 'typings-for-css-modules-loader',
  //         options: {
  //           modules: true,
  //           namedExport: true
  //         }
  //       }
  //     ]
  //   });

  //   return config;
  // }
};

module.exports = nextConfig;
