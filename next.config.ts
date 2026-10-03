import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const isNonProduction =
  (Boolean(process.env.VERCEL_ENV) && process.env.VERCEL_ENV !== 'production') ||
  process.env.NEXT_PUBLIC_NO_INDEX === '1';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    if (!isNonProduction) return [];
    return [
      {
        source: '/:path*',
        headers: [{key: 'X-Robots-Tag', value: 'noindex, nofollow'}]
      }
    ];
  }
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl(nextConfig);
