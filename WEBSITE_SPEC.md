# mongkonridemate — Website Specification

> สถานะ: Draft สำหรับตรวจสอบก่อนเริ่มสร้างโปรเจกต์จริง  
> วันที่จัดทำ: 27 กันยายน 2026  
> ภาษา: ไทย (`th`) และอังกฤษ (`en`)  
> Hosting เป้าหมาย: Vercel  
> หมายเหตุสำคัญ: ราคาทั้งหมดในเอกสารนี้นำมาจากข้อมูลอ้างอิงที่ผู้ใช้ส่งมา ต้องยืนยันว่าเป็นราคาของ mongkonridemate ก่อนเผยแพร่จริง

## 1. เป้าหมาย

สร้างเว็บไซต์บริการรถตู้พร้อมคนขับที่:

- รองรับ SEO ภาษาไทยและอังกฤษ
- แสดงข้อมูลครบใน HTML โดยไม่พึ่ง SPA
- โหลดเร็วและใช้งานสะดวกบนมือถือ
- ช่วยลูกค้าตรวจสอบบริการและราคาก่อนติดต่อ
- รับคำขอจองผ่านฟอร์ม พร้อมเชื่อมต่อโทรศัพท์และ LINE
- deploy และดูแลต่อบน Vercel ได้ง่าย

Primary conversion:

1. ส่งคำขอจองผ่าน `/[locale]/booking`
2. ติดต่อผ่าน LINE
3. โทรหา mongkonridemate

## 2. ขอบเขตและข้อกำหนดที่ตกลงแล้ว

- ไม่ทำเป็น SPA หน้าเดียว
- ทุก URL ต้องส่ง HTML ที่มีเนื้อหาหลักครบ
- ใช้ภาษาไทยและอังกฤษทั้งระบบ
- ภาษาเริ่มต้นคือภาษาไทย
- ใช้ URL prefix `/th` และ `/en`
- หน้า service detail ใช้ dynamic route
- ราคาจากกรุงเทพฯ ทุกจุดหมายรวมอยู่ในหน้า Bangkok หน้าเดียว
- ไม่สร้าง `/routes/bangkok/[destination]`
- มีหน้า booking แยกจาก contact
- ใช้คำสะกด `bangkok` ใน URL เสมอ ไม่ใช้ `bankok`

## 3. Technology Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- `next-intl` สำหรับ i18n
- Server Components เป็นค่าเริ่มต้น
- Static Generation สำหรับหน้าประชาสัมพันธ์และหน้าราคา
- Server Action หรือ Route Handler สำหรับส่งฟอร์มจอง
- Vercel สำหรับ preview และ production deployment
- ข้อมูลบริการและราคาเก็บเป็น typed local data ในระยะแรก

หลักการ JavaScript:

- ใช้ Client Components เฉพาะตัวกรองราคา เมนูมือถือ และส่วนที่ต้อง interactive
- เนื้อหา ราคา เมนู และลิงก์ต้องอ่านได้แม้ JavaScript ใช้งานไม่ได้
- ไม่โหลดข้อมูลราคาหลักหลังเปิดหน้าด้วย client-side fetch

## 4. Information Architecture

```text
/
├── th/
│   ├── page.tsx
│   ├── services-rates/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── routes/
│   │   ├── page.tsx
│   │   └── bangkok/page.tsx
│   ├── contact/page.tsx
│   └── booking/page.tsx
└── en/
    └── โครงสร้างเดียวกับ th
```

Root `/` redirect ไป `/th`

### Main navigation

| ไทย | English | URL pattern |
|---|---|---|
| หน้าแรก | Home | `/[locale]` |
| บริการและราคา | Services & Rates | `/[locale]/services-rates` |
| เส้นทาง | Routes | `/[locale]/routes` |
| ติดต่อ | Contact | `/[locale]/contact` |
| จองรถ | Book a Van | `/[locale]/booking` |

บนมือถือมี persistent action bar:

