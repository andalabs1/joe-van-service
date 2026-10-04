import type {Metadata} from 'next';
import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import {buildMetadata} from '@/lib/site';
import {publishedServices} from '@/data/services';
import {bangkokRoutes} from '@/data/routes';
import {vehicleCategories} from '@/data/vehicle-pricing';
import {BookingForm} from '@/components/booking-form';
import {ClockIcon, HeartIcon, ShieldIcon, StarIcon} from '@/components/icons';
import { FaRegSmileWink } from 'react-icons/fa';
import { LuThumbsUp } from 'react-icons/lu';
import { FaShieldHalved } from 'react-icons/fa6';

type PageProps = {
  params: Promise<{locale: Locale}>;
  searchParams: Promise<{service?: string | string[]; origin?: string | string[]; destination?: string | string[]; vehicle?: string | string[]}>;
};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Metadata'});
  return buildMetadata({locale, path: '/booking', title: t('bookingTitle'), description: t('bookingDescription')});
}

export default async function BookingPage({params, searchParams}: PageProps) {
  const {locale} = await params;
  const query = await searchParams;
  const t = await getTranslations({locale, namespace: 'Booking'});
  const vehicleT = await getTranslations({locale, namespace: 'Vehicle'});
  const destinationId = typeof query.destination === 'string' ? query.destination : '';
  const route = bangkokRoutes.find((item) => item.id === destinationId);
  const service = typeof query.service === 'string' && publishedServices.some((item) => item.slug === query.service) ? query.service : undefined;
  const originId = typeof query.origin === 'string' ? query.origin : '';
  const originRoute = bangkokRoutes.find((item) => item.id === originId);
  const origin = originId === 'bangkok' ? (locale === 'th' ? 'กรุงเทพฯ' : 'Bangkok') : (originRoute?.destination[locale] || originId || undefined);
  const vehicleParam = typeof query.vehicle === 'string' ? query.vehicle : '';
  const vehicleCategory = (vehicleCategories as readonly string[]).includes(vehicleParam) ? vehicleParam : undefined;
  const serviceNote = service ? publishedServices.find((item) => item.slug === service)?.name[locale] : undefined;
  const labels = Object.fromEntries(['tripTitle','contactTitle','pickupDate','pickupTime','origin','destination','tripType','oneWay','roundTrip','overnight','passengers','vehicleType','selectVehicle','luggage','luggagePlaceholder','telephone','lineChannel','lineId','notes','submit','submitting'].map((key) => [key, t(key)])) as Parameters<typeof BookingForm>[0]['labels'];

  return (
    <>
      <section className="booking-hero">
        <Image className="booking-hero-image" src="/bangkok-road-hero.png" alt="" fill priority sizes="100vw" />
        <div className="booking-hero-overlay" />
        <div className="shell booking-hero-content">
          <h1>{t('title')}</h1>
          <p>{t('lead')}</p>
        </div>
      </section>

      <section className="booking-section">
        <div className="shell booking-layout">
          <div className="booking-form-card">
            <BookingForm locale={locale} labels={labels} vehicles={vehicleCategories.map((category) => ({value: category, label: vehicleT(category)}))} defaults={{origin, destination: route?.destination[locale] || destinationId || undefined, vehicle: vehicleCategory, notes: serviceNote}} />
          </div>

          <aside className="booking-aside h-fit">
            <div className="booking-aside-image">
              <Image src="/yourjourney.png" alt="Your journey, our priority" fill sizes="(max-width: 900px) 100vw, 360px" />
            </div>
            <div className="booking-benefits">
              <div><FaShieldHalved  /><p><strong>{locale === 'th' ? 'ปลอดภัย' : 'Safe'}</strong><span>{locale === 'th' ? 'ด้วยคนขับมืออาชีพ' : 'Professional drivers'}</span></p></div>
              <div><ClockIcon /><p><strong>{locale === 'th' ? 'ตรงเวลา' : 'On time'}</strong><span>{locale === 'th' ? 'ไม่ต้องรอนาน' : 'No long waits'}</span></p></div>
              <div><FaRegSmileWink  /><p><strong>{locale === 'th' ? 'สะดวกสบาย' : 'Comfortable'}</strong><span>{locale === 'th' ? 'รถใหม่ สะอาด' : 'Modern, clean vehicles'}</span></p></div>
              <div><LuThumbsUp  /><p><strong>{locale === 'th' ? 'ราคายุติธรรม' : 'Fair pricing'}</strong><span>{locale === 'th' ? 'ไม่มีค่าใช้จ่ายแอบแฝง' : 'No hidden charges'}</span></p></div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
