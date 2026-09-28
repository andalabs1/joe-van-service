import Image from 'next/image';
import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {buildMetadata} from '@/lib/site';
import {formatPrice} from '@/data/pricing';
import {getVehicleStartingPrices, vehicleCategories, vehicleGroups} from '@/data/vehicle-pricing';
import {vehicleModelsByGroup, type VehicleGroupKey} from '@/data/vehicles';
import {ArrowIcon} from '@/components/icons';

type PageProps = {params: Promise<{locale: Locale}>};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Metadata'});
  return buildMetadata({locale, path: '/vehicles', title: t('vehiclesTitle'), description: t('vehiclesDescription')});
}

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

export default async function VehiclesPage({params}: PageProps) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Vehicles'});
  const common = await getTranslations({locale, namespace: 'Common'});
  const vehicle = await getTranslations({locale, namespace: 'Vehicle'});
  const starting = getVehicleStartingPrices();

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: vehicleCategories.map((category, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: vehicle(category),
      ...(starting[category] !== null
        ? {offers: {'@type': 'Offer', priceCurrency: 'THB', price: starting[category]}}
        : {})
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(itemList).replaceAll('<', '\\u003c')}} />
      <section className="page-hero"><div className="shell"><p className="eyebrow">{t('eyebrow')}</p><h1>{t('title')}</h1><p>{t('lead')}</p></div></section>

      {vehicleGroups.map((group) => (
        <section key={group.key} className="section shell vehicle-group-section" aria-labelledby={`vehicle-group-${group.key}`}>
          <div className="section-heading section-heading-split">
            <div><p className="eyebrow">{t('group')}</p><h2 id={`vehicle-group-${group.key}`}>{vehicle(group.key as VehicleGroupKey)}</h2></div>
            <p>{t('illustration')}</p>
          </div>
          <div className="vehicle-model-grid vehicle-page-grid">
            {vehicleModelsByGroup[group.key as VehicleGroupKey].map((model) => {
              const price = starting[model.category];
              return (
                <article key={model.category} className="vehicle-model-card vehicle-page-card">
                  <div className="vehicle-model-image"><Image src={model.image} alt={vehicle(model.category)} fill sizes="(max-width: 760px) 82vw, 25vw" /></div>
                  <h3>{vehicle(model.category)}</h3>
                  <p className="vehicle-spec-pending">{t(seatKey[model.category])}</p>
                  <p className="vehicle-best-for"><strong>{t('bestFor')}: </strong>{t(useCaseKey[model.category])}</p>
                  <span className="vehicle-card-foot">
                    <strong className="price-kicker vehicle-starting">
                      {price !== null ? `${common('startingAt')} ${formatPrice(price, locale)}` : common('requestQuote')}
                    </strong>
                    <Link href={`/booking?vehicle=${model.category}`} locale={locale} className="text-link">{t('bookModel')}<ArrowIcon /></Link>
                  </span>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      <section className="section section-muted" aria-labelledby="compare-title">
        <div className="shell">
          <div className="price-panel">
            <div className="price-panel-head">
              <h2 id="compare-title">{t('compareTitle')} <span>({t('startingFrom')})</span></h2>
              <Link href="/booking" locale={locale}>{common('bookNow')} <span aria-hidden="true">›</span></Link>
            </div>
            <div className="price-panel-grid">
              {[vehicleCategories.slice(0, 2), vehicleCategories.slice(2)].map((column, index) => (
                <ul key={index}>
                  {column.map((category) => {
                    const price = starting[category];
                    return (
                      <li key={category} className="price-row">
                        <span>{vehicle(category)} · {t(seatKey[category])}</span>
                        <strong>{price !== null ? formatPrice(price, locale) : common('requestQuote')}</strong>
                      </li>
                    );
                  })}
                </ul>
              ))}
            </div>
            <p className="price-panel-note">{t('note')}</p>
          </div>
        </div>
      </section>

      <section className="cta-band cta-premium"><div className="shell cta-inner"><div><p className="eyebrow">{common('referencePrice')}</p><h2>{t('ctaTitle')}</h2><p>{t('ctaText')}</p></div><Link href="/booking" locale={locale} className="button button-dark">{common('bookNow')}<ArrowIcon /></Link></div></section>
    </>
  );
}
