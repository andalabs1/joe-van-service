import type {MetadataRoute} from 'next';
import {siteUrl} from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  const isVercelPreview = Boolean(process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production');
  const forceNoIndex = process.env.NEXT_PUBLIC_NO_INDEX === '1';
  if (isVercelPreview || forceNoIndex) return {rules: {userAgent: '*', disallow: '/'}};
  return {
    rules: {userAgent: '*', allow: '/', disallow: ['/api/']},
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
