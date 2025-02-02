
const isProd = process.env.NODE_ENV === 'production';

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
  // Note that all `npm run build` commands will get classified as 'production',
  // so they will get the '/ethblox' basePath even when run locally.
  // This means that when running the build with `node .next/standalone/server.js` locally,
  // the base URL is `http://localhost:3000/ethblox/`, and the default
  // `http://localhost:3000/` will 404.

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

export default nextConfig;

