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
  searchParams: Promise<{region?: string | string[]; q?: string | string[]}>;
};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Metadata'});
  return buildMetadata({locale, path: '/routes/bangkok', title: t('bangkokTitle'), description: t('bangkokDescription')});
}

const regions: RouteRegion[] = ['metropolitan', 'east', 'west', 'north-northeast', 'south'];

function asString(value: string | string[] | undefined) {
  return typeof value === 'string' ? value : '';
}

export default async function BangkokRoutesPage({params, searchParams}: PageProps) {
  const {locale} = await params;
  const query = await searchParams;
  const t = await getTranslations({locale, namespace: 'Routes'});
  const rate = await getTranslations({locale, namespace: 'Bangkok'});
  const common = await getTranslations({locale, namespace: 'Common'});

  const rawRegion = asString(query.region);
  const activeRegion: RouteRegion | 'all' = (regions as string[]).includes(rawRegion) ? (rawRegion as RouteRegion) : 'all';
  const q = asString(query.q).trim();
  const needle = q.toLowerCase();

  const matches = (route: BangkokRoute) =>
    !needle ||
    route.destination.th.includes(q) ||
    route.destination.en.toLowerCase().includes(needle) ||
    route.id.includes(needle);

  const visibleRegions = activeRegion === 'all' ? regions : [activeRegion];

  const regionLabels: Record<RouteRegion, string> = {
    metropolitan: rate('metropolitan'),
    east: rate('east'),
    west: rate('west'),
    'north-northeast': rate('northNortheast'),
    south: rate('south')
  };

  const filteredCount = bangkokRoutes.filter(
    (route) => (activeRegion === 'all' || route.region === activeRegion) && matches(route)
  ).length;

  const chipHref = (region: RouteRegion | 'all') => {
    const params = new URLSearchParams();
    if (region !== 'all') params.set('region', region);
    if (q) params.set('q', q);
    const suffix = params.toString();
    return `/routes/bangkok${suffix ? `?${suffix}` : ''}`;
  };

  const renderPanelRows = (routes: BangkokRoute[]) => {
    const half = Math.ceil(routes.length / 2);
    return [routes.slice(0, half), routes.slice(half)].map((column, index) => (
      <ul key={index}>
        {column.map((route) => (
          <li key={route.id} className="price-row">
            <span>{rate('origin')} → {route.destination[locale]} · {route.distanceKm} {common('km')}</span>
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
      {'@type': 'ListItem', position: 2, name: t('title'), item: `${siteUrl}/${locale}/routes`},
      {'@type': 'ListItem', position: 3, name: rate('title'), item: `${siteUrl}/${locale}/routes/bangkok`}
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumb).replaceAll('<', '\\u003c')}} />
      <section className="routes-hero">
        <Image src="/routes-map-hero.webp" alt="" fill priority sizes="100vw" className="routes-hero-image" />
        <div className="routes-hero-overlay" />
        <div className="shell routes-hero-content"><p className="eyebrow light">{rate('eyebrow')}</p><h1>{rate('title')}</h1><p>{rate('lead')}</p></div>
      </section>

      <section className="section shell route-rates-section" id="route-rates" aria-labelledby="route-rates-title">
        <div className="section-heading"><p className="eyebrow">{rate('eyebrow')}</p><h2 id="route-rates-title">{rate('title')}</h2><p>{rate('lead')}</p></div>
        <form className="quick-booking" action={`/${locale}/routes/bangkok`} method="get" role="search">
          <label><span>{rate('searchLabel')}</span><input type="search" name="q" defaultValue={q} placeholder={rate('searchPlaceholder')} aria-label={rate('searchLabel')} className="booking-control" /></label>
          <label><span>{rate('regionLabel')}</span>
            <select name="region" defaultValue={activeRegion} aria-label={rate('regionLabel')} className="booking-control">
              <option value="all">{rate('all')}</option>
              {regions.map((region) => <option key={region} value={region}>{regionLabels[region]}</option>)}
            </select>
          </label>
          <button className="quick-booking-submit" type="submit"><span>{rate('filter')}</span><ArrowIcon /></button>
        </form>
        <nav className="region-chips" aria-label={rate('regionLabel')}>
          <Link href={chipHref('all')} locale={locale} aria-current={activeRegion === 'all' ? 'page' : undefined}>{rate('all')}</Link>
          {regions.map((region) => (
            <Link key={region} href={chipHref(region)} locale={locale} aria-current={activeRegion === region ? 'page' : undefined}>
              {regionLabels[region]}
            </Link>
          ))}
        </nav>
        <p role="status">{rate('results', {count: filteredCount})}</p>
      </section>

      {visibleRegions.map((region) => {
        const rows = bangkokRoutes.filter((route) => route.region === region && matches(route));
        if (rows.length === 0) return null;
        return (
          <section key={region} id={`region-${region}`} className="section shell route-region-section" aria-labelledby={`region-${region}-title`}>
            <div className="price-panel">
              <div className="price-panel-head"><h2 id={`region-${region}-title`}>{regionLabels[region]}</h2></div>
              <div className="price-panel-grid">{renderPanelRows(rows)}</div>
            </div>
          </section>
        );
      })}

      {filteredCount === 0 && (
        <section className="section shell"><p>{rate('noResults')} <Link href="/routes/bangkok" locale={locale}>{rate('clear')}</Link></p></section>
      )}

      <section className="section shell"><p className="data-note">{rate('note')}</p></section>
    </>
  );
}
