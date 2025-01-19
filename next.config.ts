/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.js', '.jsx']
    }
    return config
  }
}

module.exports = nextConfig
