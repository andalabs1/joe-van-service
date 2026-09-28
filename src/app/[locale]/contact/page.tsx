import type {Metadata} from 'next';
import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {buildMetadata, contactEmail, lineUrl, phone} from '@/lib/site';
import {ArrowIcon, HeartIcon, LineIcon, MailIcon, PhoneIcon, PinIcon, ShieldIcon, StarIcon, UsersIcon} from '@/components/icons';
import {ContactForm} from '@/components/contact-form';
import { FaCheck } from 'react-icons/fa6';

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
  const values = [
    {icon: ShieldIcon, title: t('safeTitle'), text: t('safeText')},
    {icon: UsersIcon, title: t('professionalTitle'), text: t('professionalText')},
    {icon: StarIcon, title: t('punctualTitle'), text: t('punctualText')},
    {icon: HeartIcon, title: t('careTitle'), text: t('careText')}
  ];
  const faqs = [
    {question: t('faqQuestion1'), answer: t('faqAnswer1')},
    {question: t('faqQuestion2'), answer: t('faqAnswer2')},
    {question: t('faqQuestion3'), answer: t('faqAnswer3')},
    {question: t('faqQuestion4'), answer: t('faqAnswer4')},
    {question: t('faqQuestion5'), answer: t('faqAnswer5')}
  ];

  return (
    <>
      <section className="contact-about-hero">
        <Image src="/full-van.jpg" alt={t('heroAlt')} fill priority sizes="(max-width: 760px) 100vw, 50vw" />
        <div className="contact-about-overlay" />
        <div className="shell contact-about-content">
          <p className="eyebrow light">{t('eyebrow')}</p>
          <h1>{t('aboutTitle')}</h1>
          <strong>mongkonridemate</strong>
          <p>{t('aboutText')}</p>
        </div>
      </section>

      <section className="contact-values shell" aria-label={t('valuesLabel')}>
        {values.map(({icon: Icon, title, text}) => (
          <article key={title}><Icon /><h2>{title}</h2><p>{text}</p></article>
        ))}
      </section>

      <section className="section shell contact-detail-layout">
        <article className="contact-panel contact-info-panel">
          <h2 className='font-medium'>{t('title')}</h2>
          <p className="contact-panel-lead">{t('lead')}</p>
          <div className="contact-info-body">
            <ul className="contact-list">
              <li><PhoneIcon /><div><span>{t('phoneTitle')}</span><a href={`tel:${phone}`}>099-924-1591</a></div></li>
              <li><LineIcon /><div><span>LINE</span><a href={lineUrl} target="_blank" rel="noreferrer">@385hqvbc</a></div></li>
              <li><MailIcon /><div><span>Email</span><a href={`mailto:${contactEmail}`}>{contactEmail}</a></div></li>
            </ul>
            <a href={lineUrl} target="_blank" rel="noreferrer" className="contact-inline-qr">
              <span className="contact-inline-qr-image"><Image src="/line-qr.jpg" alt={t('lineQrAlt')} fill sizes="180px" /></span>
              <strong><LineIcon />{t('addLine')}</strong>
            </a>
          </div>
        </article>

        <article className="contact-panel service-area-panel">
          <h2 className='font-medium'>{t('areaHeading')}</h2>
          <ul className="service-area-list">
            <li><PinIcon fill='#0A274D' className="text-white" />{t('areaBangkok')}</li>
            <li className="font-light"><FaCheck />{t('areaProvinces')}</li>
            <li className="font-light"><FaCheck />{t('areaAirport')}</li>
            <li className="font-light"><FaCheck />{t('areaNationwide')}</li>
          </ul>
          <div className="service-area-art">
            <Image src="/anywhere_anytime.png" alt="Anywhere Anytime" fill sizes="(max-width: 760px) 100vw, 42vw" />
          </div>
        </article>
      </section>

      <section className="section shell contact-enquiry-section" aria-labelledby="contact-form-title">
        <div className="contact-form-layout">
          <div className="contact-form-copy">
            <p className="eyebrow">{t('formEyebrow')}</p>
            <h2 id="contact-form-title">{t('formTitle')}</h2>
            <p>{t('formLead')}</p>
          </div>
          <ContactForm
            locale={locale}
            labels={{
              name: t('formName'),
              telephone: t('formTelephone'),
              lineId: t('formLineId'),
              message: t('formMessage'),
              consent: t('formConsent'),
              submit: t('formSubmit'),
              submitting: t('formSubmitting')
            }}
          />
        </div>
      </section>

      <section className="section section-muted contact-faq-section" aria-labelledby="contact-faq-title">
        <div className="shell contact-faq-layout">
          <div className="contact-faq-heading">
            <p className="eyebrow">FAQ</p>
            <h2 id="contact-faq-title">{t('faqTitle')}</h2>
            <p>{t('faqLead')}</p>
          </div>
          <div className="contact-faq-list">
            {faqs.map((faq, index) => (
              <details key={faq.question} open={index === 0}>
                <summary><span>{faq.question}</span><span aria-hidden="true">+</span></summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="cta-band cta-premium"><div className="shell cta-inner"><div><h2>{t('bookingTitle')}</h2><p>{t('bookingText')}</p></div><Link href="/booking" locale={locale} className="button button-dark">{common('bookNow')}<ArrowIcon /></Link></div></section>
    </>
  );
}
