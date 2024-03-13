import { ClassGroup } from './class-group.model';
import { SubGroups } from './class.model';
import { PersonType } from './person-type.model';
import { Use } from './use.model';
import { VehicleGroup } from './brand.model';

export class RiskGroup {
	id: string;
	isBase: boolean;
	order: number;
	indice: number;
	description: string;
	vehicleUse: Use;
	personType: string;
	subGroups: SubGroups[];
	isActive: boolean;
	isUsed: boolean;


	static CreateInstance(_order: number, _description: string, _vehicleUse: Use, _personType: string, _subGroups: SubGroups[]) {
		const instance = new RiskGroup();
		instance.order = _order;
		instance.indice = _order;
		instance.description = _description;
		instance.vehicleUse = _vehicleUse;
		instance.personType = _personType;
		instance.subGroups = _subGroups;
		return instance;
	}

	static Create(riskGroup: RiskGroup) {
		const instance = new RiskGroup();
		instance.id = riskGroup.id;
		instance.order = riskGroup.order;
		instance.indice = riskGroup.order;
		instance.description = riskGroup.description;
		instance.vehicleUse = riskGroup.vehicleUse;
		instance.personType = riskGroup.personType;
		instance.subGroups = riskGroup.subGroups;
		return instance;
	}


	static CreateModel(main: RiskGroup) {
		const instance = new RiskGroup();
		instance.vehicleUse = Use.CreateModel(main.vehicleUse);
		instance.personType = main.personType;
		instance.subGroups = main.subGroups;
		return instance;
	}

	static getString(main: RiskGroup) {
		return ' PERSON_TYPE: ' + main.personType + ' VEHICULE_USE: ' + main.vehicleUse.id +
			' , SUB_GROUPS: ' + main.subGroups.map(item => SubGroups.getString(item)).join(',');
	}

	static isCloneDetail(main: RiskGroup, other: RiskGroup, isEditing: boolean, isCloning: boolean) {
		if (main.id === other.id) {
			return false;
		} else if (main.vehicleUse.id.toString() === other.vehicleUse.id &&
			main.subGroups && other.subGroups && main.subGroups.length === other.subGroups.length
		) {
			other.subGroups.sort((x, y) => parseInt(x.vehicleClass.id, 10) - parseInt(y.vehicleClass.id, 10));
			let otherModel = RiskGroup.Create(other);
			if (!isEditing && !isCloning) {
				otherModel = RiskGroup.CreateModel(other);
			}
			otherModel.subGroups.map(sub => sub.recordAdded = true);
			return RiskGroup.getString(main) === RiskGroup.getString(otherModel);
		}
	}
}

