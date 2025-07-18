import { readFileSync } from 'fs';

const appName = JSON.parse(readFileSync('./package.json', 'utf-8')).name;
let basePath;
if (process.env.NODE_ENV === 'production') {
  basePath = '/' + appName;
  if (process.env.LOCAL_BUILD === 'true') basePath = '';
} else basePath = '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  basePath: basePath,

  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
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

