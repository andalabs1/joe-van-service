import {vehicleCategories, vehicleGroups, type VehicleCategory} from './vehicle-pricing';

export type VehicleGroupKey = (typeof vehicleGroups)[number]['key'];

export type VehicleModel = {
  category: VehicleCategory;
  group: VehicleGroupKey;
  image: string;
};

const groupImage: Record<VehicleGroupKey, string> = {
  carSuv: '/model-car-suv.png',
  limousine: '/model-limousine.png',
  mpvVan: '/model-mpv-van.png',
  busCoach: '/model-bus-coach.png'
};

const categoryGroup = (category: VehicleCategory): VehicleGroupKey => {
  const group = vehicleGroups.find((item) => (item.categories as readonly string[]).includes(category));
  return group ? group.key : 'mpvVan';
};

export const vehicleModels: VehicleModel[] = vehicleCategories.map((category) => ({
  category,
  group: categoryGroup(category),
  image: groupImage[categoryGroup(category)]
}));

export const vehicleModelsByGroup: Record<VehicleGroupKey, VehicleModel[]> = {
  carSuv: vehicleModels.filter((model) => model.group === 'carSuv'),
  limousine: vehicleModels.filter((model) => model.group === 'limousine'),
  mpvVan: vehicleModels.filter((model) => model.group === 'mpvVan'),
  busCoach: vehicleModels.filter((model) => model.group === 'busCoach')
};
