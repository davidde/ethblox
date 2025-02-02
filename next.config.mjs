import { PHASE_PRODUCTION_BUILD, PHASE_PRODUCTION_SERVER } from 'next/constants.js';

export default (phase) => {
  const isProd = phase === PHASE_PRODUCTION_BUILD || phase === PHASE_PRODUCTION_SERVER;

  /** @type {import('next').NextConfig} */
  const nextConfig = {
    // experimental: {
      /* Fix: "Failed to generate cache key for"
      // https://github.com/connectrpc/connect-es/issues/1326
      // https://nextjs.org/docs/app/api-reference/config/next-config-js/serverComponentsHmrCache
      */
      // serverComponentsHmrCache: false, // defaults to true
    // },

    // Enable standalone export for Github Pages:
    output: 'standalone',
    // Map all static assets to the project URL davidde.github.io/ethblox,
    // instead of the base davidde.github.io domain, but only for production:
    basePath: isProd ? '/ethblox' : undefined,
    assetPrefix: '/ethblox/',

    async redirects() {
      return [
        {
          source: '/',
          destination: '/mainnet',
          permanent: true,
        },
      ]
    },
  };

  return nextConfig;
}
