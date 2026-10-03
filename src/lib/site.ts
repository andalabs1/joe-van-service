import type {Metadata} from 'next';
import type {Locale} from '@/i18n/routing';

// Single source of truth lives in ./global — แก้เบอร์/ลิงก์ตรงนั้นที่เดียว
import {siteUrl} from './global';
export {
  siteUrl,
  phone,
  phoneDisplay,
  lineId,
  lineUrl,
  whatsappNumber,
  whatsappLocal,
  whatsappDisplay,
  whatsappUrl,
  contactEmail
} from './global';

export function localizedPath(locale: Locale, path = '') {
  const normalized = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${normalized}`;
}

export function buildMetadata({
  locale,
  path = '',
  title,
  description
}: {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
}): Metadata {
  const canonical = localizedPath(locale, path);
  const th = localizedPath('th', path);
  const en = localizedPath('en', path);

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical,
      languages: {th, en, 'x-default': th}
    },
    openGraph: {
      type: 'website',
      url: canonical,
      title,
      description,
      siteName: 'mongkonridemate',
      locale: locale === 'th' ? 'th_TH' : 'en_US',
      images: [
        {
          url: '/hero-16.webp',
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/hero-16.webp']
    }
  };
}