- โทร
- LINE
- จองรถ

## 5. Page Specifications

### 5.1 Home — `/[locale]`

เนื้อหา:

1. Hero พร้อมภาพรถจริง
2. ข้อความหลัก “รถตู้พร้อมคนขับ กรุงเทพฯ–ต่างจังหวัด”
3. ปุ่มจองรถ โทร และ LINE
4. จุดเด่น เช่น ตรงเวลา รถสะอาด เดินทางปลอดภัย
5. บริการหลัก
6. รถที่ให้บริการ จำนวนที่นั่ง และสัมภาระ
7. เส้นทางยอดนิยม
8. ราคาเริ่มต้น
9. แนะนำ mongkonridemate และประสบการณ์
10. รีวิวลูกค้าจริง
11. FAQ แบบย่อ
12. Final CTA

ข้อห้าม:

- ไม่ใช้รีวิวสมมติ
- ไม่แสดงจำนวนปี ประกัน หรือใบอนุญาตที่ยังไม่ได้รับการยืนยัน
- ไม่ใช้ภาพรถที่ไม่ตรงกับรถให้บริการจริงในลักษณะที่ทำให้เข้าใจผิด

### 5.2 Services index — `/[locale]/services-rates`

เนื้อหา:

- รายการบริการทั้งหมด
- ราคาเริ่มต้น
- ตารางราคาแบบรายชั่วโมงและหลายวัน
- สิ่งที่รวมและไม่รวม
- ค่า OT ค่าเกินระยะทาง ค่าทางด่วน และที่พักคนขับ
- ลิงก์ไป service detail
- CTA ไป booking

### 5.3 Dynamic service detail — `/[locale]/services-rates/[slug]`

Initial slugs:

```text
van-with-driver
daily-charter
airport-transfer
outstation-trip
multi-day-trip
corporate-transport
```

เริ่ม publish เฉพาะ service ที่มีเนื้อหาและราคายืนยันแล้ว

แต่ละหน้าประกอบด้วย:

- ชื่อและคำอธิบายบริการ
- เหมาะกับใคร
- รูปแบบการเดินทาง
- ราคาเริ่มต้นหรือข้อความขอใบเสนอราคา
- สิ่งที่รวมและไม่รวม
- เงื่อนไข
- FAQ เฉพาะบริการ
- CTA ไป booking พร้อม query parameter

ตัวอย่าง:

```text
/th/booking?service=airport-transfer
/en/booking?service=airport-transfer
```

### 5.4 Routes index — `/[locale]/routes`

เนื้อหา:

- แนะนำบริการเส้นทาง
- Card ไปยัง “ราคาเส้นทางจากกรุงเทพฯ”
- เส้นทางยอดนิยม
- คำอธิบายเที่ยวเดียว ไปกลับ และทริปค้างคืน
- CTA ไป booking

### 5.5 Bangkok routes — `/[locale]/routes/bangkok`

รวมราคาเส้นทางจากกรุงเทพฯ ทั้งหมดในหน้านี้ ไม่มี destination sub-route

First viewport:

- H1
- คำอธิบายสั้น
- ช่องค้นหาปลายทาง
- ตัวกรองภูมิภาค
- ตารางหรือรายการราคาเริ่มต้นทันที

Filters:

```text
all
metropolitan
east
west
north-northeast
south
```

รองรับ query strings:

```text
/th/routes/bangkok?region=east
/th/routes/bangkok?q=พัทยา
/en/routes/bangkok?region=south
```

Desktop แสดงเป็นตาราง ส่วน mobile แสดงเป็น cards เพื่อป้องกัน horizontal overflow

แต่ละรายการมี:

- ปลายทางไทย/อังกฤษ
- ระยะทางโดยประมาณ
- ราคาแต่ละประเภทรถตู้ที่เปิดใช้งาน
- ปุ่มจอง
- หากราคาเป็น `null` แสดง “สอบถามราคา” / “Request a quote”

