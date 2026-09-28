import Image from 'next/image';
import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {buildMetadata} from '@/lib/site';
import {bangkokRoutes, type BangkokRoute, type RouteRegion} from '@/data/routes';

type PageProps = {
  params: Promise<{locale: Locale}>;
  searchParams: Promise<{q?: string | string[]}>;
};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Metadata'});
  return buildMetadata({locale, path: '/routes', title: t('routesTitle'), description: t('routesDescription')});
}

const regions: RouteRegion[] = ['metropolitan', 'east', 'west', 'north-northeast', 'south'];

export default async function RoutesPage({params, searchParams}: PageProps) {
  const {locale} = await params;
  const query = await searchParams;
  const t = await getTranslations({locale, namespace: 'Routes'});
  const rate = await getTranslations({locale, namespace: 'Bangkok'});

  const q = typeof query.q === 'string' ? query.q.trim().toLocaleLowerCase() : '';
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
          </li>
        ))}
      </ul>
    ));
  };

  const searchResults = q ? bangkokRoutes.filter((route) => `${route.destination.th} ${route.destination.en}`.toLocaleLowerCase().includes(q)) : [];

  return (
    <>
      <section className="routes-hero">
        <Image src="/full-van.jpg" alt="" fill priority sizes="100vw" className="routes-hero-image" />
        <div className="routes-hero-overlay" />
        <div className="shell routes-hero-content"><p className="eyebrow light">{t('eyebrow')}</p><h1>{t('title')}</h1><p>{t('lead')}</p></div>
      </section>

      <section className="section shell route-rates-section" id="route-rates" aria-labelledby="route-rates-title">
        <div className="section-heading"><p className="eyebrow">{rate('eyebrow')}</p><h2 id="route-rates-title">{rate('title')}</h2><p>{rate('lead')}</p></div>
        <nav className="region-chips" aria-label={rate('regionLabel')}>
          {regions.map((region) => <a key={region} href={`#region-${region}`}>{regionLabels[region]}</a>)}
        </nav>
        <form method="get" className="route-search" role="search">
          <label><span>{rate('searchLabel')}</span><input type="search" name="q" defaultValue={q} placeholder={rate('searchPlaceholder')} /></label>
          <button className="button button-dark" type="submit">{rate('filter')}</button>
          {q && <Link href="/routes" locale={locale} className="clear-link">{rate('clear')}</Link>}
        </form>
        {q && (
          <div className="route-search-results">
            <div className="price-panel">
              <div className="price-panel-head"><h2>{rate('results', {count: searchResults.length})}</h2></div>
              {searchResults.length ? <div className="price-panel-grid">{renderPanelRows(searchResults)}</div> : <div className="empty-state"><h2>{rate('noResults')}</h2><Link href="/routes" locale={locale}>{rate('clear')}</Link></div>}
            </div>
          </div>
        )}
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
