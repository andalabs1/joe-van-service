import type {Metadata} from 'next';
import type {Locale} from '@/i18n/routing';

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://joe-van-service.vercel.app';
export const phone = process.env.NEXT_PUBLIC_PHONE || '0999241591';
export const lineUrl = process.env.NEXT_PUBLIC_LINE_URL || 'https://line.me/R/ti/p/@385hqvbc';

function toInternationalThai(number: string): string {
  const digits = number.replaceAll(/\D/g, '');
  if (digits.startsWith('0')) return `66${digits.slice(1)}`;
  return digits;
}

export const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP || toInternationalThai(process.env.NEXT_PUBLIC_PHONE || '0999241591');
export const whatsappUrl = `https://wa.me/${whatsappNumber}`;
export const contactEmail = 'MONGKON_RideMate@gmail.com';

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
      locale: locale === 'th' ? 'th_TH' : 'en_US'
    },
    twitter: {
      card: 'summary',
      title,
      description
    }
  };
}