Booking URL:

```text
/th/booking?origin=bangkok&destination=pattaya
/en/booking?origin=bangkok&destination=pattaya
```

### 5.6 Contact — `/[locale]/contact`

เนื้อหา:

- เบอร์โทร
- LINE link และ QR code
- เวลาทำการ
- พื้นที่ให้บริการ
- ข้อมูลกิจการ
- แผนที่เฉพาะกรณีมีจุดให้บริการจริง
- ลิงก์ privacy notice

Contact ไม่ใช้แทน booking form

### 5.7 Booking — `/[locale]/booking`

Form fields:

- Service type
- Pick-up date
- Pick-up time
- Return date (optional)
- Origin
- Destination
- Trip type: one-way / round-trip / overnight
- Passengers
- Luggage
- Number of vans
- Customer name
- Telephone
- LINE ID (optional)
- Additional details
- Privacy consent

พฤติกรรม:

- รับค่าเริ่มต้นจาก query parameters
- validate ทั้ง client และ server
- แสดง error ใกล้ field และมี error summary
- ป้องกัน bot ด้วย honeypot และ rate limiting
- หลังส่งสำเร็จแสดง booking reference และข้อความสรุป
- ใช้ถ้อยคำ “ส่งคำขอจอง” ไม่ใช้ “ยืนยันการจอง”
- ไม่ถือว่าการจองเสร็จสมบูรณ์จนกว่าทีม mongkonridemate ตอบรับ

สถานะ:

- default
- validating
- submitting
- success
- failure

## 6. Internationalization

Supported locales:

```ts
type Locale = "th" | "en"
```

โครงสร้างข้อความ:

```text
messages/
├── th.json
└── en.json
```

ต้องแปล:

- Navigation
- Buttons และ form labels
- Validation และ status messages
- Page copy
- Services
- Route destinations
- Pricing notes
- FAQ
- Metadata
- Structured data
- Booking confirmation
- Email/notification content หากเปิดใช้

ข้อมูลที่ใช้ร่วมกันทั้งสองภาษา:

- IDs
- Slugs
- ตัวเลขราคา
- ระยะทาง
- Query parameter values

Language switcher:

- แสดง `TH | EN`
- รักษา path ปัจจุบัน
- รักษา query parameters
- `/th/services-rates/airport-transfer` สลับเป็น `/en/services-rates/airport-transfer`

Formatting:

- Thai: `฿1,400`, วันที่แบบไทยที่อ่านง่าย
- English: `THB 1,400`, วันที่ภาษาอังกฤษ
- ใช้ `Intl.NumberFormat` และ `Intl.DateTimeFormat`

## 7. SEO Requirements

ทุกหน้าต้องมี:

- Unique title
- Unique meta description
- Canonical URL
- Thai/English language alternates
- `x-default` ชี้ไปภาษาไทย
- Open Graph title/description เฉพาะภาษา
- หนึ่ง H1 ต่อหน้า
- Semantic heading order
- Internal links
- Image alt text
- Breadcrumb เมื่อเหมาะสม

ตัวอย่าง alternates:

```html
<link rel="canonical" href="https://example.com/th/routes/bangkok">
<link rel="alternate" hreflang="th" href="https://example.com/th/routes/bangkok">
<link rel="alternate" hreflang="en" href="https://example.com/en/routes/bangkok">
<link rel="alternate" hreflang="x-default" href="https://example.com/th/routes/bangkok">
```

Technical SEO:

- `sitemap.xml` มีทุกหน้าทั้งสองภาษา
- `robots.txt`
- `manifest.webmanifest`
- Site-specific SVG favicon
- Production indexable
- Preview deployments ต้องเป็น `noindex`
- Redirect HTTP → HTTPS
- เลือก canonical host ระหว่าง `www` และ non-`www`
- Custom 404
- ไม่มี broken internal links

Structured data:

