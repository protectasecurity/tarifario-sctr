import { EAgentType } from './EAgentType';

export class NewAgent {
	id: string;
	description: string;
	type: EAgentType;
	typeCore: number;
	coreType: number;

	static CreateInstance(_id: string, _description: string, _type: EAgentType, _typeCore: number): NewAgent {
		const instance = new NewAgent();
		instance.id = _id;
		instance.description = _description;
		instance.type = _type;
		instance.typeCore = _typeCore;
		instance.coreType = _typeCore;
		return instance;
	}
}
