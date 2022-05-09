module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/oauth2/:path*',
        destination: '/api/oauth2/:path*',
      },
      {
        source: '/verify',
        destination: '/api/verify',
      },
      {
        source: '/status',
        destination: '/api/status',
      },
      {
        source: '/:path*',
        destination: '/api'
      },
    ]
  },
}
