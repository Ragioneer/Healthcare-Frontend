// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpackDevMiddleware: config => {
    config.watchOptions = {
      poll: 1000,           // check every 1000ms
      aggregateTimeout: 300 // debounce changes
    };
    return config;
  }
};

module.exports = nextConfig;
