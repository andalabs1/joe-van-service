import Image from 'next/image';
import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {buildMetadata} from '@/lib/site';
import {
  getRouteVehiclePrices,
  hourlyVehicleRates,
  periodVehicleRates
} from '@/data/vehicle-pricing';
import {vehicleLuggageKey, vehicleModels, vehicleSeatFeatureKey, vehicleSeatsKey} from '@/data/vehicles';
import {getVehicleStartingPrices} from '@/data/vehicle-pricing';
import {formatPrice} from '@/data/pricing';
import {featuredRoutes} from '@/data/routes';
import {ArrowIcon, PinIcon} from '@/components/icons';
import {VehicleCard} from '@/components/vehicle-card';

type PageProps = {params: Promise<{locale: Locale}>};

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
          {vehicleModels.map((model) => {
            const price = getVehicleStartingPrices()[model.category];
            const isBestPrice = model.category === 'sedan' || model.category === 'suv';
            return (
              <VehicleCard
                key={model.category}
                image={model.image}
                title={vehicle(model.category)}
                seats={vehiclesT(vehicleSeatsKey[model.category])}
                luggage={vehiclesT(vehicleLuggageKey[model.category])}
                seat={vehiclesT(vehicleSeatFeatureKey[model.category])}
                price={price !== null ? (formatPrice(price, locale) ?? common('requestQuote')) : common('requestQuote')}
                href={`/booking?vehicle=${model.category}`}
                locale={locale}
                actionLabel={vehiclesT('bookNow')}
                badge={isBestPrice ? vehiclesT('bestPrice') : undefined}
              />
            );
          })}
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
              const prices = getRouteVehiclePrices(route.id);
              const rows = [
                {label: t('routeTableSedan'), value: prices.sedan},
                {label: t('routeTableSuv'), value: prices.suv},
                {label: t('routeTableVanOldStandard'), value: prices.commuter10},
                {label: t('routeTableVanOldVip'), value: prices.commuter8},
                {label: t('routeTableVanNewStandard'), value: prices.newCommuter10},
                {label: t('routeTableVanNewVip'), value: prices.newCommuter8}
              ];
              return (
                <article key={route.id} className="services-route-row services-route-priced">
                  <div className="services-route-top">
                    <div className="services-route-name"><PinIcon /><div><span>{t('fromBangkok')}</span><h3>{route.destination[locale]}</h3></div></div>
                    <div className="services-route-facts"><span>{route.distanceKm} {common('km')}</span></div>
                  </div>
                  <ul className="services-route-prices">
                    {rows.map((row) => (
                      <li key={row.label}>
                        <span>{row.label}</span>
                        <strong>{row.value !== null ? (formatPrice(row.value, locale) ?? common('requestQuote')) : common('requestQuote')}</strong>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
          <p className="services-route-note">{bangkokT('note')}</p>
        </div>
      </section>

      <div id="rate-packages">
        <section className="section section-muted" aria-labelledby="hourly-title">
          <div className="shell">
            <div className="price-panel">
              <div className="price-panel-head">
                <h2 id="hourly-title">{t('hourlyTitle')}</h2>
                <Link href="/booking" locale={locale}>{common('bookNow')} <span aria-hidden="true">›</span></Link>
              </div>
              <div className="price-panel-grid">
                {splitColumns(hourlyVehicleRates).map((column, index) => (
                  <ul key={index}>
                    {column.map((rate) => (
                      <li key={rate.hours} className="price-row">
                        <span>{rate.hours} {t('hours')} ({rate.maxKm} {common('km')})</span>
                      </li>
                    ))}
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
                <h2 id="period-title">{t('periodTitle')}</h2>
                <Link href="/booking" locale={locale}>{common('bookNow')} <span aria-hidden="true">›</span></Link>
              </div>
              <div className="price-panel-grid">
                {splitColumns(periodVehicleRates).map((column, index) => (
                  <ul key={index}>
                    {column.map((rate) => (
                      <li key={rate.days} className="price-row">
                        <span>{rate.days} {t('days')}</span>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
              <p className="price-panel-note">{t('notFinal')}</p>
            </div>
        </section>
      </div>

      <section className="section section-ink"><div className="shell conditions"><div><p className="eyebrow light">{common('referencePrice')}</p><h2>{t('conditionsTitle')}</h2></div><ul><li>{t('condition1')}</li><li>{t('condition2')}</li><li>{t('condition3')}</li><li>{t('condition4')}</li></ul></div></section>
    </>
  );
}
