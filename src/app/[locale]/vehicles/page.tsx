import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {buildMetadata} from '@/lib/site';
import {vehicleCategories, vehicleGroups} from '@/data/vehicle-pricing';
import {vehicleLuggageKey, vehicleModelsByGroup, vehicleSeatFeatureKey, vehicleSeatsKey, type VehicleGroupKey} from '@/data/vehicles';import {ArrowIcon} from '@/components/icons';
import {VehicleCard} from '@/components/vehicle-card';

type PageProps = {params: Promise<{locale: Locale}>};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Metadata'});
  return buildMetadata({locale, path: '/vehicles', title: t('vehiclesTitle'), description: t('vehiclesDescription')});
}

export default async function VehiclesPage({params}: PageProps) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Vehicles'});
  const common = await getTranslations({locale, namespace: 'Common'});
  const vehicle = await getTranslations({locale, namespace: 'Vehicle'});

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: vehicleCategories.map((category, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: vehicle(category)
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
            {vehicleModelsByGroup[group.key as VehicleGroupKey].map((model) => (
              <VehicleCard
                key={model.category}
                image={model.image}
                title={vehicle(model.category)}
                seats={t(vehicleSeatsKey[model.category])}
                luggage={t(vehicleLuggageKey[model.category])}
                seat={t(vehicleSeatFeatureKey[model.category])}
                href={`/booking?vehicle=${model.category}`}
                locale={locale}
                actionLabel={t('detailsAndBook')}
              />
            ))}
          </div>
        </section>
      ))}

      <section className="cta-band cta-premium"><div className="shell cta-inner"><div><p className="eyebrow">{t('eyebrow')}</p><h2>{t('ctaTitle')}</h2><p>{t('ctaText')}</p></div><Link href="/booking" locale={locale} className="button button-dark">{common('bookNow')}<ArrowIcon /></Link></div></section>
    </>
  );
}
