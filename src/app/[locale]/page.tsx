import Image from 'next/image';
import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {buildMetadata} from '@/lib/site';
import {bangkokRoutes, featuredRoutes} from '@/data/routes';
import {formatPrice} from '@/data/pricing';
import {publishedServices} from '@/data/services';
import {ArrowIcon, GlobeIcon, RouteIcon, ShieldIcon} from '@/components/icons';
import {FormSelect} from '@/components/form-select';

type PageProps = {params: Promise<{locale: Locale}>};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Metadata'});
  return buildMetadata({locale, title: t('homeTitle'), description: t('homeDescription')});
}

export default async function HomePage({params}: PageProps) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Home'});
  const common = await getTranslations({locale, namespace: 'Common'});
  const vehiclesCopy = await getTranslations({locale, namespace: 'Vehicles'});
  const serviceCopy = [
    {title: t('airport'), text: t('airportText'), slug: 'airport-transfer'},
    {title: t('daily'), text: t('dailyText'), slug: 'daily-charter'},
    {title: t('outstation'), text: t('outstationText'), slug: 'outstation-trip'}
  ];
  const familiarItems = [
    {title: t('sameDriverTitle'), text: t('sameDriverText')},
    {title: t('preferencesTitle'), text: t('preferencesText')},
    {title: t('petTitle'), text: t('petText')},
    {title: t('preparedTitle'), text: t('preparedText')}
  ];
  const bookingSteps = [
    {title: t('stepTripTitle'), text: t('stepTripText')},
    {title: t('stepVehicleTitle'), text: t('stepVehicleText')},
    {title: t('stepReviewTitle'), text: t('stepReviewText')},
    {title: t('stepConfirmedTitle'), text: t('stepConfirmedText')}
  ];
  const comfortItems = [
    {title: t('rightVehicleTitle'), text: t('rightVehicleText')},
    {title: t('changesTitle'), text: t('changesText')},
    {title: t('includedTitle'), text: t('includedText')},
    {title: t('supportTitle'), text: t('supportText')}
  ];
  const vehicleModels = [
    {image: '/model-car-suv.png', title: t('modelCarTitle'), text: t('modelCarText'), anchor: 'vehicle-group-carSuv'},
    {image: '/model-limousine.png', title: t('modelLimoTitle'), text: t('modelLimoText'), anchor: 'vehicle-group-limousine'},
    {image: '/model-mpv-van.png', title: t('modelVanTitle'), text: t('modelVanText'), anchor: 'vehicle-group-mpvVan'},
    {image: '/model-bus-coach.png', title: t('modelBusTitle'), text: t('modelBusText'), anchor: 'vehicle-group-busCoach'}
  ];
  const localBusiness = {
    '@context': 'https://schema.org', '@type': 'LocalBusiness',
    name: locale === 'th' ? 'พี่โจ้รถตู้' : 'Joe Van Service',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://joe-van-service.vercel.app',
    areaServed: 'Thailand', priceRange: '฿฿'
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(localBusiness).replaceAll('<', '\\u003c')}} />
      <section className="hero hero-editorial">
        <Image src="/hero-section.png" alt="" fill priority sizes="100vw" className="hero-image" />
        <div className="hero-overlay" />
        <div className="shell hero-content hero-editorial-content">
          <div className="hero-copy">
            <p className="eyebrow light">{t('eyebrow')}</p>
            <h1>{t('title')}</h1>
            <p className="hero-lead">{t('lead')}</p>
            <div className="button-row">
              <Link href="/booking" locale={locale} className="button button-champagne">{common('bookNow')}<ArrowIcon /></Link>
              <Link href="/routes/bangkok" locale={locale} className="button button-ghost">{common('viewRates')}</Link>
            </div>
          </div>
          <aside className="hero-rate-card">
            <span>{t('rateCardLabel')}</span>
            <strong>{common('startingAt')} {locale === 'th' ? '฿1,400' : 'THB 1,400'}</strong>
            <p>{t('rateCardText')}</p>
            <Link href="/services-rates/airport-transfer" locale={locale} aria-label={common('details')}><ArrowIcon /></Link>
          </aside>
        </div>
        <div className="shell quick-booking-wrap">
          <form className="quick-booking" action={`/${locale}/booking`} method="get">
            <label><span>{t('quickService')}</span><FormSelect name="service" defaultValue="airport-transfer" options={publishedServices.map((service) => ({value: service.slug, label: service.name[locale]}))} ariaLabel={t('quickService')} variant="borderless" className="quick-booking-select" /></label>
            <label><span>{t('quickFrom')}</span><FormSelect name="origin" defaultValue="bangkok" options={[{value: 'bangkok', label: t('quickFromValue')}, ...bangkokRoutes.map((route) => ({value: route.id, label: route.destination[locale]}))]} ariaLabel={t('quickFrom')} variant="borderless" className="quick-booking-select" showSearch /></label>
            <label><span>{t('quickTo')}</span><FormSelect name="destination" options={bangkokRoutes.map((route) => ({value: route.id, label: route.destination[locale]}))} placeholder={t('quickToPlaceholder')} ariaLabel={t('quickTo')} variant="borderless" className="quick-booking-select" showSearch /></label>
            <button className="quick-booking-submit" type="submit"><span>{common('bookNow')}</span><ArrowIcon /></button>
          </form>
          <p className="hero-note"><span aria-hidden="true">●</span>{t('priceNote')}</p>
        </div>
      </section>

      <section className="vehicle-models-section" aria-labelledby="vehicle-models-title">
        <div className="shell">
          <div className="models-heading">
            <p className="eyebrow">{t('modelsEyebrow')}</p>
            <h2 id="vehicle-models-title">{t('modelsTitle')}</h2>
            <p>{t('modelsLead')}</p>
          </div>
          <div className="vehicle-model-grid">
            {vehicleModels.map((model) => (
              <Link key={model.title} href={`/vehicles#${model.anchor}`} locale={locale} className="vehicle-model-card">
                <div className="vehicle-model-image"><Image src={model.image} alt={model.title} fill sizes="(max-width: 760px) 82vw, 25vw" /></div>
                <h3>{model.title}</h3>
                <p>{model.text}</p>
                <span className="text-link">{common('details')}<ArrowIcon /></span>
              </Link>
            ))}
          </div>
          <div className="center-action"><Link href="/vehicles" locale={locale} className="button button-dark">{vehiclesCopy('viewAll')}<ArrowIcon /></Link></div>
          <p className="models-note">{t('illustrationLabel')}</p>
        </div>
      </section>

      <section className="section shell visual-story">
        <div className="visual-story-copy">
          <p className="eyebrow">Joe Van Service</p><h2>{t('experienceTitle')}</h2><p>{t('experienceText')}</p>
          <Link href="/services-rates" locale={locale} className="text-link">{common('details')}<ArrowIcon /></Link>
        </div>
        <figure className="story-image story-image-main"><Image src="/joe-van-premium-interior.png" alt={t('interiorAlt')} fill sizes="(max-width: 760px) 100vw, 45vw" /><figcaption>{t('illustrationLabel')}</figcaption></figure>
        <div className="story-stat"><strong>50</strong><span>{t('destinations')}</span></div>
        <figure className="story-image story-image-small"><Image src="/bangkok-road-hero.png" alt={t('routeAlt')} fill sizes="(max-width: 760px) 100vw, 24vw" /><figcaption>{t('illustrationLabel')}</figcaption></figure>
      </section>

      <section className="section section-familiar">
        <div className="shell content-intro">
          <p className="eyebrow">{t('nationwideEyebrow')}</p>
          <h2>{t('nationwideTitle')}</h2>
          <p>{t('nationwideLead')}</p>
        </div>
        <div className="shell familiar-layout">
          <div className="familiar-heading"><span>01</span><h2>{t('familiarTitle')}</h2></div>
          <div className="content-card-grid">
            {familiarItems.map((item, index) => <article key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="section section-warm"><div className="shell">
        <div className="section-heading section-heading-split"><div><p className="eyebrow">{common('services')}</p><h2>{t('sectionServices')}</h2></div><p>{t('sectionServicesLead')}</p></div>
        <div className="service-grid service-grid-editorial">{serviceCopy.map((service, index) => (
          <Link key={service.slug} href={`/services-rates/${service.slug}`} locale={locale} className="service-card">
            <span className="card-number">0{index + 1}</span><div className="service-card-arrow"><ArrowIcon /></div><h3>{service.title}</h3><p>{service.text}</p><span className="text-link">{common('details')}<ArrowIcon /></span>
          </Link>
        ))}</div>
      </div></section>

      <section className="section section-ink routes-editorial"><div className="shell">
        <div className="section-heading inverse section-heading-split"><div><p className="eyebrow light">{common('routes')}</p><h2>{t('sectionRoutes')}</h2></div><p>{t('sectionRoutesLead')}</p></div>
        <div className="route-strip">{featuredRoutes.slice(0, 6).map((route, index) => (
          <Link key={route.id} href={`/booking?origin=bangkok&destination=${route.id}`} locale={locale} className="route-tile">
            <span>0{index + 1} · {route.distanceKm} {common('km')}</span><h3>{route.destination[locale]}</h3><strong>{common('startingAt')} {formatPrice(route.prices.vanStandard, locale)}</strong><ArrowIcon />
          </Link>
        ))}</div>
        <div className="center-action"><Link href="/routes/bangkok" locale={locale} className="button button-light">{common('viewRates')}<ArrowIcon /></Link></div>
      </div></section>

      <section className="section booking-steps-section">
        <div className="shell">
          <div className="section-heading section-heading-split"><div><p className="eyebrow">{t('bookingGuideEyebrow')}</p><h2>{t('bookingGuideTitle')}</h2></div><p>{t('bookingGuideLead')}</p></div>
          <ol className="booking-steps">
            {bookingSteps.map((step, index) => <li key={step.title}><span>0{index + 1}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}
          </ol>
          <div className="center-action"><Link href="/booking" locale={locale} className="button button-dark">{common('bookNow')}<ArrowIcon /></Link></div>
        </div>
      </section>

      <section className="section shell comfort-section">
        <div className="section-heading"><p className="eyebrow">{t('detailsEyebrow')}</p><h2>{t('detailsTitle')}</h2><p>{t('detailsLead')}</p></div>
        <div className="comfort-grid">
          {comfortItems.map((item, index) => <article key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}
        </div>
      </section>

      <section className="section shell reassurance-section">
        <div className="section-heading compact"><p className="eyebrow">{t('whyEyebrow')}</p><h2>{t('whyTitle')}</h2></div>
        <div className="value-grid"><article><ShieldIcon /><h3>{t('whyPrice')}</h3><p>{t('whyPriceText')}</p></article><article><RouteIcon /><h3>{t('whyHuman')}</h3><p>{t('whyHumanText')}</p></article><article><GlobeIcon /><h3>{t('whyLanguage')}</h3><p>{t('whyLanguageText')}</p></article></div>
      </section>

      <section className="cta-band cta-premium">
        <div className="cta-van" aria-hidden="true">
          <Image src="/model-mpv-van1.png"
          alt="" fill sizes="(max-width: 760px) 220px, 330px" />
        </div>
        <div className="shell cta-inner"><div><p className="eyebrow">{t('ctaEyebrow')}</p><h2>{t('finalTitle')}</h2><p>{t('finalText')}</p></div><Link href="/booking" locale={locale} className="button button-dark">{common('bookNow')}<ArrowIcon /></Link></div>
      </section>
    </>
  );
}
