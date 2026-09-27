import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {lineUrl, phone} from '@/lib/site';
import {MessageIcon, PhoneIcon} from './icons';

export async function MobileActions({locale}: {locale: Locale}) {
  const t = await getTranslations({locale, namespace: 'Common'});
  return (
    <div className="mobile-actions" aria-label="Quick contact">
      {phone ? <a href={`tel:${phone}`}><PhoneIcon />{t('call')}</a> : <span aria-disabled="true"><PhoneIcon />{t('call')}</span>}
      {lineUrl ? <a href={lineUrl} target="_blank" rel="noreferrer"><MessageIcon />{t('line')}</a> : <span aria-disabled="true"><MessageIcon />{t('line')}</span>}
      <Link href="/booking" locale={locale}>{t('booking')}</Link>
    </div>
  );
}
