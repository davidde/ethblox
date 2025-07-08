const { name: appName } = require('./package.json');
const repoBase = '/' + appName;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  basePath: repoBase,
  // basePath: process.env.NODE_ENV === 'production' ? repoBase : '',

  env: {
    NEXT_PUBLIC_APP_NAME: appName,
  },

  experimental: {
    /* Fix: "Failed to generate cache key for"
    // https://github.com/connectrpc/connect-es/issues/1326
    // https://nextjs.org/docs/app/api-reference/config/next-config-js/serverComponentsHmrCache
    */
    serverComponentsHmrCache: false, // defaults to true
  },
};

export default nextConfig;