- `LocalBusiness`
- `Organization`
- `Service`
- `BreadcrumbList`
- รีวิว/คะแนนใช้เฉพาะข้อมูลจริงที่แสดงบนหน้า

ตัวอย่าง titles:

```text
TH: รถตู้พร้อมคนขับ กรุงเทพฯ–ต่างจังหวัด | mongkonridemate
EN: Private Van with Driver in Bangkok | mongkonridemate

TH: ราคารถตู้จากกรุงเทพฯ ไปต่างจังหวัด | mongkonridemate
EN: Van Transfer Prices from Bangkok | mongkonridemate
```

## 8. Data Models

### 8.1 Localized text

```ts
type LocalizedText = {
  th: string
  en: string
}
```

### 8.2 Service

```ts
type Service = {
  slug: string
  name: LocalizedText
  shortDescription: LocalizedText
  description: LocalizedText
  startingPrice: number | null
  pricingType: "per-hour" | "per-day" | "per-trip" | "quotation"
  maximumHours?: number
  maximumKilometers?: number
  inclusions: LocalizedText[]
  exclusions: LocalizedText[]
  faq: Array<{
    question: LocalizedText
    answer: LocalizedText
  }>
  published: boolean
}
```

### 8.3 Bangkok route

```ts
type BangkokRoute = {
  id: string
  destination: LocalizedText
  region:
    | "metropolitan"
    | "east"
    | "west"
    | "north-northeast"
    | "south"
  distanceKm: number
  featured: boolean
  prices: {
    vanStandard: number | null
    vanExecutive: number | null
    electricMpv: number | null
    vanPremium: number | null
    vanLuxury: number | null
  }
  note?: LocalizedText
}
```

### 8.4 Booking request

```ts
type BookingRequest = {
  locale: "th" | "en"
  service: string
  pickupDate: string
  pickupTime: string
  returnDate?: string
  origin: string
  destination: string
  tripType: "one-way" | "round-trip" | "overnight"
  passengers: number
  luggage: number
  vans: number
  customerName: string
  telephone: string
  lineId?: string
  notes?: string
  privacyConsent: true
}
```

## 9. Bangkok MPV/Van Reference Prices

> ข้อมูลต่อไปนี้ดึงจากไฟล์ที่ผู้ใช้ส่งมา ไม่ถือว่าเป็นราคาสุดท้ายของ mongkonridemate
> `n/a` ต้องถูกเก็บเป็น `null` และแสดง “สอบถามราคา”  
> เครื่องหมาย `*` จากข้อมูลต้นฉบับต้องตรวจสอบความหมายก่อนนำขึ้นเว็บ

