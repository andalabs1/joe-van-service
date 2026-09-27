export type LocalizedText = {th: string; en: string};

export type Service = {
  slug: string;
  name: LocalizedText;
  shortDescription: LocalizedText;
  description: LocalizedText;
  startingPrice: number | null;
  pricingType: 'per-hour' | 'per-day' | 'per-trip' | 'quotation';
  inclusions: LocalizedText[];
  exclusions: LocalizedText[];
  highlights: LocalizedText[];
  published: boolean;
};

const text = (th: string, en: string): LocalizedText => ({th, en});

export const services: Service[] = [
  {
    slug: 'van-with-driver',
    name: text('รถตู้พร้อมคนขับ', 'Private van with driver'),
    shortDescription: text(
      'เดินทางเป็นกลุ่มแบบส่วนตัว พร้อมคนขับดูแลตลอดเส้นทาง',
      'Private group travel with a professional driver throughout the journey.'
    ),
    description: text(
      'เหมาะสำหรับครอบครัว กลุ่มเพื่อน ทีมงาน และผู้ประสานงานที่ต้องการรถพร้อมคนขับโดยไม่ต้องวางแผนการขับเอง',
      'Ideal for families, groups, teams and coordinators who want a vehicle and driver without handling the driving plan themselves.'
    ),
    startingPrice: null,
    pricingType: 'quotation',
    inclusions: [
      text('รถและคนขับตามช่วงเวลาที่ตกลง', 'Vehicle and driver for the agreed period'),
      text('ตรวจสอบเส้นทางก่อนวันเดินทาง', 'Route review before travel')
    ],
    exclusions: [
      text('ค่าใช้จ่ายเพิ่มเติมที่ไม่ได้ระบุในใบเสนอราคา', 'Costs not listed in the quotation')
    ],
    highlights: [
      text('เลือกประเภทรถตามจำนวนผู้โดยสาร', 'Vehicle category matched to passenger count'),
      text('เที่ยวเดียว ไปกลับ หรือค้างคืน', 'One-way, round-trip or overnight')
    ],
    published: true
  },
  {
    slug: 'daily-charter',
    name: text('เหมารถรายวัน', 'Daily charter'),
    shortDescription: text(
      'เหมาะกับทริปหลายจุด งานธุรกิจ และเที่ยวแบบยืดหยุ่น',
      'Flexible service for multi-stop itineraries, business and sightseeing.'
    ),
    description: text(
      'จองรถพร้อมคนขับเป็นรายวัน สูงสุดตามเวลาและระยะทางของแพ็กเกจ สามารถส่งลำดับจุดแวะให้ตรวจสอบล่วงหน้าได้',
      'Book a van and driver by the day within the package time and distance. Share your stop sequence in advance for review.'
    ),
    startingPrice: 6000,
    pricingType: 'per-day',
    inclusions: [
      text('สูงสุด 10 ชั่วโมงหรือ 400 กม. ต่อวัน', 'Up to 10 hours or 400 km per day'),
      text('คนขับตามช่วงเวลาที่จอง', 'Driver for the booked period')
    ],
    exclusions: [
      text('ค่า OT และระยะทางเกิน', 'Overtime and excess distance'),
      text('ค่าทางด่วน ที่จอดรถ และที่พักคนขับ', 'Tolls, parking and driver accommodation')
    ],
    highlights: [
      text('หลายจุดหมายในวันเดียว', 'Multiple destinations in one day'),
      text('ราคาต่อวันลดลงสำหรับหลายวัน', 'Reduced daily rate for multi-day bookings')
    ],
    published: true
  },
  {
    slug: 'airport-transfer',
    name: text('รับส่งสนามบิน', 'Airport transfer'),
    shortDescription: text(
      'รับส่งดอนเมืองและสุวรรณภูมิ พร้อมวางแผนพื้นที่สัมภาระ',
      'Don Mueang and Suvarnabhumi transfers with luggage planning.'
    ),
    description: text(
      'บริการรับหรือส่งสนามบินจากกรุงเทพฯ และพื้นที่ใกล้เคียง โปรดแจ้งหมายเลขเที่ยวบิน จำนวนผู้โดยสาร และสัมภาระเพื่อเลือกรถให้เหมาะสม',
      'Airport pick-up or drop-off from Bangkok and nearby areas. Share the flight number, passenger count and luggage so the right vehicle can be selected.'
    ),
    startingPrice: 1400,
    pricingType: 'per-trip',
    inclusions: [
      text('ตรวจสอบเวลารับตามข้อมูลเที่ยวบิน', 'Pick-up planning based on flight details'),
      text('พื้นที่สัมภาระตามประเภทรถ', 'Luggage space according to vehicle category')
    ],
    exclusions: [
      text('ค่าจอดรถและค่ารอเกินเวลาที่ตกลง', 'Parking and waiting beyond the agreed time')
    ],
    highlights: [
      text('สนามบินดอนเมือง', 'Don Mueang Airport'),
      text('สนามบินสุวรรณภูมิ', 'Suvarnabhumi Airport')
    ],
    published: true
  },
  {
    slug: 'outstation-trip',
    name: text('เดินทางต่างจังหวัด', 'Intercity journey'),
    shortDescription: text(
      'เส้นทางจากกรุงเทพฯ ไปจุดหมายทั่วประเทศ',
      'Routes from Bangkok to destinations across Thailand.'
    ),
    description: text(
      'ตรวจสอบราคาอ้างอิงตามจุดหมาย แล้วส่งจุดรับจริง วันเดินทาง และรูปแบบเที่ยวเดียวหรือไปกลับเพื่อรับราคาสุดท้าย',
      'Review the reference rate by destination, then send the exact pick-up point, date and one-way or return plan for final pricing.'
    ),
    startingPrice: 1300,
    pricingType: 'per-trip',
    inclusions: [
      text('ประเมินระยะทางและเส้นทางล่วงหน้า', 'Advance distance and route assessment'),
      text('รองรับทริปเที่ยวเดียวหรือไปกลับ', 'One-way and round-trip options')
    ],
    exclusions: [
      text('ค่าใช้จ่ายพื้นที่พิเศษ ภูเขา หรือเกาะ', 'Special-area, mountain or island charges')
    ],
    highlights: [
      text('มีราคาอ้างอิง 50 จุดหมาย', 'Reference rates for 50 destinations'),
      text('สอบถามเส้นทางอื่นได้', 'Other routes available on request')
    ],
    published: true
  },
  {
    slug: 'multi-day-trip',
    name: text('ทริปหลายวัน', 'Multi-day trip'),
    shortDescription: text(
      'เดินทางต่อเนื่องหลายวันพร้อมเรตรายวันที่วางแผนงบได้',
      'Continuous multi-day travel with reference daily rates for planning.'
    ),
    description: text(
      'เหมาะสำหรับทัวร์ครอบครัว งานภาคสนาม และการเดินทางหลายจังหวัด โดยต้องแจ้งที่พักและลำดับเส้นทางล่วงหน้า',
      'Suited to family tours, field work and multi-province travel. Accommodation and the route sequence should be shared in advance.'
    ),
    startingPrice: 6000,
    pricingType: 'per-day',
    inclusions: [text('ราคาต่อวันตามจำนวนวันที่จอง', 'Daily rate based on booking length')],
    exclusions: [
      text('ที่พักคนขับและค่าใช้จ่ายนอกแพ็กเกจ', 'Driver accommodation and out-of-package costs')
    ],
    highlights: [
      text('วางแผนเส้นทางหลายจังหวัด', 'Multi-province itinerary planning'),
      text('สูงสุด 10 ชั่วโมง/400 กม. ต่อวัน', 'Up to 10 hours/400 km per day')
    ],
    published: true
  },
  {
    slug: 'corporate-transport',
    name: text('รถรับส่งบริษัทและงานสัมมนา', 'Corporate & event transport'),
    shortDescription: text(
      'บริการตามตารางสำหรับทีมงาน แขกบริษัท และงานอีเวนต์',
      'Scheduled transport for teams, corporate guests and events.'
    ),
    description: text(
      'ส่งกำหนดการ จำนวนผู้โดยสาร จุดรับ และรอบรถเพื่อประเมินจำนวนรถและเวลาที่เหมาะสม',
      'Share the schedule, passenger count, pick-up points and rotations to assess vehicles and timing.'
    ),
    startingPrice: null,
    pricingType: 'quotation',
    inclusions: [text('วางแผนรอบรถตามกำหนดการ', 'Vehicle rotation planning based on the schedule')],
    exclusions: [text('บริการเพิ่มเติมที่ไม่ได้อยู่ในขอบเขตงาน', 'Additional services outside the agreed scope')],
    highlights: [
      text('รองรับหลายจุดรับ', 'Multiple pick-up points'),
      text('เสนอราคาตามขอบเขตงาน', 'Scope-based quotation')
    ],
    published: true
  }
];

export const publishedServices = services.filter((service) => service.published);

export function getService(slug: string) {
  return publishedServices.find((service) => service.slug === slug);
}
