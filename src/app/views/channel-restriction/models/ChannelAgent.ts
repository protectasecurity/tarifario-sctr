export class ChannelAgent {
	id: string;
	description: string;

	static CreateInstance(_id: string, _description: string): ChannelAgent {
		const instance = new ChannelAgent();
		instance.id = _id;
		instance.description = _description;
		return instance;
	}
}