| ระยะทาง | Destination | Standard | Executive | Electric MPV | Premium | Luxury |
|---:|---|---:|---:|---:|---:|---:|
| 25 km | Bangkok Don Mueang Airport | ฿1,400 | ฿1,700 | ฿3,000 | ฿3,500 | ฿10,000 |
| 30 km | Bangkok Suvarnabhumi Airport | ฿1,400 | ฿1,700 | ฿3,000 | ฿3,500 | ฿10,000 |
| 30 km | Samut Prakan | ฿1,300 | ฿1,600 | ฿3,000 | ฿3,500 | ฿18,000 |
| 35 km | Nonthaburi | ฿1,500 | ฿1,800 | ฿3,450 | ฿4,050 | ฿5,750 |
| 35 km | Pathum Thani | ฿2,000 | ฿2,450 | ฿4,600 | ฿5,400 | ฿7,700 |
| 40 km | Samut Sakhon | ฿2,100 | ฿2,600 | ฿4,850 | ฿5,650 | ฿8,100 |
| 90 km | Chachoengsao | ฿2,500 | ฿3,100 | ฿5,750 | ฿6,750 | ฿9,600 |
| 100 km | Bang Saen | ฿2,400 | ฿2,950 | ฿5,550 | ฿6,450 | ฿9,250 |
| 130 km | Laem Chabang * | ฿3,500 | ฿4,500 | ฿7,500 | ฿11,500 | ฿16,500 |
| 150 km | Chon Buri | ฿2,500 | ฿3,100 | ฿5,750 | ฿6,750 | ฿9,600 |
| 150 km | Pattaya * | ฿2,850 | ฿3,800 | ฿6,500 | ฿10,000 | ฿18,000 |
| 200 km | Sattahip | ฿2,850 | ฿3,800 | ฿6,500 | ฿10,000 | ฿18,000 |
| 220 km | Rayong | ฿3,500 | ฿4,000 | n/a | ฿15,000 | ฿28,000 |
| 220 km | U-Tapao | ฿3,300 | ฿4,000 | n/a | ฿15,000 | ฿23,500 |
| 275 km | Chanthaburi | ฿4,900 | ฿6,000 | ฿11,000 | ฿13,000 | ฿18,500 |
| 300 km | Aranyaprathet | ฿3,800 | ฿4,500 | n/a | ฿13,000 | ฿33,000 |
| 300 km | Sa Kaeo | ฿4,200 | ฿5,200 | n/a | n/a | n/a |
| 400 km | Trat | ฿5,500 | ฿6,750 | n/a | ฿22,000 | ฿30,000 |
| 420 km | Hat Lek | ฿6,000 | ฿7,500 | n/a | n/a | n/a |
| 450 km | Koh Chang | ฿8,250 | ฿10,000 | ฿19,000 | ฿24,000 | ฿32,000 |
| 80 km | Samut Songkhram | ฿2,400 | ฿2,950 | ฿5,500 | ฿6,450 | ฿9,250 |
| 200 km | Cha-am | ฿3,500 | ฿4,000 | n/a | ฿13,000 | ฿25,000 |
| 220 km | Hua Hin * | ฿3,800 | ฿4,500 | ฿8,500 | ฿13,000 | ฿33,000 |
| 245 km | Pranburi | ฿4,100 | ฿5,000 | ฿9,400 | ฿15,000 | ฿21,500 |
| 265 km | Sam Roi Yot | ฿4,200 | ฿5,300 | n/a | n/a | n/a |
| 300 km | Kui Buri | ฿4,200 | ฿5,300 | n/a | n/a | n/a |
| 380 km | Bang Saphan | ฿5,500 | ฿6,500 | ฿12,500 | ฿26,000 | ฿35,000 |
| 500 km | Chumphon | ฿7,200 | ฿8,800 | ฿16,500 | ฿25,000 | ฿35,000 |
| 644 km | Surat Thani | ฿14,500 | ฿18,000 | ฿33,500 | ฿38,500 | ฿55,500 |
| 710 km | Don Sak | ฿14,500 | ฿18,000 | ฿33,500 | ฿38,500 | ฿55,500 |
| 780 km | Koh Samui | n/a | n/a | n/a | ฿35,000 | n/a |
| 867 km | Phuket | ฿14,500 | ฿18,000 | ฿33,500 | ฿38,500 | ฿55,500 |
| 946 km | Krabi | ฿15,500 | ฿19,000 | ฿35,500 | ฿41,500 | ฿59,500 |
| 70 km | Nakhon Pathom | ฿2,500 | ฿3,000 | n/a | ฿12,300 | n/a |
| 130 km | Kanchanaburi * | ฿3,500 | ฿4,000 | ฿8,000 | ฿11,500 | ฿20,000 |
| 165 km | Ratchaburi | ฿3,100 | ฿3,800 | n/a | n/a | n/a |
| 235 km | Sai Yok | ฿3,900 | ฿4,500 | n/a | n/a | n/a |
| 380 km | Sangkhla Buri | ฿6,500 | ฿8,000 | n/a | n/a | n/a |
| 76 km | Ayutthaya | ฿2,500 | ฿3,100 | ฿5,500 | ฿10,000 | n/a |
| 107 km | Saraburi | ฿2,800 | ฿3,500 | n/a | n/a | n/a |
| 180 km | Khao Yai * | ฿3,800 | ฿4,400 | n/a | ฿13,000 | ฿33,000 |
| 250 km | Wang Nam Khiao | ฿4,100 | ฿4,800 | n/a | ฿18,000 | n/a |
| 259 km | Nakhon Ratchasima | ฿4,000 | ฿5,000 | ฿9,000 | ฿11,500 | ฿28,000 |
| 260 km | Nakhon Sawan | ฿4,000 | ฿5,000 | n/a | ฿20,900 | n/a |
| 350 km | Phetchabun | ฿7,000 | ฿8,000 | n/a | n/a | n/a |
| 400 km | Phitsanulok | ฿7,000 | ฿8,000 | n/a | ฿17,000 | ฿35,000 |
| 500 km | Mae Sot | ฿14,500 | ฿18,000 | ฿33,500 | ฿38,500 | ฿55,500 |
| 500 km | Sukhothai | ฿8,000 | ฿10,000 | n/a | n/a | ฿41,500 |
| 695 km | Chiang Mai | ฿14,500 | ฿18,000 | ฿33,500 | ฿38,500 | ฿55,500 |
| 820 km | Chiang Rai | ฿16,500 | ฿20,500 | n/a | n/a | n/a |

