import type {MetadataRoute} from 'next';
import {publishedServices} from '@/data/services';
import {routing} from '@/i18n/routing';
import {siteUrl} from '@/lib/site';

const staticPaths = ['', '/services-rates', '/vehicles', '/routes', '/routes/bangkok', '/contact', '/booking'];

export default function sitemap(): MetadataRoute.Sitemap {
  const servicePaths = publishedServices.map((service) => `/services-rates/${service.slug}`);
  return [...staticPaths, ...servicePaths].flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: path === '' ? 'weekly' as const : 'monthly' as const,
      priority: path === '' ? 1 : path === '/booking' ? 0.8 : 0.7,
      alternates: {
        languages: {
          th: `${siteUrl}/th${path}`,
          en: `${siteUrl}/en${path}`,
          'x-default': `${siteUrl}/th${path}`
        }
      }
    }))
  );
}
