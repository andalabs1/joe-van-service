import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';

export function Logo({locale, label}: {locale: Locale; label: string}) {
  return (
    <Link href="/" locale={locale} className="brand" aria-label={label}>
      <span className="brand-lockup" aria-hidden="true">
        <span className="brand-joe">Joe</span>
        <span className="brand-van">Van Service</span>
      </span>
    </Link>
  );
}
