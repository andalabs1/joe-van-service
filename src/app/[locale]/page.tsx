import Image from 'next/image';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { buildMetadata, lineUrl, phone, siteUrl, whatsappUrl } from '@/lib/site';
import { bangkokRoutes } from '@/data/routes';
import { publishedServices } from '@/data/services';
import { vehicleLuggageKey, vehicleModels, vehicleSeatFeatureKey, vehicleSeatsKey } from '@/data/vehicles';
import { getVehicleStartingPrices } from '@/data/vehicle-pricing';
import { ArrowIcon, CalendarIcon, GlobeIcon, LineIcon, PhoneIcon, RouteIcon, ShieldIcon, WhatsappIcon } from '@/components/icons';
import { VehicleCard } from '@/components/vehicle-card';
import { CarouselArrows } from '@/components/carousel-arrows';
import { ReviewsAutoScroll } from '@/components/reviews-auto-scroll';
import { FormSelect } from '@/components/form-select';
import { HomeGalleries, type GalleryMedia } from '@/components/home-galleries';
import { formatPrice } from '@/data/pricing';

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  return buildMetadata({ locale, title: t('homeTitle'), description: t('homeDescription') });
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Home' });
  const common = await getTranslations({ locale, namespace: 'Common' });
  const vehiclesCopy = await getTranslations({ locale, namespace: 'Vehicles' });
  const vehicle = await getTranslations({ locale, namespace: 'Vehicle' });
  const reviews = [
    { text: t('review1Text'), image: '/gallery/S__49463317_0.jpg' },
    { text: t('review2Text'), image: '/gallery/S__49463318_0.jpg' },
    { text: t('review3Text'), image: '/gallery/S__49463316_0.jpg' },
    { text: t('review4Text'), image: '/gallery/S__49463319_0.jpg' },
    { text: t('review5Text'), image: '/gallery/S__49463320_0.jpg' },
    { text: t('review6Text'), image: '/gallery/S__49463322_0.jpg' }
  ];
  const serviceShowcaseCards = [
    {
      title: t('strip1Title'),
      text: t('strip1Text'),
      image: '/services/airport-transfer.png',
      href: '/booking?service=airport-transfer'
    },
    {
      title: t('strip2Title'),
      text: t('strip2Text'),
      image: '/services/private-trip.png',
      href: '/booking?origin=bangkok&destination=hua-hin'
    },
    {
      title: t('strip3Title'),
      text: t('strip3Text'),
      image: '/services/family-outstation.png',
      href: '/booking?service=outstation-trip'
    },
    {
      title: t('strip4Title'),
      text: t('strip4Text'),
      image: '/services/corporate-transport.png',
      href: '/booking?service=corporate-transport',
      featured: true
    }
  ];
  const familiarItems = [
    { title: t('sameDriverTitle'), text: t('sameDriverText') },
    { title: t('preferencesTitle'), text: t('preferencesText') },
    { title: t('petTitle'), text: t('petText') },
    { title: t('preparedTitle'), text: t('preparedText') }
  ];
  const bookingSteps = [
    { title: t('stepTripTitle'), text: t('stepTripText') },
    { title: t('stepVehicleTitle'), text: t('stepVehicleText') },
    { title: t('stepReviewTitle'), text: t('stepReviewText') },
    { title: t('stepConfirmedTitle'), text: t('stepConfirmedText') }
  ];
  const comfortItems = [
    { title: t('rightVehicleTitle'), text: t('rightVehicleText') },
    { title: t('changesTitle'), text: t('changesText') },
    { title: t('includedTitle'), text: t('includedText') },
    { title: t('supportTitle'), text: t('supportText') }
  ];
  const realGalleryFiles = [
    'S__49463314_0.jpg',
    'S__49463315_0.jpg',
    'S__49463316_0.jpg',
    'S__49463317_0.jpg',
    'S__49463318_0.jpg',
    'S__49463319_0.jpg',
    'S__49463320_0.jpg',
    'S__49463322_0.jpg',
    'S__49463323_0.jpg',
    'S__49463324_0.jpg',
    'S__49463325_0.jpg',
    'S__49463326_0.jpg'
  ];
  const fleetMedia: GalleryMedia[] = [
    { kind: 'video', src: '/inside-van.mp4', alt: t('interiorVideoAlt') },
    { kind: 'image', src: '/inside-seat-2.jpg', alt: t('interiorSecondAlt') },
    { kind: 'image', src: '/backside-van.jpg', alt: t('vanRearAlt') }
  ];
  const realPhotos: GalleryMedia[] = realGalleryFiles.map((file, index) => ({
    kind: 'image',
    src: `/gallery/${file}`,
    alt: `${t('realPhotoLabel')} ${index + 1}`
  }));
  const startingPrices = getVehicleStartingPrices();
  const vehicleCards = vehicleModels.map((model) => {
    const rawPrice = startingPrices[model.category];
    return {
      image: model.image,
      title: vehicle(model.category),
      seats: vehiclesCopy(vehicleSeatsKey[model.category]),
      luggage: vehiclesCopy(vehicleLuggageKey[model.category]),
      seat: vehiclesCopy(vehicleSeatFeatureKey[model.category]),
      price: rawPrice !== null ? (formatPrice(rawPrice, locale) ?? common('requestQuote')) : common('requestQuote'),
      href: `/vehicles#vehicle-group-${model.group}`,
      badge: model.category === 'sedan' || model.category === 'suv' ? vehiclesCopy('bestPrice') : undefined
    };
  });
  const canonicalHome = `${siteUrl}/${locale}`;
  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/#business`,
    name: 'mongkonridemate',
    url: canonicalHome,
    image: `${siteUrl}/hero-16.webp`,
    logo: `${siteUrl}/logo.webp`,
    telephone: phone,
    areaServed: 'Thailand',
    priceRange: '฿฿',
    sameAs: [lineUrl, whatsappUrl]
  };
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: 'mongkonridemate',
    url: canonicalHome,
    logo: `${siteUrl}/logo.webp`
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness).replaceAll('<', '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replaceAll('<', '\\u003c') }} />
      <section
        aria-labelledby="home-hero-title"
        className="home-hero-gradient relative isolate flex min-h-[640px] items-end overflow-hidden lg:min-h-[520px] lg:max-h-[520px] lg:items-center"
      >
        {/* Background — desktop: hero-16.webp, mobile (<=1000px): hero.jpg */}
        <picture>
          <source media="(max-width: 1000px)" srcSet="/hero.jpg" />
          <Image
            src="/hero-16.webp"
            alt=""
            fill
            fetchPriority="high"
            sizes="100vw"
            className="home-hero-photo"
          />
        </picture>
        <div aria-hidden="true" className="home-hero-gradient-bg" />
        <div aria-hidden="true" className="home-hero-gradient-glow" />

        {/* Content — ชิดซ้าย ให้เห็นตัวรถที่กลับด้านอยู่ฝั่งขวา */}
        <div className="relative mx-auto flex w-full max-w-[1280px] justify-start px-5 py-12 sm:px-8 sm:py-14 lg:px-12 lg:py-24">
          <div className="w-full max-w-[800px]">
            {/* Brand, headline, supporting copy and direct contact actions */}
            {/* Brand logo */}
            <Image
              src="/logo-only-text.png"
              alt={t('heroBrand')}
              width={640}
              height={213}
              priority
              sizes="(max-width: 640px) 78vw, 420px"
              className="home-hero-brand-logo mb-4"
            /> 
            <h1
              id="home-hero-title"
              className="home-hero-title mb-3 font-medium leading-[1.12] tracking-[-0.03em] text-white"
            >
              {t('heroTitlePrefix')}{' '}
              <span className="text-[#E9CDA3]">{t('heroTitleAccent')}</span>
            </h1>
            <p className="mb-6 max-w-[680px] text-[15px] font-medium leading-[1.75] !text-white sm:text-lg">
              {t('heroSubtitle')}
            </p>

            <div className="home-hero-actions">
              <Link
                href="/booking"
                locale={locale}
                className="home-hero-action home-hero-action-primary"
              >
                <CalendarIcon />
                <span>{t('heroBook')}</span>
              </Link>
              <a
                href={lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="home-hero-action home-hero-action-line home-hero-action-icon"
                aria-label={t('heroLine')}
              >
                <LineIcon />
              </a>
              <a
                href={`tel:${phone}`}
                className="home-hero-action home-hero-action-call home-hero-action-icon"
                aria-label={t('heroCall')}
              >
                <PhoneIcon />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="home-hero-action home-hero-action-whatsapp home-hero-action-icon"
                aria-label={t('heroWhatsapp')}
              >
                <WhatsappIcon />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="service-showcase" aria-labelledby="services-showcase-title">
        <div className="shell">
          <div className="service-showcase-heading">
            <h2 id="services-showcase-title">{t('servicesStripTitle')}</h2>
            <p>{t('sectionServicesLead')}</p>
          </div>
          <CarouselArrows targetId="services-row" prevLabel={t('lightboxPrev')} nextLabel={t('lightboxNext')} className="carousel-arrows-for-services" />
          <div className="service-showcase-grid" id="services-row">
            {serviceShowcaseCards.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                locale={locale}
                className={`service-showcase-card${service.featured ? ' is-featured' : ''}`}
              >
                <div className="service-showcase-card-head">
                  <span>{service.title}</span>
                  <span className="service-showcase-arrow" aria-hidden="true"><ArrowIcon /></span>
                </div>
                <div className="service-showcase-image">
                  <Image
                    src={service.image}
                    alt={`${service.title} — ${service.text}`}
                    fill
                    quality={90}
                    sizes={service.featured ? '(max-width: 760px) 84vw, (max-width: 1100px) 45vw, 560px' : '(max-width: 760px) 84vw, (max-width: 1100px) 45vw, 380px'}
                    style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
                  />
                </div>
                <div className="service-showcase-card-foot">
                  <strong>{service.title}</strong>
                  <small>{service.text}</small>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="shell quick-booking-standalone">
        <form className="quick-booking" action={`/${locale}/booking`} method="get">
          <label><span>{t('quickService')}</span><FormSelect name="service" defaultValue="airport-transfer" options={publishedServices.map((service) => ({ value: service.slug, label: service.name[locale] }))} ariaLabel={t('quickService')} variant="borderless" className="quick-booking-select" /></label>
          <label><span>{t('quickFrom')}</span><FormSelect name="origin" defaultValue="bangkok" options={[{ value: 'bangkok', label: t('quickFromValue') }, ...bangkokRoutes.map((route) => ({ value: route.id, label: route.destination[locale] }))]} ariaLabel={t('quickFrom')} variant="borderless" className="quick-booking-select" showSearch /></label>
          <label><span>{t('quickTo')}</span><FormSelect name="destination" options={bangkokRoutes.map((route) => ({ value: route.id, label: route.destination[locale] }))} placeholder={t('quickToPlaceholder')} ariaLabel={t('quickTo')} variant="borderless" className="quick-booking-select" showSearch /></label>
          <button className="quick-booking-submit" type="submit"><span>{common('bookNow')}</span><ArrowIcon /></button>
        </form>
      </div>

      <section className="vehicle-models-section" aria-labelledby="vehicle-models-title">
        <div className="shell">
          <div className="models-heading">
            <p className="eyebrow">{t('modelsEyebrow')}</p>
            <h2 id="vehicle-models-title">{t('modelsTitle')}</h2>
            <p>{t('modelsLead')}</p>
          </div>
          <CarouselArrows targetId="vehicles-row" prevLabel={t('lightboxPrev')} nextLabel={t('lightboxNext')} className="carousel-arrows-for-vehicles" />
          <div className="vehicle-model-grid" id="vehicles-row">
            {vehicleCards.map((model) => (
              <VehicleCard
                key={model.title}
                image={model.image}
                title={model.title}
                seats={model.seats}
                luggage={model.luggage}
                seat={model.seat}
                price={model.price}
                href={model.href}
                locale={locale}
                actionLabel={common('startingAt')}
                badge={model.badge}
              />
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
          <HomeGalleries
            fleet={fleetMedia}
            photos={realPhotos}
            note={t('realGalleryNote')}
            openLabel={t('lightboxOpen')}
            closeLabel={t('lightboxClose')}
            prevLabel={t('lightboxPrev')}
            nextLabel={t('lightboxNext')}
          />
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

      <figure className="home-full-banner" aria-label={t('interiorSecondAlt')}>
        <Image
          src="/inside-seat-2.jpg"
          alt={t('interiorSecondAlt')}
          fill
          sizes="100vw"
          loading="lazy"
        />
      </figure>

      <section className="section reviews-section" aria-labelledby="reviews-title"><div className="shell">
        <div className="section-heading"><p className="eyebrow">{t('reviewsEyebrow')}</p><h2 id="reviews-title">{t('reviewsTitle')}</h2><p>{t('reviewsLead')}</p></div>
        <CarouselArrows targetId="reviews-row" prevLabel={t('lightboxPrev')} nextLabel={t('lightboxNext')} className="carousel-arrows-for-reviews" />
        <ReviewsAutoScroll targetId="reviews-row" />
        <div className="reviews-grid" id="reviews-row">{reviews.map((review) => (
          <article key={review.image} className="review-card">
            <div className="review-card-body">
              <p className="review-stars" aria-label="5 / 5">★★★★★</p>
              <p className="review-text">{review.text}</p>
            </div>
            <div className="review-media">
              <Image src={review.image} alt={t('reviewVideoLabel')} fill sizes="(max-width: 760px) 88vw, (max-width: 1100px) 45vw, 30vw" />
            </div>
          </article>
        ))}</div>
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
          <Image src="/van-8-no-bg.png"
            alt="" fill sizes="(max-width: 760px) 220px, 330px" />
        </div>
        <div className="shell cta-inner"><div><p className="eyebrow">{t('ctaEyebrow')}</p><h2>{t('finalTitle')}</h2><p>{t('finalText')}</p></div><Link href="/booking" locale={locale} className="button button-dark">{common('bookNow')}<ArrowIcon /></Link></div>
      </section>
    </>
  );
}
