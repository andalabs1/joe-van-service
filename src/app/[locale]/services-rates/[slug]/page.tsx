import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {buildMetadata, siteUrl} from '@/lib/site';
import {getService, publishedServices} from '@/data/services';
import {formatPrice} from '@/data/pricing';
import {ArrowIcon, ShieldIcon} from '@/components/icons';

type PageProps = {params: Promise<{locale: Locale; slug: string}>};

export function generateStaticParams() {
  return publishedServices.map((service) => ({slug: service.slug}));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale, slug} = await params;
  const service = getService(slug);
  if (!service) return {};
  return buildMetadata({locale, path: `/services-rates/${slug}`, title: `${service.name[locale]} | mongkonridemate`, description: service.shortDescription[locale]});
}

export default async function ServiceDetailPage({params}: PageProps) {
  const {locale, slug} = await params;
  const service = getService(slug);
  if (!service) notFound();
  const common = await getTranslations({locale, namespace: 'Common'});
  const servicesT = await getTranslations({locale, namespace: 'Services'});
  const serviceUrl = `${siteUrl}/${locale}/services-rates/${service.slug}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name[locale],
    description: service.shortDescription[locale],
    url: serviceUrl,
    areaServed: 'Thailand',
    provider: {'@type': 'LocalBusiness', '@id': `${siteUrl}/#business`, name: 'mongkonridemate'},
    ...(service.startingPrice
      ? {offers: {'@type': 'Offer', priceCurrency: 'THB', price: service.startingPrice, url: serviceUrl}}
      : {})
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {'@type': 'ListItem', position: 1, name: locale === 'th' ? 'หน้าแรก' : 'Home', item: `${siteUrl}/${locale}`},
      {'@type': 'ListItem', position: 2, name: servicesT('title'), item: `${siteUrl}/${locale}/services-rates`},
      {'@type': 'ListItem', position: 3, name: service.name[locale], item: serviceUrl}
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schema).replaceAll('<', '\\u003c')}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumb).replaceAll('<', '\\u003c')}} />
      <section className="page-hero service-detail-hero"><div className="shell"><p className="eyebrow">{servicesT('eyebrow')}</p><h1>{service.name[locale]}</h1><p>{service.description[locale]}</p><div className="price-highlight"><span>{service.startingPrice ? common('startingAt') : common('requestQuote')}</span>{service.startingPrice && <strong>{formatPrice(service.startingPrice, locale)}</strong>}</div></div></section>
      <section className="section shell detail-grid">
        <div><h2>{servicesT('detailHighlights')}</h2><ul className="check-list">{service.highlights.map((item) => <li key={item.en}><ShieldIcon />{item[locale]}</li>)}</ul></div>
        <div className="detail-card"><h2>{servicesT('detailIncluded')}</h2><ul>{service.inclusions.map((item) => <li key={item.en}>{item[locale]}</li>)}</ul><h3>{servicesT('detailExtra')}</h3><ul>{service.exclusions.map((item) => <li key={item.en}>{item[locale]}</li>)}</ul></div>
      </section>
      <section className="cta-band"><div className="shell cta-inner"><div><h2>{servicesT('detailCtaTitle')}</h2><p>{servicesT('notFinal')}</p></div><Link href={`/booking?service=${service.slug}`} locale={locale} className="button button-accent">{common('bookNow')}<ArrowIcon /></Link></div></section>
    </>
  );
}