## 10. Hourly MPV/Van Reference Prices

| ระยะเวลา | ระยะทางสูงสุด | Standard | Executive | Electric MPV | Premium | Luxury |
|---:|---:|---:|---:|---:|---:|---:|
| 3 ชั่วโมง | 200 กม. | ฿1,950 | ฿2,400 | ฿4,500 | ฿7,500 | ฿10,000 |
| 4 ชั่วโมง | 250 กม. | ฿2,600 | ฿3,200 | ฿6,000 | ฿7,500 | ฿10,000 |
| 5 ชั่วโมง | 250 กม. | ฿3,250 | ฿4,000 | ฿7,500 | ฿9,400 | ฿12,500 |
| 6 ชั่วโมง | 300 กม. | ฿3,850 | ฿4,750 | ฿8,900 | ฿11,000 | ฿15,000 |
| 7 ชั่วโมง | 300 กม. | ฿4,500 | ฿5,550 | ฿10,500 | ฿13,000 | ฿17,500 |
| 8 ชั่วโมง | 350 กม. | ฿5,200 | ฿6,400 | ฿12,000 | ฿15,000 | ฿20,000 |
| 9 ชั่วโมง | 350 กม. | ฿5,850 | ฿7,200 | ฿13,500 | ฿17,000 | ฿22,500 |
| 10 ชั่วโมง | 400 กม. | ฿6,500 | ฿8,000 | ฿15,000 | ฿19,000 | ฿25,000 |

## 11. Multi-day MPV/Van Reference Prices

ราคาต่อวัน สูงสุด 10 ชั่วโมง / 400 กม. ต่อวัน:

| จำนวนวัน | Standard | Executive | Electric MPV | Premium | Luxury |
|---:|---:|---:|---:|---:|---:|
| 1 | ฿6,500 | ฿8,000 | ฿15,000 | ฿19,000 | ฿25,000 |
| 2 | ฿6,400 | ฿7,900 | ฿15,000 | ฿18,500 | ฿24,500 |
| 3 | ฿6,350 | ฿7,800 | ฿14,500 | ฿18,500 | ฿24,500 |
| 4 | ฿6,250 | ฿7,700 | ฿14,500 | ฿18,000 | ฿24,000 |
| 5 | ฿6,150 | ฿7,550 | ฿14,000 | ฿17,500 | ฿23,500 |
| 6 | ฿6,100 | ฿7,500 | ฿14,000 | ฿17,500 | ฿23,500 |
| 7 | ฿6,000 | ฿7,400 | ฿14,000 | ฿17,500 | ฿23,000 |

ยอดประมาณการหลายวัน:

