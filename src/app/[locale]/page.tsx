import Image from 'next/image';
import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {buildMetadata} from '@/lib/site';
import {bangkokRoutes} from '@/data/routes';
import {formatPrice} from '@/data/pricing';
import {publishedServices} from '@/data/services';
import {ArrowIcon, BriefcaseIcon, CalendarIcon, CompassIcon, GlobeIcon, LineIcon, PhoneIcon, PinIcon, RouteIcon, SendIcon, ShieldIcon} from '@/components/icons';
import {FormSelect} from '@/components/form-select';
import {lineUrl, phone} from '@/lib/site';

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
    {image: '/model-mpv-van1.png', title: t('modelVipVanTitle'), text: t('modelVipVanText'), price: 2500, anchor: 'vehicle-group-van'},
    {image: '/model-mpv-van.png', title: t('modelShortVanTitle'), text: t('modelShortVanText'), price: 2500, anchor: 'vehicle-group-van'},
    {image: '/model-car-suv.png', title: t('modelSuvTitle'), text: t('modelSuvText'), price: 2800, anchor: 'vehicle-group-passengerCar'},
    {image: '/model-limousine.png', title: t('modelSedanTitle'), text: t('modelSedanText'), price: 1800, anchor: 'vehicle-group-passengerCar'}
  ];
  const localBusiness = {
    '@context': 'https://schema.org', '@type': 'LocalBusiness',
    name: 'mongkonridemate',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://joe-van-service.vercel.app',
    areaServed: 'Thailand', priceRange: '฿฿'
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(localBusiness).replaceAll('<', '\\u003c')}} />
      <section className="hero hero-vip">
        <Image src="/hero-section.png" alt="" fill priority sizes="100vw" className="hero-image" />
        <div className="hero-overlay hero-vip-overlay" />
        <div className="shell hero-content hero-vip-content">
          <div className="hero-copy hero-vip-copy">
            <p className="hero-brand">{t('heroBrand')}</p>
            <h1>{t('heroTitlePrefix')} <span className="hero-vip-accent">{t('heroTitleAccent')}</span></h1>
            <p className="hero-lead hero-vip-lead">{t('heroSubtitle')}</p>
            <p className="hero-price-pill">{t('heroPrice')}</p>
            <div className="hero-cta-row">
              <Link href="/booking" locale={locale} className="hero-cta hero-cta-book"><CalendarIcon />{t('heroBook')}</Link>
              <a href={lineUrl} target="_blank" rel="noopener noreferrer" className="hero-cta hero-cta-line"><LineIcon />{t('heroLine')}</a>
              <a href={`tel:${phone.replaceAll('-', '').replaceAll(' ', '')}`} className="hero-cta hero-cta-call"><PhoneIcon />{t('heroCall')}</a>
            </div>
          </div>
        </div>
      </section>

      <div className="hero-photo-strip" aria-hidden="false">
        <figure><Image src="/inside-seat.jpg" alt={t('interiorAlt')} fill sizes="(max-width: 760px) 100vw, 33vw" /></figure>
        <figure><Image src="/inside-seat-2.jpg" alt={t('interiorSecondAlt')} fill sizes="(max-width: 760px) 100vw, 33vw" /></figure>
        <figure><Image src="/backside-van.jpg" alt={t('vanRearAlt')} fill sizes="(max-width: 760px) 100vw, 33vw" /></figure>
      </div>

      <section className="services-strip" aria-labelledby="services-strip-title">
        <div className="shell">
          <h2 id="services-strip-title">{t('servicesStripTitle')}</h2>
          <ul>
            <li><Link href="/services-rates/airport-transfer" locale={locale}><span className="services-strip-icon"><SendIcon /></span><strong>{t('strip1Title')}</strong><small>{t('strip1Text')}</small></Link></li>
            <li><Link href="/routes#route-rates" locale={locale}><span className="services-strip-icon"><PinIcon /></span><strong>{t('strip2Title')}</strong><small>{t('strip2Text')}</small></Link></li>
            <li><Link href="/services-rates/outstation-trip" locale={locale}><span className="services-strip-icon"><CompassIcon /></span><strong>{t('strip3Title')}</strong><small>{t('strip3Text')}</small></Link></li>
            <li><Link href="/services-rates/corporate-transport" locale={locale}><span className="services-strip-icon"><BriefcaseIcon /></span><strong>{t('strip4Title')}</strong><small>{t('strip4Text')}</small></Link></li>
            <li><Link href="/services-rates/multi-day-trip" locale={locale}><span className="services-strip-icon"><GlobeIcon /></span><strong>{t('strip5Title')}</strong><small>{t('strip5Text')}</small></Link></li>
          </ul>
        </div>
      </section>

      <div className="shell quick-booking-standalone">
        <form className="quick-booking" action={`/${locale}/booking`} method="get">
          <label><span>{t('quickService')}</span><FormSelect name="service" defaultValue="airport-transfer" options={publishedServices.map((service) => ({value: service.slug, label: service.name[locale]}))} ariaLabel={t('quickService')} variant="borderless" className="quick-booking-select" /></label>
          <label><span>{t('quickFrom')}</span><FormSelect name="origin" defaultValue="bangkok" options={[{value: 'bangkok', label: t('quickFromValue')}, ...bangkokRoutes.map((route) => ({value: route.id, label: route.destination[locale]}))]} ariaLabel={t('quickFrom')} variant="borderless" className="quick-booking-select" showSearch /></label>
          <label><span>{t('quickTo')}</span><FormSelect name="destination" options={bangkokRoutes.map((route) => ({value: route.id, label: route.destination[locale]}))} placeholder={t('quickToPlaceholder')} ariaLabel={t('quickTo')} variant="borderless" className="quick-booking-select" showSearch /></label>
          <button className="quick-booking-submit" type="submit"><span>{common('bookNow')}</span><ArrowIcon /></button>
        </form>
        <p className="quick-booking-note"><span aria-hidden="true">●</span>{t('priceNote')}</p>
      </div>

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
                <span className="vehicle-card-foot">
                  <strong className="price-kicker">{common('startingAt')} {formatPrice(model.price, locale)}</strong>
                  <span className="text-link">{common('details')}<ArrowIcon /></span>
                </span>
              </Link>
            ))}
          </div>
          <div className="center-action"><Link href="/vehicles" locale={locale} className="button button-dark">{vehiclesCopy('viewAll')}<ArrowIcon /></Link></div>
          <p className="models-note">{t('illustrationLabel')}</p>
        </div>
      </section>

      <section className="section shell visual-story">
        <div className="visual-story-copy">
          <p className="eyebrow">mongkonridemate</p><h2>{t('experienceTitle')}</h2><p>{t('experienceText')}</p>
          <Link href="/services-rates" locale={locale} className="text-link">{common('details')}<ArrowIcon /></Link>
        </div>
        <figure className="story-image story-image-main"><Image src="/full-van.jpg" alt={t('vanExteriorAlt')} fill sizes="(max-width: 760px) 100vw, 45vw" /><figcaption>{t('realPhotoLabel')}</figcaption></figure>
        <div className="story-stat"><strong>50</strong><span>{t('destinations')}</span></div>
        <figure className="story-image story-image-small"><Image src="/inside-seat.jpg" alt={t('interiorAlt')} fill sizes="(max-width: 760px) 100vw, 24vw" /><figcaption>{t('realPhotoLabel')}</figcaption></figure>
      </section>

      <section className="section fleet-gallery-section">
        <div className="shell">
          <div className="section-heading section-heading-split">
            <div><p className="eyebrow">mongkonridemate</p><h2>{t('galleryTitle')}</h2></div>
            <p>{t('galleryLead')}</p>
          </div>
          <div className="fleet-gallery">
            <figure className="fleet-gallery-item fleet-gallery-wide"><Image src="/inside-seat-2.jpg" alt={t('interiorSecondAlt')} fill sizes="(max-width: 760px) 100vw, 58vw" /></figure>
            <figure className="fleet-gallery-item"><Image src="/backside-van.jpg" alt={t('vanRearAlt')} fill sizes="(max-width: 760px) 100vw, 32vw" /></figure>
            <figure className="fleet-gallery-item fleet-gallery-video">
              <video autoPlay muted loop playsInline preload="metadata" aria-label={t('interiorVideoAlt')}>
                <source src="/inside-van.mp4" type="video/mp4" />
              </video>
            </figure>
          </div>
        </div>
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

      <section className="section routes-sample" aria-labelledby="sample-rates-title"><div className="shell">
        <div className="price-panel">
          <div className="price-panel-head">
            <h2 id="sample-rates-title">{t('sampleTitle')} <span>{t('sampleSuffix')}</span></h2>
            <Link href="/routes#route-rates" locale={locale}>{t('viewAllRates')} <span aria-hidden="true">›</span></Link>
          </div>
          <div className="price-panel-grid">
            {[['hua-hin', 'suvarnabhumi-airport', 'don-mueang-airport', 'pattaya'], ['khao-yai', 'kanchanaburi', 'ayutthaya', 'chiang-mai']].map((ids, column) => (
              <ul key={column}>
                {ids.flatMap((id) => bangkokRoutes.find((route) => route.id === id) ?? []).map((route) => (
                  <li key={route.id} className="price-row">
                    <span>{t('quickFromValue')} → {route.destination[locale]}</span>
                    <strong>{route.prices.vanStandard === null ? common('requestQuote') : formatPrice(route.prices.vanStandard, locale)}</strong>
                  </li>
                ))}
              </ul>
            ))}
          </div>
          <p className="price-panel-note">{t('ratesNote')}</p>
        </div>
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
