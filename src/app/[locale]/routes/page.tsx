import Image from 'next/image';
import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {ArrowIcon} from '@/components/icons';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {buildMetadata, siteUrl} from '@/lib/site';
import {bangkokRoutes, type BangkokRoute, type RouteRegion} from '@/data/routes';

type PageProps = {
  params: Promise<{locale: Locale}>;
};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Metadata'});
  return buildMetadata({locale, path: '/routes', title: t('routesTitle'), description: t('routesDescription')});
}

const regions: RouteRegion[] = ['metropolitan', 'east', 'west', 'north-northeast', 'south'];

export default async function RoutesPage({params}: PageProps) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Routes'});
  const rate = await getTranslations({locale, namespace: 'Bangkok'});

  const regionLabels: Record<RouteRegion, string> = {
    metropolitan: rate('metropolitan'),
    east: rate('east'),
    west: rate('west'),
    'north-northeast': rate('northNortheast'),
    south: rate('south')
  };

  const renderPanelRows = (routes: BangkokRoute[]) => {
    const half = Math.ceil(routes.length / 2);
    return [routes.slice(0, half), routes.slice(half)].map((column, index) => (
      <ul key={index}>
        {column.map((route) => (
          <li key={route.id} className="price-row">
            <span>{rate('origin')} → {route.destination[locale]}</span>
            <Link
              href={`/booking?origin=bangkok&destination=${route.id}`}
              locale={locale}
              className="route-booking-link"
              aria-label={locale === 'th' ? `จองเส้นทางกรุงเทพฯ ไป${route.destination.th}` : `Book Bangkok to ${route.destination.en}`}
            >
              <ArrowIcon />
            </Link>
          </li>
        ))}
      </ul>
    ));
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {'@type': 'ListItem', position: 1, name: locale === 'th' ? 'หน้าแรก' : 'Home', item: `${siteUrl}/${locale}`},
      {'@type': 'ListItem', position: 2, name: t('title'), item: `${siteUrl}/${locale}/routes`}
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumb).replaceAll('<', '\\u003c')}} />
      <section className="routes-hero">
        <Image src="/routes-map-hero.webp" alt="" fill priority sizes="100vw" className="routes-hero-image" />
        <div className="routes-hero-overlay" />
        <div className="shell routes-hero-content"><p className="eyebrow light">{t('eyebrow')}</p><h1>{t('title')}</h1><p>{t('lead')}</p></div>
      </section>

      <section className="section shell route-rates-section" id="route-rates" aria-labelledby="route-rates-title">
        <div className="section-heading"><p className="eyebrow">{rate('eyebrow')}</p><h2 id="route-rates-title">{rate('title')}</h2><p>{rate('lead')}</p></div>
        <nav className="region-chips" aria-label={rate('regionLabel')}>
          {regions.map((region) => <a key={region} href={`#region-${region}`}>{regionLabels[region]}</a>)}
        </nav>
      </section>

      {regions.map((region) => {
        const rows = bangkokRoutes.filter((route) => route.region === region);
        return (
          <section key={region} id={`region-${region}`} className="section shell route-region-section" aria-labelledby={`region-${region}-title`}>
            <div className="price-panel">
              <div className="price-panel-head"><h2 id={`region-${region}-title`}>{regionLabels[region]}</h2></div>
              <div className="price-panel-grid">{renderPanelRows(rows)}</div>
            </div>
          </section>
        );
      })}

      <section className="section shell"><p className="data-note">{rate('note')}</p></section>
    </>
  );
}
