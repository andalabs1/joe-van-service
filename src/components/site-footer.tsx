import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {vehicleModels} from '@/data/vehicles';
import {Logo} from './logo';

export async function SiteFooter({locale}: {locale: Locale}) {
  const t = await getTranslations({locale, namespace: 'Common'});
  const footer = await getTranslations({locale, namespace: 'Footer'});
  const vehicle = await getTranslations({locale, namespace: 'Vehicle'});
  const bangkok = await getTranslations({locale, namespace: 'Bangkok'});
  const regions = [
    {value: 'metropolitan', label: bangkok('metropolitan')},
    {value: 'east', label: bangkok('east')},
    {value: 'west', label: bangkok('west')},
    {value: 'north-northeast', label: bangkok('northNortheast')},
    {value: 'south', label: bangkok('south')}
  ];

  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <div className="footer-brand"><Logo locale={locale} label={t('home')} /></div>
          <p>{footer('summary')}</p>
        </div>
        <nav className="footer-col" aria-label={t('vehicles')}>
          <Link href="/vehicles" locale={locale} className="footer-heading">{t('vehicles')}</Link>
          <ul>
            {vehicleModels.map((model) => (
              <li key={model.category}>
                <Link href={`/vehicles#vehicle-group-${model.group}`} locale={locale}>{vehicle(model.category)}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav className="footer-col" aria-label={t('routes')}>
          <Link href="/routes" locale={locale} className="footer-heading">{t('routes')}</Link>
          <ul>
            {regions.map((region) => (
              <li key={region.value}>
                <Link href={`/routes#region-${region.value}`} locale={locale}>{region.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="shell footer-bottom">
        <p>{footer('pricing')}</p>
        <div className="footer-bottom-links">
          <Link href="/" locale={locale}>{t('home')}</Link>
          <Link href="/services-rates" locale={locale}>{t('services')}</Link>
          <Link href="/contact" locale={locale}>{t('contact')}</Link>
          <Link href="/booking" locale={locale}>{t('booking')}</Link>
        </div>
        <small>© {new Date().getFullYear()} {t('brand')}. {t('allRights')}.</small>
      </div>
    </footer>
  );
}
