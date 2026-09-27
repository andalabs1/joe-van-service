import type {MetadataRoute} from 'next';
import {siteUrl} from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  const isVercelPreview = Boolean(process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production');
  if (isVercelPreview) return {rules: {userAgent: '*', disallow: '/'}};
  return {
    rules: {userAgent: '*', allow: '/', disallow: ['/api/']},
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl
  };
}
