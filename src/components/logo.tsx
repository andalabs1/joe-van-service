import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';

export function Logo({locale, label}: {locale: Locale; label: string}) {
  return (
    <Link href="/" locale={locale} className="brand" aria-label={label}>
      <Image className="brand-logo" src="/logo.webp" alt="mongkonridemate" width={110} height={110} priority />
    </Link>
  );
}
