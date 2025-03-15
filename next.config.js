/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL'
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' *.gohighlevel.com app.gohighlevel.com *.leadconnectorhq.com;"
          }
        ]
      }
    ];
  }
}

module.exports = nextConfig 