```text
estimatedTotal = numberOfDays * pricePerDay
```

ต้องระบุว่าเป็นประมาณการจนกว่าจะได้รับการยืนยันจากทีม mongkonridemate

## 12. Pricing Notes to Localize

สาระสำคัญจากข้อมูลต้นฉบับ:

- ลูกค้าควรแจ้งจุดหมายล่วงหน้าเพื่อประเมินเส้นทางและเวลา
- ลำดับการเดินทางอาจเปลี่ยนตามการจราจร เวลาทำการ และสถานการณ์จริง
- บริการรายชั่วโมงเริ่มนับจากจุดรับจนรถกลับมายังจุดเดิม
- การเดินทางไกลเที่ยวเดียวไม่ใช้เรตรายชั่วโมงและต้องเสนอราคาแยก
- อาจแบ่งเวลาการใช้งานเป็นหลายช่วงภายในวันได้ โดยต้องยืนยันกติกากับทีม mongkonridemate ก่อนเผยแพร่
- เส้นทางภูเขาหรือพื้นที่สูงต้องตรวจราคาอีกครั้ง
- ค่าบริการเกาะและค่าเชื้อเพลิงพิเศษต้องยืนยันก่อนใช้งานจริง

ต้องยืนยันเพิ่มเติม:

- น้ำมันรวมอยู่ในราคาหรือไม่
- ทางด่วนและที่จอดรถ
- ค่าเรือหรือค่าข้ามเกาะ
- ค่า OT
- ค่าเกินระยะทาง
- ที่พักคนขับ
- VAT
- มัดจำ
- ยกเลิก/เลื่อนวัน
- ราคาช่วงเทศกาล
- ราคาเที่ยวเดียวหรือไปกลับ

## 13. Visual Direction

แนวคิด: “คนขับท้องถิ่นที่ไว้ใจได้ ดูแลเหมือนคนรู้จัก แต่บริการเป็นระบบ”

แนวทาง:

- สีหลัก: Navy/Deep blue เพื่อความน่าเชื่อถือ
- สี CTA: สีเขียวสำหรับ LINE และสีส้ม/ทองสำหรับ booking
- พื้นหลังขาวหรือเทาเย็น ไม่ใช้ธีมสำเร็จรูปแบบ generic
- Typography ไทยอ่านง่าย เช่น Noto Sans Thai หรือฟอนต์ระบบที่เหมาะสม
- Body text อย่างน้อย 16px
- Labels อย่างน้อย 14px
- ใช้รูปทีม mongkonridemate และรถจริง 1–3 รูปเป็นหลัก
- ไม่สร้างภาพรถปลอมด้วย CSS/SVG
- Motion น้อยและเคารพ `prefers-reduced-motion`
- Focus states ชัดเจน
- รองรับการขยายตัวอักษร 200%

## 14. Accessibility

- Semantic HTML
- Keyboard navigation
- Skip-to-content link
- Visible focus
- Contrast ผ่าน WCAG AA
- Form labels เชื่อมกับ inputs
- Error messages ใช้ `aria-describedby`
- Success/error announcements ใช้ live region เมื่อจำเป็น
- ตารางมี caption และ column headers
- Mobile cards ไม่สูญเสียความหมายของหัวคอลัมน์
- ปุ่มโทรและ LINE มี accessible names
- รูปตกแต่งใช้ empty alt

## 15. Performance Targets

- Mobile-first
- ไม่มี layout shift จากรูปภาพ
- ใช้ responsive image sizes
- Lazy-load รูปที่อยู่นอก viewport
- ลด client JavaScript
- ไม่มี third-party script ที่ไม่จำเป็น
- Lighthouse Performance เป้าหมาย ≥ 90
- Accessibility เป้าหมาย ≥ 95
- SEO เป้าหมาย ≥ 95
- LCP เป้าหมาย ≤ 2.5s
- CLS เป้าหมาย ≤ 0.1
- INP เป้าหมาย ≤ 200ms เมื่อมี field data

