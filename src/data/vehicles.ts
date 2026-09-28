import {vehicleCategories, vehicleGroups, type VehicleCategory} from './vehicle-pricing';

export type VehicleGroupKey = (typeof vehicleGroups)[number]['key'];

export type VehicleModel = {
  category: VehicleCategory;
  group: VehicleGroupKey;
  image: string;
};

const groupImage: Record<VehicleGroupKey, string> = {
  van: '/model-mpv-van.png',
  passengerCar: '/model-car-suv.png'
};

const categoryImage: Record<VehicleCategory, string> = {
  vipVan: '/model-mpv-van1.png',
  shortVan: '/model-mpv-van.png',
  suv: '/model-car-suv.png',
  sedan: '/model-limousine.png'
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
