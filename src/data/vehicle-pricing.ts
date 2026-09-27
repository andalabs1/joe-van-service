export const vehicleCategories = [
  'carStandard', 'carExecutive', 'carFamily', 'carElectric',
  'limoPremium', 'limoLuxury',
  'vanStandard', 'vanExecutive', 'electricMpv', 'vanPremium', 'vanLuxury',
  'busMinibus', 'busMidSized', 'busGroup'
] as const;

export type VehicleCategory = (typeof vehicleCategories)[number];
export type VehiclePrices = Record<VehicleCategory, number | null>;
export type PriceTuple = readonly [
  number | null, number | null, number | null, number | null,
  number | null, number | null,
  number | null, number | null, number | null, number | null, number | null,
  number | null, number | null, number | null
];

export const vehicleGroups = [
  {key: 'carSuv', categories: vehicleCategories.slice(0, 4)},
  {key: 'limousine', categories: vehicleCategories.slice(4, 6)},
  {key: 'mpvVan', categories: vehicleCategories.slice(6, 11)},
  {key: 'busCoach', categories: vehicleCategories.slice(11, 14)}
] as const;

const toPrices = (values: PriceTuple): VehiclePrices => Object.fromEntries(
  vehicleCategories.map((category, index) => [category, values[index]])
) as VehiclePrices;