## 16. Deployment

- Git repository เชื่อมกับ Vercel
- Pull request/branch ใช้ Preview Deployment
- `main` deploy production
- Custom domain
- HTTPS
- Environment variables แยก preview/production
- Preview deployment ต้องไม่ถูก index
- Production sitemap ส่งเข้า Google Search Console
- ทดสอบ Rich Results และ URL Inspection หลัง deploy

Environment variables ที่คาดว่าจะใช้:

```text
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_PHONE=
NEXT_PUBLIC_LINE_URL=
BOOKING_NOTIFICATION_EMAIL=
BOOKING_PROVIDER_API_KEY=
```

ห้าม commit secrets ลง repository

## 17. Acceptance Criteria

- เปิดทุกหน้าทั้ง `/th` และ `/en` ได้โดยตรง
- ปิด JavaScript แล้วยังเห็นเนื้อหา ราคา และ navigation หลัก
- Language switcher รักษา path และ query parameters
- Dynamic service slug ที่ไม่รู้จักคืน 404
- Bangkok page แสดงรายการทั้งหมดและค้นหา/กรองได้
- `n/a` ไม่แสดงเป็นราคา 0 บาท
- Booking query parameters เติมค่าเริ่มต้นถูกต้อง
- Booking form มี validation และสถานะ success/failure
- ไม่มี horizontal overflow ที่ 320px
- เมนูใช้ keyboard ได้
- Metadata/canonical/hreflang ถูกต้องทั้งสองภาษา
- Sitemap มี localized URLs
- Preview เป็น noindex และ production indexable
- Build ผ่านบน Vercel
- ไม่มีราคาหรือคำกล่าวอ้างที่ยังไม่ยืนยันถูกแสดงเหมือนเป็นข้อมูลจริง

## 18. Inputs Required Before Production

- ชื่อแบรนด์ภาษาไทยและอังกฤษ
- โลโก้ (ถ้ามี)
- เบอร์โทร
- LINE URL/LINE ID
- อีเมลรับ booking
- เวลาทำการ
- ที่อยู่หรือพื้นที่ให้บริการ
- รุ่นรถ ปี จำนวนที่นั่ง และจำนวนสัมภาระ
- รูปรถจริง
- รูปทีม mongkonridemate
- ประสบการณ์และข้อมูลแนะนำตัว
- รีวิวลูกค้าจริง
- ราคารถตู้ที่ยืนยันแล้ว
- ความหมายของ `*` ในตารางราคา
- เงื่อนไขค่าใช้จ่ายทั้งหมด
- Privacy notice
- Domain name

## 19. Implementation Order After Approval

1. Scaffold Next.js + TypeScript + Tailwind
2. ตั้งค่า `[locale]` และ translation dictionaries
3. สร้าง shared layout, header, footer และ mobile actions
4. สร้าง typed service/route/pricing data
5. สร้าง Home slice และ visual system
6. สร้าง services index และ dynamic service routes
7. สร้าง routes index และ Bangkok pricing page
8. สร้าง contact และ booking
9. เพิ่ม SEO metadata, structured data, sitemap และ robots
10. เพิ่ม favicon และ assets จริง
11. ทดสอบ responsive, accessibility และ build
12. Deploy preview บน Vercel
13. ตรวจเนื้อหาและราคา
14. เชื่อมโดเมนและ deploy production

## 20. Out of Scope for Initial Release

- ระบบชำระเงินออนไลน์
- ระบบยืนยันรถว่างแบบ real-time
- บัญชีผู้ใช้
- Admin dashboard
- CMS
- หน้า SEO แยกสำหรับแต่ละ destination
- Google Maps route calculation แบบสด
- ระบบติดตามรถ
- รีวิวที่ผู้ใช้เพิ่มเอง

รายการเหล่านี้เพิ่มภายหลังได้โดยไม่ต้องเปลี่ยน URL หลักของเว็บ
