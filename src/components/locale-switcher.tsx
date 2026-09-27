'use client';

import {usePathname, useSearchParams} from 'next/navigation';
import type {Locale} from '@/i18n/routing';

export function LocaleSwitcher({locale, labels}: {locale: Locale; labels: {th: string; en: string; aria: string}}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function localeHref(nextLocale: Locale) {
    const segments = pathname.split('/');
    segments[1] = nextLocale;
    const query = searchParams.toString();
    return `${segments.join('/')}${query ? `?${query}` : ''}`;
  }

  return (
    <nav className="locale-switcher" aria-label={labels.aria}>
      <a href={localeHref('th')} aria-current={locale === 'th' ? 'page' : undefined}>{labels.th}</a>
      <span aria-hidden="true">/</span>
      <a href={localeHref('en')} aria-current={locale === 'en' ? 'page' : undefined}>{labels.en}</a>
    </nav>
  );
}
