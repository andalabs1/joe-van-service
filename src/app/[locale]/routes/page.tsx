import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {buildMetadata} from '@/lib/site';
import {featuredRoutes} from '@/data/routes';
import {formatPrice} from '@/data/pricing';
import {ArrowIcon, ClockIcon, PinIcon, RouteIcon} from '@/components/icons';

type PageProps = {params: Promise<{locale: Locale}>};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Metadata'});
  return buildMetadata({locale, path: '/routes', title: t('routesTitle'), description: t('routesDescription')});
}

export default async function RoutesPage({params}: PageProps) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Routes'});
  const common = await getTranslations({locale, namespace: 'Common'});

  return (
    <>
      <section className="page-hero"><div className="shell"><p className="eyebrow">{t('eyebrow')}</p><h1>{t('title')}</h1><p>{t('lead')}</p></div></section>
      <section className="section shell">
        <Link href="/routes/bangkok" locale={locale} className="feature-route-card">
          <div><span className="route-icon"><RouteIcon /></span><p className="eyebrow">50 destinations</p><h2>{t('bangkokTitle')}</h2><p>{t('bangkokText')}</p></div>
          <span className="button button-dark">{common('viewRates')}<ArrowIcon /></span>
        </Link>
      </section>
      <section className="section section-muted"><div className="shell"><div className="section-heading"><h2>{t('popularTitle')}</h2></div><div className="route-card-grid">{featuredRoutes.map((route) => <article key={route.id} className="compact-route-card"><div><PinIcon /><span>{route.distanceKm} {common('km')}</span></div><h3>{route.destination[locale]}</h3><p>{common('startingAt')} <strong>{formatPrice(route.prices.vanStandard, locale)}</strong></p><Link href={`/booking?origin=bangkok&destination=${route.id}`} locale={locale}>{common('booking')}<ArrowIcon /></Link></article>)}</div></div></section>
      <section className="section shell"><div className="value-grid"><article><ArrowIcon /><h3>{t('oneWay')}</h3><p>{t('oneWayText')}</p></article><article><RouteIcon /><h3>{t('roundTrip')}</h3><p>{t('roundTripText')}</p></article><article><ClockIcon /><h3>{t('overnight')}</h3><p>{t('overnightText')}</p></article></div></section>
    </>
  );
}
