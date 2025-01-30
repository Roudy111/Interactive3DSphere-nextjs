/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static optimization where possible
  output: 'standalone',
  
  // Configure webpack for Three.js
  webpack: (config) => {
    config.externals = config.externals || {};
    config.externals['canvas'] = 'canvas';
    return config;
  },

  // Configure transpiler settings
  transpilePackages: ['three'],

  // Disable React StrictMode for Three.js compatibility
  reactStrictMode: false,

  // Enable TypeScript
  typescript: {
    // Don't fail build on type errors during development
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },

  // Configure headers for better security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
