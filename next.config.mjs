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

  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/mainnet',
  //       permanent: true,
  //     },
  //   ]
  // },
};

export default nextConfig;

