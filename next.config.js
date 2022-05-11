module.exports = {
  reactStrictMode: true,
  eslint: {
    dirs: ['pages', 'src', 'tests'],
  },
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
        source: '/:path*',
        destination: '/api'
      },
    ]
  },
}
