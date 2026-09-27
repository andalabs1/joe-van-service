export const vanCategories = [
  'vanStandard',
  'vanExecutive',
  'electricMpv',
  'vanPremium',
  'vanLuxury'
] as const;

export type VanCategory = (typeof vanCategories)[number];

export type VanPrices = Record<VanCategory, number | null>;

export const hourlyRates: Array<{
  hours: number;
  maxKm: number;
  prices: VanPrices;
}> = [
  {hours: 3, maxKm: 200, prices: {vanStandard: 1950, vanExecutive: 2400, electricMpv: 4500, vanPremium: 7500, vanLuxury: 10000}},
  {hours: 4, maxKm: 250, prices: {vanStandard: 2600, vanExecutive: 3200, electricMpv: 6000, vanPremium: 7500, vanLuxury: 10000}},
  {hours: 5, maxKm: 250, prices: {vanStandard: 3250, vanExecutive: 4000, electricMpv: 7500, vanPremium: 9400, vanLuxury: 12500}},
  {hours: 6, maxKm: 300, prices: {vanStandard: 3850, vanExecutive: 4750, electricMpv: 8900, vanPremium: 11000, vanLuxury: 15000}},
  {hours: 7, maxKm: 300, prices: {vanStandard: 4500, vanExecutive: 5550, electricMpv: 10500, vanPremium: 13000, vanLuxury: 17500}},
  {hours: 8, maxKm: 350, prices: {vanStandard: 5200, vanExecutive: 6400, electricMpv: 12000, vanPremium: 15000, vanLuxury: 20000}},
  {hours: 9, maxKm: 350, prices: {vanStandard: 5850, vanExecutive: 7200, electricMpv: 13500, vanPremium: 17000, vanLuxury: 22500}},
  {hours: 10, maxKm: 400, prices: {vanStandard: 6500, vanExecutive: 8000, electricMpv: 15000, vanPremium: 19000, vanLuxury: 25000}}
];

export const multiDayRates: Array<{days: number; prices: VanPrices}> = [
  {days: 1, prices: {vanStandard: 6500, vanExecutive: 8000, electricMpv: 15000, vanPremium: 19000, vanLuxury: 25000}},
  {days: 2, prices: {vanStandard: 6400, vanExecutive: 7900, electricMpv: 15000, vanPremium: 18500, vanLuxury: 24500}},
  {days: 3, prices: {vanStandard: 6350, vanExecutive: 7800, electricMpv: 14500, vanPremium: 18500, vanLuxury: 24500}},
  {days: 4, prices: {vanStandard: 6250, vanExecutive: 7700, electricMpv: 14500, vanPremium: 18000, vanLuxury: 24000}},
  {days: 5, prices: {vanStandard: 6150, vanExecutive: 7550, electricMpv: 14000, vanPremium: 17500, vanLuxury: 23500}},
  {days: 6, prices: {vanStandard: 6100, vanExecutive: 7500, electricMpv: 14000, vanPremium: 17500, vanLuxury: 23500}},
  {days: 7, prices: {vanStandard: 6000, vanExecutive: 7400, electricMpv: 14000, vanPremium: 17500, vanLuxury: 23000}}
];

export function formatPrice(value: number | null, locale: 'th' | 'en') {
  if (value === null) return null;
  return new Intl.NumberFormat(locale === 'th' ? 'th-TH' : 'en-US', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0
  }).format(value);
}
