import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import {buildMetadata} from '@/lib/site';
import {publishedServices} from '@/data/services';
import {bangkokRoutes} from '@/data/routes';
import {vehicleCategories} from '@/data/vehicle-pricing';
import {BookingForm} from '@/components/booking-form';

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
  const vehicleNote = vehicleCategory ? vehicleT(vehicleCategory) : undefined;
  const labels = Object.fromEntries(['tripTitle','contactTitle','service','selectService','pickupDate','pickupTime','returnDate','origin','destination','tripType','oneWay','roundTrip','overnight','passengers','luggage','vans','name','telephone','lineId','notes','consent','submit','submitting'].map((key) => [key, t(key)])) as Parameters<typeof BookingForm>[0]['labels'];

  return (
    <>
      <section className="page-hero"><div className="shell"><p className="eyebrow">{t('eyebrow')}</p><h1>{t('title')}</h1><p>{t('lead')}</p></div></section>
      <section className="section shell booking-layout">
        <BookingForm locale={locale} labels={labels} services={publishedServices.map((item) => ({value: item.slug, label: item.name[locale]}))} defaults={{service, origin, destination: route?.destination[locale] || destinationId || undefined, notes: vehicleNote}} />
        <aside className="booking-aside"><span>01</span><h2>{locale === 'th' ? 'ส่งรายละเอียดครั้งเดียว' : 'Share everything once'}</h2><p>{locale === 'th' ? 'ข้อมูลที่ครบช่วยให้ตรวจรถว่าง เส้นทาง และค่าใช้จ่ายได้เร็วขึ้น' : 'Complete details make it faster to check availability, the route and costs.'}</p><hr /><span>02</span><h2>{locale === 'th' ? 'รอการยืนยัน' : 'Wait for confirmation'}</h2><p>{locale === 'th' ? 'คำขอนี้ยังไม่ใช่การจองจนกว่าจะได้รับการตอบรับและยืนยันราคา' : 'This request is not a booking until availability and the final price are confirmed.'}</p></aside>
      </section>
    </>
  );
}
