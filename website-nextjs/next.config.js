/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static optimization where possible
  output: 'standalone',
  
  // Configure webpack for Three.js
  webpack: (config, { isServer }) => {
    // Handle Three.js externals
    config.externals = config.externals || {};
    if (isServer) {
      config.externals['three'] = 'commonjs three';
    }

    // Ensure proper handling of Three.js modules
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        'three': require.resolve('three')
      },
      fallback: {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false
      },
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      modules: ['node_modules']
    };

    // Add support for glsl/shader files
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      type: 'asset/source'
    });

    // Handle TypeScript files
    const tsRule = config.module.rules.find(
      rule => rule.test && rule.test.toString().includes('tsx|ts')
    );

    if (tsRule) {
      tsRule.use = [
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: process.env.NODE_ENV === 'development',
            configFile: './tsconfig.json',
            compilerOptions: {
              module: 'esnext',
              target: 'es5'
            }
          }
        }
      ];
    }

    return config;
  },

  // Configure transpiler settings
  transpilePackages: ['three'],

  // TypeScript settings
  typescript: {
    // Don't fail build on type errors during development
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
    // Enable type checking in production
    tsconfigPath: './tsconfig.json'
  },

  // Disable React StrictMode for Three.js compatibility
  reactStrictMode: false,

  // Enable source maps in production
  productionBrowserSourceMaps: true,

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
          }
        ],
      },
    ];
  },

  // Experimental features
  experimental: {
    // Enable modern build output
    optimizeCss: true,
    // Enable module resolution
    esmExternals: 'loose',
    // Enable better error handling
    serverComponentsExternalPackages: ['three'],
    // Enable proper handling of Three.js modules
    modularizeImports: {
      'three': {
        transform: 'three/{{member}}'
      },
      'three/examples/jsm/{{path}}': {
        transform: 'three/examples/jsm/{{path}}'
      }
    },
    // Enable better module resolution
    legacyBrowsers: false,
    // Enable better CSS optimization
    optimizePackageImports: ['three']
  },

  // Configure build optimization
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  keepAlive: true
};

module.exports = nextConfig;