const routePriceRows: Record<string, PriceTuple> = {
  'don-mueang-airport': [1150, 1350, 1350, 1350, 3500, 6500, 1400, 1700, 3000, 3500, 10000, 7500, 13500, 15500],
  'suvarnabhumi-airport': [1150, 1350, 1350, 1350, 3500, 6500, 1400, 1700, 3000, 3500, 10000, 7500, 13500, 15500],
  'samut-prakan': [1100, 1300, 1300, 1300, 3500, 5500, 1300, 1600, 3000, 3500, 18000, 6500, 10000, 14000],
  'nonthaburi': [1300, 1500, 1500, 1500, 4050, 7500, 1500, 1800, 3450, 4050, 5750, 6900, 11500, 16000],
  'pathum-thani': [1700, 2000, 2000, 2000, 5400, 10000, 2000, 2450, 4600, 5400, 7700, 9250, 15500, 21500],
  'samut-sakhon': [1800, 2100, 2100, 2100, 5650, 10500, 2100, 2600, 4850, 5650, 8100, 9700, 16000, 22500],
  'chachoengsao': [2200, 2500, 2500, 2500, 6750, 12500, 2500, 3100, 5750, 6750, 9600, 13000, 19000, 27000],
  'bang-saen': [2050, 2400, 2400, 2400, 6450, 12000, 2400, 2950, 5550, 6450, 9250, 13000, 18500, 26000],
  'laem-chabang': [3300, 3500, 3500, 3500, 11500, 15500, 3500, 4500, 7500, 11500, 16500, 18000, 23000, 25000],
  'chon-buri': [2200, 2500, 2500, 2500, 6750, 12500, 2500, 3100, 5750, 6750, 9600, 11500, 19000, 27000],
  'pattaya': [2400, 2850, 2850, 2850, 10000, 12500, 2850, 3800, 6500, 10000, 18000, 13000, 22000, 30000],
  'sattahip': [2400, 2850, 2850, 2850, 10000, 12500, 2850, 3800, 6500, 10000, 18000, 13000, 22000, 30500],
  'rayong': [3200, 3500, 3500, 3500, 15000, 16500, 3500, 4000, null, 15000, 28000, 15000, 25000, 28000],
  'u-tapao-airport': [3000, 3300, 3300, 3300, 15000, 16500, 3300, 4000, null, 15000, 23500, null, 25000, 28000],
  'chanthaburi': [4500, 4900, 4900, 4900, 13000, 24500, 4900, 6000, 11000, 13000, 18500, 13000, 17000, 20500],
  'aranyaprathet': [3500, 3800, 3800, 3800, 13000, 15000, 3800, 4500, null, 13000, 33000, 14000, 23000, 25000],
  'sa-kaeo': [3900, 4200, 4200, 4200, 13000, 16000, 4200, 5200, null, null, null, 14500, 25000, null],
  'trat': [5300, 5500, 5500, 5500, 22000, 24000, 5500, 6750, null, 22000, 30000, 18000, 30000, 36000],
  'hat-lek': [5800, 6000, 6000, 6000, null, null, 6000, 7500, null, null, null, null, null, null],
  'koh-chang': [7000, 8250, 8250, 8250, 24000, 41500, 8250, 10000, 19000, 24000, 32000, null, null, null],
  'samut-songkhram': [2000, 2400, 2400, 2400, 6450, 12000, 2400, 2950, 5500, 6450, 9250, 11000, 18500, 26000],
  'cha-am': [3300, 3500, 3500, 3500, 13000, 15000, 3500, 4000, null, 13000, 25000, 16000, 23000, 25000],
  'hua-hin': [3500, 3800, 3800, 3800, 13000, 15000, 3800, 4500, 8500, 13000, 33000, 16000, 23000, 25000],
  'pranburi': [3800, 4100, 4100, 4100, 15000, 16500, 4100, 5000, 9400, 15000, 21500, 15000, 19500, 23500],
  'sam-roi-yot': [3900, 4200, 4200, 4200, null, null, 4200, 5300, null, null, null, null, null, null],
  'kui-buri': [3900, 4200, 4200, 4200, null, null, 4200, 5300, null, null, null, null, null, null],
  'bang-saphan': [5300, 5500, 5500, 5500, 22000, 24000, 5500, 6500, 12500, 26000, 35000, 25500, 42000, 59000],
  'chumphon': [6500, 7200, 7200, 7200, 25000, null, 7200, 8800, 16500, 25000, 35000, 25000, 40000, 48000],
  'surat-thani': [12500, 14500, 14500, 14500, 38500, 72500, 14500, 18000, 33500, 38500, 55500, 38500, 50500, 60500],
  'don-sak': [12250, 14500, 14500, 14500, 38500, 72500, 14500, 18000, 33500, 38500, 55500, 38500, 50500, 60500],
  'koh-samui': [null, null, null, null, null, null, null, null, null, 35000, null, null, null, null],
  'phuket': [12250, 14500, 14500, 14500, 38500, 72500, 14500, 18000, 33500, 38500, 55500, 38500, 50500, 60500],
  'krabi': [13000, 15500, 15500, 15500, 41500, 77500, 15500, 19000, 35500, 41500, 59500, 41500, 53500, 64500],
  'nakhon-pathom': [2200, 2500, 2500, 2500, 9500, 10900, 2500, 3000, null, 12300, null, null, 16000, null],
  'kanchanaburi': [3200, 3500, 3500, 3500, 11500, 14000, 3500, 4000, 8000, 11500, 20000, 15000, 25000, 28000],
  'ratchaburi': [2800, 3100, 3100, 3100, null, null, 3100, 3800, null, null, null, null, 20000, null],
  'sai-yok': [3600, 3900, 3900, 3900, 10500, 15000, 3900, 4500, null, null, null, null, null, null],
  'sangkhla-buri': [6000, 6500, 6500, 6500, null, null, 6500, 8000, null, null, null, null, null, null],
  'ayutthaya': [2300, 2500, 2500, 2500, 9500, 10900, 2500, 3100, 5500, 10000, null, 10000, 16000, 20000],
  'saraburi': [2500, 2800, 2800, 2800, null, null, 2800, 3500, null, null, null, null, 21500, null],
  'khao-yai': [3500, 3800, 3800, 3800, 10500, 15000, 3800, 4400, null, 13000, 33000, 14000, 23000, 25000],
  'wang-nam-khiao': [3800, 4100, 4100, 4100, null, null, 4100, 4800, null, 18000, null, null, null, null],
  'nakhon-ratchasima': [3800, 4000, 4000, 4000, 11500, 16000, 4000, 5000, 9000, 11500, 28000, null, 25000, null],
  'nakhon-sawan': [3800, 4000, 4000, 4000, 11500, 16000, 4000, 5000, null, 20900, null, null, 25000, null],
  'phetchabun': [null, 7000, 7000, 7000, null, null, 7000, 8000, null, null, null, null, null, null],
  'phitsanulok': [6300, 7000, 7000, 7000, 17000, null, 7000, 8000, null, 17000, 35000, null, 29000, null],
  'mae-sot': [12500, 14500, 14500, 14500, 38500, 72500, 14500, 18000, 33500, 38500, 55500, 38500, 50500, 60500],
  'sukhothai': [7500, 8000, 8000, 8000, null, null, 8000, 10000, null, null, 41500, null, 36000, null],
  'chiang-mai': [12250, 14500, 14500, 14500, 38500, 72500, 14500, 18000, 33500, 38500, 55500, 38500, 50500, 60500],
  'chiang-rai': [14500, 16500, 16500, 16500, null, null, 16500, 20500, null, null, null, null, null, null]
};

