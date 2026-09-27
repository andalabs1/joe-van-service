import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {buildMetadata} from '@/lib/site';
import {bangkokRoutes, type RouteRegion} from '@/data/routes';
import {getRouteVehiclePrices, vehicleCategories, vehicleGroups} from '@/data/vehicle-pricing';
import {VehiclePriceTabs} from '@/components/vehicle-price-tabs';
import {FormSelect} from '@/components/form-select';

type PageProps = {
  params: Promise<{locale: Locale}>;
  searchParams: Promise<{q?: string | string[]; region?: string | string[]}>;
};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Metadata'});
  return buildMetadata({locale, path: '/routes/bangkok', title: t('bangkokTitle'), description: t('bangkokDescription')});
}

const regionValues: Array<RouteRegion | 'all'> = ['all', 'metropolitan', 'east', 'west', 'north-northeast', 'south'];
export default async function BangkokRoutesPage({params, searchParams}: PageProps) {
  const {locale} = await params;
  const query = await searchParams;
  const t = await getTranslations({locale, namespace: 'Bangkok'});
  const common = await getTranslations({locale, namespace: 'Common'});
  const vehicle = await getTranslations({locale, namespace: 'Vehicle'});
  const q = typeof query.q === 'string' ? query.q.trim().toLocaleLowerCase() : '';
  const requestedRegion = typeof query.region === 'string' ? query.region : 'all';
  const region = regionValues.includes(requestedRegion as RouteRegion | 'all') ? requestedRegion : 'all';
  const regionLabels: Record<string, string> = {all: t('all'), metropolitan: t('metropolitan'), east: t('east'), west: t('west'), 'north-northeast': t('northNortheast'), south: t('south')};
  const filtered = bangkokRoutes.filter((route) => {
    const matchesRegion = region === 'all' || route.region === region;
    const haystack = `${route.destination.th} ${route.destination.en}`.toLocaleLowerCase();
    return matchesRegion && (!q || haystack.includes(q));
  });
  const vehicleLabels = Object.fromEntries([...vehicleCategories, ...vehicleGroups.map((group) => group.key)].map((key) => [key, vehicle(key)])) as Parameters<typeof VehiclePriceTabs>[0]['labels'];

  return (
    <>
      <section className="page-hero route-page-hero"><div className="shell"><p className="eyebrow">{t('eyebrow')}</p><h1>{t('title')}</h1><p>{t('lead')}</p></div></section>
      <section className="filter-section"><div className="shell"><form method="get" className="route-filter"><label><span>{t('searchLabel')}</span><input type="search" name="q" defaultValue={q} placeholder={t('searchPlaceholder')} /></label><label><span>{t('regionLabel')}</span><FormSelect key={region} name="region" defaultValue={region} options={regionValues.map((value) => ({value, label: regionLabels[value]}))} ariaLabel={t('regionLabel')} className="route-filter-select" /></label><button className="button button-dark" type="submit">{t('filter')}</button>{(q || region !== 'all') && <Link href="/routes/bangkok" locale={locale} className="clear-link">{t('clear')}</Link>}</form></div></section>
      <section className="section shell routes-results">
        <div className="results-heading"><strong>{t('results', {count: filtered.length})}</strong><span>{common('referencePrice')}</span></div>
        {filtered.length ? <VehiclePriceTabs rows={filtered.map((route) => ({key: route.id, label: route.destination[locale], detail: `${route.distanceKm} ${common('km')}`, prices: getRouteVehiclePrices(route.id), bookingUrl: `/${locale}/booking?origin=bangkok&destination=${route.id}`}))} locale={locale} labels={vehicleLabels} primaryLabel={t('destination')} secondaryLabel={t('distance')} quoteLabel={common('requestQuote')} actionLabel={common('booking')} /> : <div className="empty-state"><h2>{t('noResults')}</h2><Link href="/routes/bangkok" locale={locale}>{t('clear')}</Link></div>}
        <p className="data-note">{t('note')}</p>
      </section>
    </>
  );
}
