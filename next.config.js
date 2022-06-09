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
        source: '/oauth/:path*',
        destination: '/api/oauth/:path*',
      },
      {
        source: '/userinfo',
        destination: '/api/oauth2/userinfo',
      },
      {
        source: '/authorize',
        destination: '/api/oauth2/authorize',
      },
      {
        source: '/register',
        destination: '/api/register',
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
