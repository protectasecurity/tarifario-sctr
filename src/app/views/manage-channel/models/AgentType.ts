export class AgentType {
	id: string;
	description: string;
	static CreateInstance(_id: string, _description: string): AgentType {
		const instance = new AgentType();
		instance.id = _id;
		instance.description = _description;
		return instance;
	}
}
