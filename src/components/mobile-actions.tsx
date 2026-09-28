import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {PhoneIcon} from './icons';

export async function FloatingContact({locale}: {locale: Locale}) {
  const t = await getTranslations({locale, namespace: 'Common'});
  return (
    <Link href="/contact" locale={locale} className="floating-contact" aria-label={t('contact')}>
      <span className="floating-contact-icon"><PhoneIcon /></span>
      <span>{t('contact')}</span>
    </Link>
  );
}
