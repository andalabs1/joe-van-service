import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {buildMetadata} from '@/lib/site';
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
  return buildMetadata({locale, path: `/services-rates/${slug}`, title: `${service.name[locale]} | ${locale === 'th' ? 'พี่โจ้รถตู้' : 'Joe Van Service'}`, description: service.shortDescription[locale]});
}

export default async function ServiceDetailPage({params}: PageProps) {
  const {locale, slug} = await params;
  const service = getService(slug);
  if (!service) notFound();
  const common = await getTranslations({locale, namespace: 'Common'});
  const servicesT = await getTranslations({locale, namespace: 'Services'});
  const schema = {'@context': 'https://schema.org', '@type': 'Service', name: service.name[locale], description: service.shortDescription[locale], areaServed: 'Thailand'};

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schema).replaceAll('<', '\\u003c')}} />
      <section className="page-hero service-detail-hero"><div className="shell"><p className="eyebrow">{servicesT('eyebrow')}</p><h1>{service.name[locale]}</h1><p>{service.description[locale]}</p><div className="price-highlight"><span>{service.startingPrice ? common('startingAt') : common('requestQuote')}</span>{service.startingPrice && <strong>{formatPrice(service.startingPrice, locale)}</strong>}</div></div></section>
      <section className="section shell detail-grid">
        <div><h2>{locale === 'th' ? 'จุดเด่นของบริการ' : 'Service highlights'}</h2><ul className="check-list">{service.highlights.map((item) => <li key={item.en}><ShieldIcon />{item[locale]}</li>)}</ul></div>
        <div className="detail-card"><h2>{locale === 'th' ? 'รวมในบริการ' : 'Included'}</h2><ul>{service.inclusions.map((item) => <li key={item.en}>{item[locale]}</li>)}</ul><h3>{locale === 'th' ? 'อาจมีค่าใช้จ่ายเพิ่มเติม' : 'May cost extra'}</h3><ul>{service.exclusions.map((item) => <li key={item.en}>{item[locale]}</li>)}</ul></div>
      </section>
      <section className="cta-band"><div className="shell cta-inner"><div><h2>{locale === 'th' ? 'ส่งรายละเอียดเพื่อเช็กรถว่าง' : 'Share the details to check availability'}</h2><p>{servicesT('notFinal')}</p></div><Link href={`/booking?service=${service.slug}`} locale={locale} className="button button-accent">{common('bookNow')}<ArrowIcon /></Link></div></section>
    </>
  );
}
