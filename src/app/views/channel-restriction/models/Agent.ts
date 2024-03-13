export class Agent {
	id: string;
	description: string;
	type: number;

	static CreateInstance(_id: string, _description: string, _type: number): Agent {
		const instance = new Agent();
		instance.id = _id;
		instance.description = _description;
		instance.type = _type;
		return instance;
	}
}
