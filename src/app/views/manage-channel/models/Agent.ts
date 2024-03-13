export class Agent {
	id: string;
	description: string;
	tipo: number;

	constructor(data: any) {
		if (data != null) {
			this.id = data.id;
			this.description = data.description ? data.description.toUpperCase() : null;
		}
	}

	static mapFromResponse(data: any): Agent {
		return new Agent(data);
	}

	static CreateInstance(_id: string, _description: string): Agent {
		const instance = new Agent(null);
		instance.id = _id;
		instance.description = _description;
		return instance;
	}
}