export const getRouteVehiclePrices = (routeId: string) => toPrices(routePriceRows[routeId] ?? ([null, null, null, null, null, null, null, null, null, null, null, null, null, null] as PriceTuple));

export const getVehicleStartingPrices = (): VehiclePrices => {
  const starting = Object.fromEntries(vehicleCategories.map((category) => [category, null])) as VehiclePrices;
  const consider = (prices: VehiclePrices) => {
    for (const category of vehicleCategories) {
      const value = prices[category];
      if (value === null) continue;
      const current = starting[category];
      if (current === null || value < current) starting[category] = value;
    }
  };
  for (const row of Object.values(routePriceRows)) consider(toPrices(row));
  for (const rate of hourlyVehicleRates) consider(rate.prices);
  for (const rate of periodVehicleRates) consider(rate.prices);
  return starting;
};

export const hourlyVehicleRates = [
  {hours: 3, maxKm: 200, prices: toPrices([1650, 1950, 1950, 1950, 7500, 13000, 1950, 2400, 4500, 7500, 10000, 9000, 15000, 21000])},
  {hours: 4, maxKm: 250, prices: toPrices([2200, 2600, 2600, 2600, 7500, 13000, 2600, 3200, 6000, 7500, 10000, 12000, 20000, 28000])},
  {hours: 5, maxKm: 250, prices: toPrices([2750, 3250, 3250, 3250, 9400, 16650, 3250, 4000, 7500, 9400, 12500, 15000, 25000, 35000])},
  {hours: 6, maxKm: 300, prices: toPrices([3250, 3850, 3850, 3850, 11000, 19500, 3850, 4750, 8900, 11000, 15000, 18000, 29500, 41500])},
  {hours: 7, maxKm: 300, prices: toPrices([3800, 4500, 4500, 4500, 13000, 22500, 4500, 5550, 10500, 13000, 17500, 21000, 34500, 48500])},
  {hours: 8, maxKm: 350, prices: toPrices([4400, 5200, 5200, 5200, 15000, 26000, 5200, 6400, 12000, 15000, 20000, 24000, 40000, 56000])},
  {hours: 9, maxKm: 350, prices: toPrices([4950, 5850, 5850, 5850, 17000, 29500, 5850, 7200, 13500, 17000, 22500, 27000, 45000, 63000])},
  {hours: 10, maxKm: 400, prices: toPrices([5500, 6500, 6500, 6500, 19000, 32500, 6500, 8000, 15000, 19000, 25000, 30000, 50000, 70000])}
];

export const periodVehicleRates = [
  {days: 1, prices: toPrices([5500, 6500, 6500, 6500, 19000, 32500, 6500, 8000, 15000, 19000, 25000, 30000, 50000, 70000])},
  {days: 2, prices: toPrices([5400, 6400, 6400, 6400, 18500, 32000, 6400, 7900, 15000, 18500, 24500, 29500, 49000, 69000])},
  {days: 3, prices: toPrices([5350, 6350, 6350, 6350, 18500, 32000, 6350, 7800, 14500, 18500, 24500, 29500, 49000, 68500])},
  {days: 4, prices: toPrices([5300, 6250, 6250, 6250, 18000, 31500, 6250, 7700, 14500, 18000, 24000, 29000, 48000, 67500])},
  {days: 5, prices: toPrices([5200, 6150, 6150, 6150, 17500, 31000, 6150, 7550, 14000, 17500, 23500, 28500, 47500, 66000])},
  {days: 6, prices: toPrices([5150, 6100, 6100, 6100, 17500, 30500, 6100, 7500, 14000, 17500, 23500, 28000, 47000, 65500])},
  {days: 7, prices: toPrices([5100, 6000, 6000, 6000, 17500, 30000, 6000, 7400, 14000, 17500, 23000, 27500, 46000, 64500])}
];
