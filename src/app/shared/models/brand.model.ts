import { Model } from './model.model';

export class Brand {
	description: string;
	id: string;
}
export class Filters {
	brandId: string;
	brandDescription: string;
	segmentedModels: Model[];

	static CreateInstance(id: string, description: string, segmentedModels: Model[]) {
		const filters = new Filters();
		filters.brandId = id.toString();
		filters.brandDescription = description;
		filters.segmentedModels = segmentedModels;
		return filters;
	}
}

export class VehicleGroup {
	filters: Filters[];
	static CreateInstance(filters: Filters[]) {
		const vehicleGroup = new VehicleGroup();
		vehicleGroup.filters = filters;
		return vehicleGroup;
	}

	static getString(vehicleGroup: VehicleGroup) {
		let toString = '';
		if (vehicleGroup && vehicleGroup.filters) {
			toString = vehicleGroup.filters.map(item => item.brandId).join(',');
		}
		return `[${toString}]`;
	}
}
