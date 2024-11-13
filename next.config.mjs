/** @type {import('next').NextConfig} */
const nextConfig = {
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
