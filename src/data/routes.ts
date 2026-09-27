import type {LocalizedText} from './services';
import type {VanPrices} from './pricing';

export type RouteRegion =
  | 'metropolitan'
  | 'east'
  | 'west'
  | 'north-northeast'
  | 'south';

export type BangkokRoute = {
  id: string;
  destination: LocalizedText;
  region: RouteRegion;
  distanceKm: number;
  featured: boolean;
  prices: VanPrices;
  note?: LocalizedText;
};

const destination = (th: string, en: string): LocalizedText => ({th, en});
const prices = (
  vanStandard: number | null,
  vanExecutive: number | null,
  electricMpv: number | null,
  vanPremium: number | null,
  vanLuxury: number | null
): VanPrices => ({vanStandard, vanExecutive, electricMpv, vanPremium, vanLuxury});

export const bangkokRoutes: BangkokRoute[] = [
  {id: 'don-mueang-airport', destination: destination('สนามบินดอนเมือง', 'Don Mueang Airport'), region: 'metropolitan', distanceKm: 25, featured: true, prices: prices(1400, 1700, 3000, 3500, 10000)},
  {id: 'suvarnabhumi-airport', destination: destination('สนามบินสุวรรณภูมิ', 'Suvarnabhumi Airport'), region: 'metropolitan', distanceKm: 30, featured: true, prices: prices(1400, 1700, 3000, 3500, 10000)},
  {id: 'samut-prakan', destination: destination('สมุทรปราการ', 'Samut Prakan'), region: 'metropolitan', distanceKm: 30, featured: false, prices: prices(1300, 1600, 3000, 3500, 18000)},
  {id: 'nonthaburi', destination: destination('นนทบุรี', 'Nonthaburi'), region: 'metropolitan', distanceKm: 35, featured: false, prices: prices(1500, 1800, 3450, 4050, 5750)},
  {id: 'pathum-thani', destination: destination('ปทุมธานี', 'Pathum Thani'), region: 'metropolitan', distanceKm: 35, featured: false, prices: prices(2000, 2450, 4600, 5400, 7700)},
  {id: 'samut-sakhon', destination: destination('สมุทรสาคร', 'Samut Sakhon'), region: 'metropolitan', distanceKm: 40, featured: false, prices: prices(2100, 2600, 4850, 5650, 8100)},
  {id: 'chachoengsao', destination: destination('ฉะเชิงเทรา', 'Chachoengsao'), region: 'east', distanceKm: 90, featured: false, prices: prices(2500, 3100, 5750, 6750, 9600)},
  {id: 'bang-saen', destination: destination('บางแสน', 'Bang Saen'), region: 'east', distanceKm: 100, featured: true, prices: prices(2400, 2950, 5550, 6450, 9250)},
  {id: 'laem-chabang', destination: destination('แหลมฉบัง', 'Laem Chabang'), region: 'east', distanceKm: 130, featured: false, prices: prices(3500, 4500, 7500, 11500, 16500)},
  {id: 'chon-buri', destination: destination('ชลบุรี', 'Chon Buri'), region: 'east', distanceKm: 150, featured: false, prices: prices(2500, 3100, 5750, 6750, 9600)},
  {id: 'pattaya', destination: destination('พัทยา', 'Pattaya'), region: 'east', distanceKm: 150, featured: true, prices: prices(2850, 3800, 6500, 10000, 18000)},
  {id: 'sattahip', destination: destination('สัตหีบ', 'Sattahip'), region: 'east', distanceKm: 200, featured: false, prices: prices(2850, 3800, 6500, 10000, 18000)},
  {id: 'rayong', destination: destination('ระยอง', 'Rayong'), region: 'east', distanceKm: 220, featured: false, prices: prices(3500, 4000, null, 15000, 28000)},
  {id: 'u-tapao-airport', destination: destination('สนามบินอู่ตะเภา', 'U-Tapao Airport'), region: 'east', distanceKm: 220, featured: false, prices: prices(3300, 4000, null, 15000, 23500)},
  {id: 'chanthaburi', destination: destination('จันทบุรี', 'Chanthaburi'), region: 'east', distanceKm: 275, featured: false, prices: prices(4900, 6000, 11000, 13000, 18500)},
  {id: 'aranyaprathet', destination: destination('อรัญประเทศ', 'Aranyaprathet'), region: 'east', distanceKm: 300, featured: false, prices: prices(3800, 4500, null, 13000, 33000)},
  {id: 'sa-kaeo', destination: destination('สระแก้ว', 'Sa Kaeo'), region: 'east', distanceKm: 300, featured: false, prices: prices(4200, 5200, null, null, null)},
  {id: 'trat', destination: destination('ตราด', 'Trat'), region: 'east', distanceKm: 400, featured: false, prices: prices(5500, 6750, null, 22000, 30000)},
  {id: 'hat-lek', destination: destination('หาดเล็ก', 'Hat Lek'), region: 'east', distanceKm: 420, featured: false, prices: prices(6000, 7500, null, null, null)},
  {id: 'koh-chang', destination: destination('เกาะช้าง', 'Koh Chang'), region: 'east', distanceKm: 450, featured: false, prices: prices(8250, 10000, 19000, 24000, 32000)},
  {id: 'samut-songkhram', destination: destination('สมุทรสงคราม', 'Samut Songkhram'), region: 'south', distanceKm: 80, featured: false, prices: prices(2400, 2950, 5500, 6450, 9250)},
  {id: 'cha-am', destination: destination('ชะอำ', 'Cha-am'), region: 'south', distanceKm: 200, featured: false, prices: prices(3500, 4000, null, 13000, 25000)},
  {id: 'hua-hin', destination: destination('หัวหิน', 'Hua Hin'), region: 'south', distanceKm: 220, featured: true, prices: prices(3800, 4500, 8500, 13000, 33000)},
  {id: 'pranburi', destination: destination('ปราณบุรี', 'Pranburi'), region: 'south', distanceKm: 245, featured: false, prices: prices(4100, 5000, 9400, 15000, 21500)},
  {id: 'sam-roi-yot', destination: destination('สามร้อยยอด', 'Sam Roi Yot'), region: 'south', distanceKm: 265, featured: false, prices: prices(4200, 5300, null, null, null)},
  {id: 'kui-buri', destination: destination('กุยบุรี', 'Kui Buri'), region: 'south', distanceKm: 300, featured: false, prices: prices(4200, 5300, null, null, null)},
  {id: 'bang-saphan', destination: destination('บางสะพาน', 'Bang Saphan'), region: 'south', distanceKm: 380, featured: false, prices: prices(5500, 6500, 12500, 26000, 35000)},
  {id: 'chumphon', destination: destination('ชุมพร', 'Chumphon'), region: 'south', distanceKm: 500, featured: false, prices: prices(7200, 8800, 16500, 25000, 35000)},
  {id: 'surat-thani', destination: destination('สุราษฎร์ธานี', 'Surat Thani'), region: 'south', distanceKm: 644, featured: false, prices: prices(14500, 18000, 33500, 38500, 55500)},
  {id: 'don-sak', destination: destination('ดอนสัก', 'Don Sak'), region: 'south', distanceKm: 710, featured: false, prices: prices(14500, 18000, 33500, 38500, 55500)},
  {id: 'koh-samui', destination: destination('เกาะสมุย', 'Koh Samui'), region: 'south', distanceKm: 780, featured: false, prices: prices(null, null, null, 35000, null)},
  {id: 'phuket', destination: destination('ภูเก็ต', 'Phuket'), region: 'south', distanceKm: 867, featured: false, prices: prices(14500, 18000, 33500, 38500, 55500)},
  {id: 'krabi', destination: destination('กระบี่', 'Krabi'), region: 'south', distanceKm: 946, featured: false, prices: prices(15500, 19000, 35500, 41500, 59500)},
  {id: 'nakhon-pathom', destination: destination('นครปฐม', 'Nakhon Pathom'), region: 'west', distanceKm: 70, featured: false, prices: prices(2500, 3000, null, 12300, null)},
  {id: 'kanchanaburi', destination: destination('กาญจนบุรี', 'Kanchanaburi'), region: 'west', distanceKm: 130, featured: true, prices: prices(3500, 4000, 8000, 11500, 20000)},
  {id: 'ratchaburi', destination: destination('ราชบุรี', 'Ratchaburi'), region: 'west', distanceKm: 165, featured: false, prices: prices(3100, 3800, null, null, null)},
  {id: 'sai-yok', destination: destination('ไทรโยค', 'Sai Yok'), region: 'west', distanceKm: 235, featured: false, prices: prices(3900, 4500, null, null, null)},
  {id: 'sangkhla-buri', destination: destination('สังขละบุรี', 'Sangkhla Buri'), region: 'west', distanceKm: 380, featured: false, prices: prices(6500, 8000, null, null, null)},
  {id: 'ayutthaya', destination: destination('พระนครศรีอยุธยา', 'Ayutthaya'), region: 'north-northeast', distanceKm: 76, featured: true, prices: prices(2500, 3100, 5500, 10000, null)},
  {id: 'saraburi', destination: destination('สระบุรี', 'Saraburi'), region: 'north-northeast', distanceKm: 107, featured: false, prices: prices(2800, 3500, null, null, null)},
  {id: 'khao-yai', destination: destination('เขาใหญ่', 'Khao Yai'), region: 'north-northeast', distanceKm: 180, featured: true, prices: prices(3800, 4400, null, 13000, 33000)},
  {id: 'wang-nam-khiao', destination: destination('วังน้ำเขียว', 'Wang Nam Khiao'), region: 'north-northeast', distanceKm: 250, featured: false, prices: prices(4100, 4800, null, 18000, null)},
  {id: 'nakhon-ratchasima', destination: destination('นครราชสีมา', 'Nakhon Ratchasima'), region: 'north-northeast', distanceKm: 259, featured: false, prices: prices(4000, 5000, 9000, 11500, 28000)},
  {id: 'nakhon-sawan', destination: destination('นครสวรรค์', 'Nakhon Sawan'), region: 'north-northeast', distanceKm: 260, featured: false, prices: prices(4000, 5000, null, 20900, null)},
  {id: 'phetchabun', destination: destination('เพชรบูรณ์', 'Phetchabun'), region: 'north-northeast', distanceKm: 350, featured: false, prices: prices(7000, 8000, null, null, null)},
  {id: 'phitsanulok', destination: destination('พิษณุโลก', 'Phitsanulok'), region: 'north-northeast', distanceKm: 400, featured: false, prices: prices(7000, 8000, null, 17000, 35000)},
  {id: 'mae-sot', destination: destination('แม่สอด', 'Mae Sot'), region: 'north-northeast', distanceKm: 500, featured: false, prices: prices(14500, 18000, 33500, 38500, 55500)},
  {id: 'sukhothai', destination: destination('สุโขทัย', 'Sukhothai'), region: 'north-northeast', distanceKm: 500, featured: false, prices: prices(8000, 10000, null, null, 41500)},
  {id: 'chiang-mai', destination: destination('เชียงใหม่', 'Chiang Mai'), region: 'north-northeast', distanceKm: 695, featured: true, prices: prices(14500, 18000, 33500, 38500, 55500)},
  {id: 'chiang-rai', destination: destination('เชียงราย', 'Chiang Rai'), region: 'north-northeast', distanceKm: 820, featured: false, prices: prices(16500, 20500, null, null, null)}
];

export const featuredRoutes = bangkokRoutes.filter((route) => route.featured);
