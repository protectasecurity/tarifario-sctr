import { EAgentType } from "../../manage-channel/models/EAgentType";


export class Parameter {
	id: string;
	type: string;
	description: string;
	equivalenceCode: string;
	operators?: string;
	order?: number;
	value?: number;
	valueMax?: number;
	parameter: number;
	isUsed: boolean;
	isActive: boolean;
	isDeleted: boolean;

	static CreateInstance(_description: string, _equivalence: string, _type: string, order: number, ...arg): Parameter {
		const instance = new Parameter();
		instance.description = _description;
		instance.equivalenceCode = _equivalence;
		instance.type = _type;
		instance.order = order;
		if (arg[0] !== "") {
			instance.operators = arg[0];
			instance.value = arg[1];
		}
		if (arg[2] !== "") {
			instance.valueMax = arg[2];
		}


		return instance;
	}

	static CreateInstanceEdit(id: string, _description: string, _equivalence: string, _type: string, order: number, ...arg): Parameter {
		const instance = new Parameter();
		instance.id = id;
		instance.description = _description;
		instance.equivalenceCode = _equivalence;
		instance.type = _type;
		instance.order = order;
		if (arg[0] !== "") {
			instance.operators = arg[0];
			instance.value = arg[1];
		}
		if (arg[2] !== "") {
			instance.valueMax = arg[2];
		}
		return instance;
	}

}

export enum Type {
	COVERAGE = 'Cobertura',
	COMPANY_SIZE = 'Tamaño de Empresa',
	RISK_LEVEL = 'Nivel de Riesgo'
}


