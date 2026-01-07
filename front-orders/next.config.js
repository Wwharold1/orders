/** @type {import('next').NextConfig} */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createSecureHeaders } = require('next-secure-headers');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { SubresourceIntegrityPlugin } = require('webpack-subresource-integrity');

const nextConfig = {
  eslint: {
    dirs: ['src'],
  },
  env: {
    NEXT_JWT_SECRET: '9F1A3E8C5D4B2A7F9E1C6A8D5B3F7E9A',
    NEXT_HASH_PASSWORD: process.env.NEXT_HASH_PASSWORD,
    NEXT_API_BASE_URL: 'http://localhost:5290',
    NEXT_GOOGLE_RECAPTCHA_KEY: process.env.NEXT_GOOGLE_RECAPTCHA_KEY,
    NEXT_PUBLIC_TOKEN:
      '9073ad4f97f1393371eb49e36f9ee011f662aee46fea983844002b4da211fe46f513719c6b60b02b3632fdfe39cac5be9b84c14eb974a870f26c7350fece1500',
  },
  reactStrictMode: true,
  swcMinify: true,

  images: {
    domains: ['phifmsaqa.blob.core.windows.net'],
  },

  // SVGR
  webpack(config) {
    config.output.crossOriginLoading = 'anonymous';
    config.plugins.push(new SubresourceIntegrityPlugin());

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
            icon: true,
          },
        },
      ],
    });

    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*?)',
        headers: createSecureHeaders({
          contentSecurityPolicy: {
            directives: {
              baseUri: 'self',
              formAction: 'self',
              frameAncestors: true,
            },
          },
          frameGuard: 'deny',
          noopen: 'noopen',
          nosniff: 'nosniff',
          xssProtection: 'sanitize',
          forceHTTPSRedirect: [
            true,
            { maxAge: 60 * 60 * 24 * 360, includeSubDomains: true },
          ],
          referrerPolicy: 'same-origin',
        }),
      },
    ];
  },
};
module.exports = nextConfig;
