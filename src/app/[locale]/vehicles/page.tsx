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
  carStandard: 'useCarStandard',
  carExecutive: 'useCarExecutive',
  carFamily: 'useCarFamily',
  carElectric: 'useCarElectric',
  limoPremium: 'useLimoPremium',
  limoLuxury: 'useLimoLuxury',
  vanStandard: 'useVanStandard',
  vanExecutive: 'useVanExecutive',
  electricMpv: 'useElectricMpv',
  vanPremium: 'useVanPremium',
  vanLuxury: 'useVanLuxury',
  busMinibus: 'useBusMinibus',
  busMidSized: 'useBusMidSized',
  busGroup: 'useBusGroup'
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
                  <p className="vehicle-best-for"><strong>{t('bestFor')}: </strong>{t(useCaseKey[model.category])}</p>
                  <p className="price-kicker vehicle-starting">
                    {price !== null ? `${common('startingAt')} ${formatPrice(price, locale)}` : common('requestQuote')}
                  </p>
                  <p className="vehicle-spec-pending">{t('specPending')}</p>
                  <Link href={`/booking?vehicle=${model.category}`} locale={locale} className="text-link">{t('bookModel')}<ArrowIcon /></Link>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      <section className="section section-muted">
        <div className="shell">
          <div className="section-heading"><h2>{t('compareTitle')}</h2><p>{t('compareLead')}</p></div>
          <div className="table-wrap">
            <table className="price-table">
              <caption>{t('compareTitle')}</caption>
              <thead><tr><th scope="col">{t('model')}</th><th scope="col">{t('group')}</th><th scope="col">{t('startingFrom')}</th><th scope="col"><span className="visually-hidden">{common('booking')}</span></th></tr></thead>
              <tbody>
                {vehicleCategories.map((category) => {
                  const group = vehicleGroups.find((item) => (item.categories as readonly string[]).includes(category));
                  const price = starting[category];
                  return (
                    <tr key={category}>
                      <th scope="row">{vehicle(category)}</th>
                      <td>{group ? vehicle(group.key as VehicleGroupKey) : ''}</td>
                      <td>{price !== null ? formatPrice(price, locale) : <span className="quote-label">{common('requestQuote')}</span>}</td>
                      <td><Link href={`/booking?vehicle=${category}`} locale={locale} className="table-action" aria-label={`${t('bookModel')} ${vehicle(category)}`}><ArrowIcon /></Link></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="data-note">{t('note')}</p>
        </div>
      </section>

      <section className="cta-band cta-premium"><div className="shell cta-inner"><div><p className="eyebrow">{common('referencePrice')}</p><h2>{t('ctaTitle')}</h2><p>{t('ctaText')}</p></div><Link href="/booking" locale={locale} className="button button-dark">{common('bookNow')}<ArrowIcon /></Link></div></section>
    </>
  );
}
