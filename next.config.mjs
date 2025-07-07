const repoBase = '/' + (process.env.NEXT_PUBLIC_APP_NAME ?? 'ethblox');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    /* Fix: "Failed to generate cache key for"
    // https://github.com/connectrpc/connect-es/issues/1326
    // https://nextjs.org/docs/app/api-reference/config/next-config-js/serverComponentsHmrCache
    */
    serverComponentsHmrCache: false, // defaults to true
  },

  output: 'export',
  images: {
    unoptimized: true
  },
  basePath: repoBase,
  // basePath: process.env.NODE_ENV === 'production' ? repoBase : '',
};

export default nextConfig;

