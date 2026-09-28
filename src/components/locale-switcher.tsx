'use client';

import Image from 'next/image';
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
      <a
        href={localeHref('th')}
        className={locale === 'th' ? 'locale-flag is-active' : 'locale-flag'}
        aria-current={locale === 'th' ? 'page' : undefined}
        title={labels.th}
        aria-label={labels.th}
      >
        <Image src="/th-flag.png" alt={labels.th} width={26} height={18} />
      </a>
      <a
        href={localeHref('en')}
        className={locale === 'en' ? 'locale-flag is-active' : 'locale-flag'}
        aria-current={locale === 'en' ? 'page' : undefined}
        title={labels.en}
        aria-label={labels.en}
      >
        <Image src="/us-flag.png" alt={labels.en} width={26} height={18} />
      </a>
    </nav>
  );
}
