import Image from 'next/image';
import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {buildMetadata} from '@/lib/site';
import {publishedServices} from '@/data/services';
import {formatPrice} from '@/data/pricing';
import {
  getRouteVehiclePrices,
  getVehicleStartingPrices,
  hourlyVehicleRates,
  periodVehicleRates,
  vehicleCategories
} from '@/data/vehicle-pricing';
import {vehicleModels} from '@/data/vehicles';
import {featuredRoutes} from '@/data/routes';
import {ArrowIcon, PinIcon, UsersIcon} from '@/components/icons';

type PageProps = {params: Promise<{locale: Locale}>};

const useCaseKey: Record<(typeof vehicleCategories)[number], string> = {
  vipVan: 'useVipVan',
  shortVan: 'useShortVan',
  suv: 'useSuv',
  sedan: 'useSedan'
};

const seatKey: Record<(typeof vehicleCategories)[number], string> = {
  vipVan: 'seats8',
  shortVan: 'seats8',
  suv: 'seats4To7',
  sedan: 'seats3To4'
};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Metadata'});
  return buildMetadata({locale, path: '/services-rates', title: t('servicesTitle'), description: t('servicesDescription')});
}

export default async function ServicesPage({params}: PageProps) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Services'});
  const common = await getTranslations({locale, namespace: 'Common'});
  const vehicle = await getTranslations({locale, namespace: 'Vehicle'});
  const vehiclesT = await getTranslations({locale, namespace: 'Vehicles'});
  const routesT = await getTranslations({locale, namespace: 'Routes'});
  const bangkokT = await getTranslations({locale, namespace: 'Bangkok'});
  const startingPrices = getVehicleStartingPrices();
  const packageStarting = (prices: Record<string, number | null>) => {
    const available = Object.values(prices).filter((price): price is number => price !== null);
    return available.length ? Math.min(...available) : null;
  };
  const splitColumns = <T,>(items: T[]) => {
    const half = Math.ceil(items.length / 2);
    return [items.slice(0, half), items.slice(half)];
  };

  return (
    <>
      <section className="services-hero">
        <Image className="services-hero-image" src="/bangkok-road-hero.png" alt="" fill priority sizes="100vw" />
        <div className="services-hero-overlay" />
        <div className="shell services-hero-content">
          <p className="eyebrow light">{t('eyebrow')}</p>
          <h1>{t('title')}</h1>
          <p>{t('lead')}</p>
          <nav className="services-jump-links" aria-label={t('jumpLabel')}>
            <a href="#vehicles">{vehiclesT('title')}</a>
            <a href="#route-rates">{routesT('title')}</a>
            <a href="#rate-packages">{t('packageRates')}</a>
          </nav>
        </div>
      </section>

      <section id="vehicles" className="section shell services-vehicle-section" aria-labelledby="vehicle-section-title">
        <div className="section-heading section-heading-split">
          <div><p className="eyebrow">{vehiclesT('eyebrow')}</p><h2 id="vehicle-section-title">{vehiclesT('title')}</h2></div>
          <p>{vehiclesT('lead')}</p>
        </div>
        <div className="services-vehicle-grid">
          {vehicleModels.map((model) => (
            <article key={model.category} className="services-vehicle-card">
              <div className="services-vehicle-image">
                <Image src={model.image} alt={vehicle(model.category)} fill sizes="(max-width: 760px) 82vw, (max-width: 1000px) 45vw, 25vw" />
              </div>
              <div className="services-vehicle-body">
                <h3>{vehicle(model.category)}</h3>
                <p className="services-vehicle-meta"><UsersIcon />{vehiclesT(seatKey[model.category])}</p>
                <p className="services-vehicle-use">{vehiclesT(useCaseKey[model.category])}</p>
                <strong className="services-vehicle-price">{common('startingAt')} {formatPrice(startingPrices[model.category], locale)}</strong>
                <Link href={`/booking?vehicle=${model.category}`} locale={locale} className="button button-dark button-wide">{vehiclesT('bookModel')}<ArrowIcon /></Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="route-rates" className="section services-routes-section" aria-labelledby="route-section-title">
        <div className="shell">
          <div className="services-routes-heading">
            <div><p className="eyebrow light">{routesT('eyebrow')}</p><h2 id="route-section-title">{t('routeRatesTitle')}</h2><p>{t('routeRatesLead')}</p></div>
            <Link href="/routes#route-rates" locale={locale} className="button button-ghost">{t('allRouteRates')}<ArrowIcon /></Link>
          </div>
          <div className="services-route-grid">
            {featuredRoutes.slice(0, 8).map((route) => {
              const availablePrices = Object.values(getRouteVehiclePrices(route.id)).filter((price): price is number => price !== null);
              const lowestPrice = Math.min(...availablePrices);
              return (
                <article key={route.id} className="services-route-row">
                  <div className="services-route-name"><PinIcon /><div><span>{t('fromBangkok')}</span><h3>{route.destination[locale]}</h3></div></div>
                  <div className="services-route-facts"><span>{route.distanceKm} {common('km')}</span><strong>{common('startingAt')} {formatPrice(lowestPrice, locale)}</strong></div>
                </article>
              );
            })}
          </div>
          <p className="services-route-note">{bangkokT('note')}</p>
        </div>
      </section>

      <section className="section shell" aria-labelledby="service-types-title">
        <div className="section-heading"><p className="eyebrow">{t('eyebrow')}</p><h2 id="service-types-title">{t('serviceTypesTitle')}</h2><p>{t('serviceTypesLead')}</p></div>
        <div className="service-grid service-grid-large">
          {publishedServices.map((service) => (
            <article key={service.slug} className="service-card static-card">
              <p className="price-kicker">{service.startingPrice ? `${common('startingAt')} ${formatPrice(service.startingPrice, locale)}` : common('requestQuote')}</p>
              <h3>{service.name[locale]}</h3>
              <p>{service.shortDescription[locale]}</p>
              <Link href={`/services-rates/${service.slug}`} locale={locale} className="text-link">{common('details')}<ArrowIcon /></Link>
            </article>
          ))}
        </div>
      </section>

      <div id="rate-packages">
        <section className="section section-muted" aria-labelledby="hourly-title">
          <div className="shell">
            <div className="price-panel">
              <div className="price-panel-head">
                <h2 id="hourly-title">{t('hourlyTitle')} <span>({vehiclesT('startingFrom')})</span></h2>
                <Link href="/booking" locale={locale}>{common('bookNow')} <span aria-hidden="true">›</span></Link>
              </div>
              <div className="price-panel-grid">
                {splitColumns(hourlyVehicleRates).map((column, index) => (
                  <ul key={index}>
                    {column.map((rate) => {
                      const price = packageStarting(rate.prices);
                      return (
                        <li key={rate.hours} className="price-row">
                          <span>{rate.hours} {t('hours')} ({rate.maxKm} {common('km')})</span>
                          <strong>{price !== null ? formatPrice(price, locale) : common('requestQuote')}</strong>
                        </li>
                      );
                    })}
                  </ul>
                ))}
              </div>
              <p className="price-panel-note">{t('notFinal')}</p>
            </div>
          </div>
        </section>
        <section className="section shell" aria-labelledby="period-title">
          <div className="price-panel">
            <div className="price-panel-head">
              <h2 id="period-title">{t('periodTitle')} <span>({vehiclesT('startingFrom')})</span></h2>
              <Link href="/booking" locale={locale}>{common('bookNow')} <span aria-hidden="true">›</span></Link>
            </div>
            <div className="price-panel-grid">
              {splitColumns(periodVehicleRates).map((column, index) => (
                <ul key={index}>
                  {column.map((rate) => {
                    const price = packageStarting(rate.prices);
                    return (
                      <li key={rate.days} className="price-row">
                        <span>{rate.days} {t('days')}</span>
                        <strong>{price !== null ? formatPrice(price, locale) : common('requestQuote')}</strong>
                      </li>
                    );
                  })}
                </ul>
              ))}
            </div>
              <p className="price-panel-note">{t('notFinal')}</p>
            </div>
        </section>
      </div>

      <section className="section section-ink"><div className="shell conditions"><div><p className="eyebrow light">{common('referencePrice')}</p><h2>{t('conditionsTitle')}</h2></div><ul><li>{t('condition1')}</li><li>{t('condition2')}</li><li>{t('condition3')}</li></ul></div></section>
    </>
  );
}
