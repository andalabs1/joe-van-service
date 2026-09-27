import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {buildMetadata, lineUrl, phone} from '@/lib/site';
import {ArrowIcon, ClockIcon, MessageIcon, PhoneIcon, PinIcon} from '@/components/icons';

type PageProps = {params: Promise<{locale: Locale}>};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Metadata'});
  return buildMetadata({locale, path: '/contact', title: t('contactTitle'), description: t('contactDescription')});
}

export default async function ContactPage({params}: PageProps) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Contact'});
  const common = await getTranslations({locale, namespace: 'Common'});
  const pending = common('pendingContact');

  return (
    <>
      <section className="page-hero"><div className="shell"><p className="eyebrow">{t('eyebrow')}</p><h1>{t('title')}</h1><p>{t('lead')}</p></div></section>
      <section className="section shell contact-grid">
        <article className="contact-card"><PhoneIcon /><h2>{t('phoneTitle')}</h2>{phone ? <a href={`tel:${phone}`}>{phone}</a> : <p>{pending}</p>}</article>
        <article className="contact-card"><MessageIcon /><h2>{t('lineTitle')}</h2>{lineUrl ? <a href={lineUrl} target="_blank" rel="noreferrer">LINE</a> : <p>{pending}</p>}</article>
        <article className="contact-card"><ClockIcon /><h2>{t('hoursTitle')}</h2><p>{t('hours')}</p></article>
        <article className="contact-card"><PinIcon /><h2>{t('areaTitle')}</h2><p>{t('area')}</p></article>
      </section>
      <section className="cta-band"><div className="shell cta-inner"><div><h2>{t('bookingTitle')}</h2><p>{t('bookingText')}</p></div><Link href="/booking" locale={locale} className="button button-accent">{common('bookNow')}<ArrowIcon /></Link></div></section>
    </>
  );
}
