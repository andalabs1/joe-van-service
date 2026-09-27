import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {buildMetadata} from '@/lib/site';
import {publishedServices} from '@/data/services';
import {formatPrice} from '@/data/pricing';
import {hourlyVehicleRates, periodVehicleRates, vehicleCategories, vehicleGroups} from '@/data/vehicle-pricing';
import {ArrowIcon} from '@/components/icons';
import {VehiclePriceTabs} from '@/components/vehicle-price-tabs';

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
  const vehicleLabels = Object.fromEntries([...vehicleCategories, ...vehicleGroups.map((group) => group.key)].map((key) => [key, vehicle(key)])) as Parameters<typeof VehiclePriceTabs>[0]['labels'];

  return (
    <>
      <section className="page-hero"><div className="shell"><p className="eyebrow">{t('eyebrow')}</p><h1>{t('title')}</h1><p>{t('lead')}</p></div></section>
      <section className="section shell">
        <div className="service-grid service-grid-large">
          {publishedServices.map((service) => (
            <article key={service.slug} className="service-card static-card">
              <p className="price-kicker">{service.startingPrice ? `${common('startingAt')} ${formatPrice(service.startingPrice, locale)}` : common('requestQuote')}</p>
              <h2>{service.name[locale]}</h2>
              <p>{service.shortDescription[locale]}</p>
              <Link href={`/services-rates/${service.slug}`} locale={locale} className="text-link">{common('details')}<ArrowIcon /></Link>
            </article>
          ))}
        </div>
      </section>
      <section className="section section-muted">
        <div className="shell">
          <div className="section-heading"><h2>{t('hourlyTitle')}</h2><p>{t('hourlyLead')}</p></div>
          <VehiclePriceTabs rows={hourlyVehicleRates.map((rate) => ({key: String(rate.hours), label: `${rate.hours} ${t('hours')}`, detail: `${rate.maxKm} ${common('km')}`, prices: rate.prices}))} locale={locale} labels={vehicleLabels} primaryLabel={t('duration')} secondaryLabel={t('maximum')} quoteLabel={common('requestQuote')} />
          <p className="data-note">{t('notFinal')}</p>
        </div>
      </section>
      <section className="section shell">
        <div className="section-heading"><h2>{t('periodTitle')}</h2><p>{t('periodLead')}</p></div>
        <VehiclePriceTabs rows={periodVehicleRates.map((rate) => ({key: String(rate.days), label: `${rate.days} ${t('days')}`, prices: rate.prices}))} locale={locale} labels={vehicleLabels} primaryLabel={t('duration')} quoteLabel={common('requestQuote')} />
        <p className="data-note">{t('notFinal')}</p>
      </section>
      <section className="section section-ink"><div className="shell conditions"><div><p className="eyebrow light">{common('referencePrice')}</p><h2>{t('conditionsTitle')}</h2></div><ul><li>{t('condition1')}</li><li>{t('condition2')}</li><li>{t('condition3')}</li></ul></div></section>
    </>
  );
}
