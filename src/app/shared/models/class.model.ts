import { VehicleGroup } from './brand.model';
import { SeatConfigurationOperator } from './seat-configuration.model';

export class Class {
	description: string;
	id: string;
}
export class VehicleClass extends Class {
	static CreateInstance(_id: string, _description: string) {
		const instance = new VehicleClass();
		instance.id = _id;
		instance.description = _description;
		return instance;
	}
}
export enum SeatType {
	OPEN = 'OPEN',
	CLOSED = 'CLOSE'
}
export class BaseLimit {
	value: number;
	type: SeatType;
}

export class MinLimit extends BaseLimit {
	static CreateInstance(_value: number, _type: SeatType) {
		const instance = new MinLimit();
		instance.type = _type;
		instance.value = _value;
		return instance;
	}

	static getString(minLimit: MinLimit) {
		const type = (minLimit && minLimit.type) ? minLimit.type : '';
		const value = (minLimit && minLimit.value) ? minLimit.value : '';
		return `{ type: ${type}, value: ${value} }`;
	}
}
export class MaxLimit extends BaseLimit {
	static CreateInstance(_value: number, _type: SeatType) {
		const instance = new MaxLimit();
		instance.type = _type;
		instance.value = _value;
		return instance;
	}

	static getString(maxLimit: MaxLimit) {
		const type = (maxLimit && maxLimit.type) ? maxLimit.type : '';
		const value = (maxLimit && maxLimit.value) ? maxLimit.value : '';
		return `{ type: ${type}, value: ${value} }`;
	}
}
export class SeatsRestriction {
	minLimit: MinLimit;
	maxLimit: MaxLimit;
	static CreateInstanceWithMaximit(_maxLimit: MaxLimit) {
		const instance = new SeatsRestriction();
		instance.maxLimit = _maxLimit;
		return instance;
	}
	static CreateInstanceWithMinLimit(_minLimit: MinLimit) {
		const instance = new SeatsRestriction();
		instance.minLimit = _minLimit;
		return instance;
	}
	static CreateInstance(_minLimit: MinLimit, _maxLimit: MaxLimit) {
		const instance = new SeatsRestriction();
		instance.maxLimit = _maxLimit;
		instance.minLimit = _minLimit;
		return instance;
	}
	static getString(seatsRestriction: SeatsRestriction) {
		if (seatsRestriction) {
			return `{ maxLimit: ${MaxLimit.getString(seatsRestriction.maxLimit)} ,
				  minLimit: ${MinLimit.getString(seatsRestriction.minLimit)}`;
		}
		return 'null';
	}
}
export class SubGroups {
	vehicleClass: VehicleClass;
	vehicleGroup: VehicleGroup;
	seatsRestriction: SeatsRestriction;
	isExclusionVehicleGroup: boolean;
	recordAdded: boolean;

	static CreateInstance(
		_vehicleClass: VehicleClass,
		_vehicleGroup: VehicleGroup,
		_seatsRestriction: SeatsRestriction,
		_isExclusionVehicleGroup: boolean,
		_recordAdded: boolean
	) {
		const newInstance = new SubGroups();
		newInstance.vehicleClass = _vehicleClass;
		newInstance.vehicleGroup = _vehicleGroup;
		newInstance.seatsRestriction = _seatsRestriction;
		newInstance.isExclusionVehicleGroup = _isExclusionVehicleGroup;
		newInstance.recordAdded = _recordAdded;
		return newInstance;
	}

	static getString(subGroups: SubGroups): string {
		if (subGroups) {
			return `vehicleClass: ${subGroups.vehicleClass.id} - ListVehicleGroup: ${VehicleGroup.getString(subGroups.vehicleGroup)} -
				seatsRestriction: ${SeatsRestriction.getString(subGroups.seatsRestriction)} - isExclusionVehicleGroup: ${subGroups.isExclusionVehicleGroup} -
				recordAdded: ${subGroups.recordAdded}`;
		}
		return 'null';
	}

}
