import {vehicleCategories, vehicleGroups, type VehicleCategory} from './vehicle-pricing';

export type VehicleGroupKey = (typeof vehicleGroups)[number]['key'];

export type VehicleModel = {
  category: VehicleCategory;
  group: VehicleGroupKey;
  image: string;
};

const groupImage: Record<VehicleGroupKey, string> = {
  van: '/van-8.jpg',
  passengerCar: '/sedan.jpg'
};

const categoryImage: Record<VehicleCategory, string> = {
  commuter8: '/van-8.jpg',
  commuter10: '/van-9.jpg',
  newCommuter8: '/van-8.jpg',
  newCommuter10: '/van-9.jpg',
  suv: '/suv.jpg',
  sedan: '/sedan.jpg'
};

const categoryGroup = (category: VehicleCategory): VehicleGroupKey => {
  const group = vehicleGroups.find((item) => (item.categories as readonly string[]).includes(category));
  return group ? group.key : 'van';
};

export const vehicleModels: VehicleModel[] = vehicleCategories.map((category) => ({
  category,
  group: categoryGroup(category),
  image: categoryImage[category] ?? groupImage[categoryGroup(category)]
}));

export const vehicleModelsByGroup: Record<VehicleGroupKey, VehicleModel[]> = {
  van: vehicleModels.filter((model) => model.group === 'van'),
  passengerCar: vehicleModels.filter((model) => model.group === 'passengerCar')
};

// Message keys in the `Vehicles` namespace so every vehicle card
// (home, vehicles page, services page) shows the same spec rows.
export const vehicleSeatsKey: Record<VehicleCategory, string> = {
  commuter8: 'seats8',
  commuter10: 'seats9To10',
  newCommuter8: 'seats8',
  newCommuter10: 'seats9To10',
  suv: 'seats7',
  sedan: 'seats5'
};

export const vehicleLuggageKey: Record<VehicleCategory, string> = {
  commuter8: 'luggageCommuter8',
  commuter10: 'luggageCommuter10',
  newCommuter8: 'luggageNewCommuter8',
  newCommuter10: 'luggageNewCommuter10',
  suv: 'luggageSuv',
  sedan: 'luggageSedan'
};

export const vehicleSeatFeatureKey: Record<VehicleCategory, string> = {
  commuter8: 'seatCommuter8',
  commuter10: 'seatCommuter10',
  newCommuter8: 'seatNewCommuter8',
  newCommuter10: 'seatNewCommuter10',
  suv: 'seatSuv',
  sedan: 'seatSedan'
};

export const vehicleUseKey: Record<VehicleCategory, string> = {
  commuter8: 'useCommuter8',
  commuter10: 'useCommuter10',
  newCommuter8: 'useNewCommuter8',
  newCommuter10: 'useNewCommuter10',
  suv: 'useSuv',
  sedan: 'useSedan'
};
