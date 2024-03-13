import { NewAgent } from './NewAgent';

export class ManageChannel {
	agents: NewAgent[];

	static CreateInstance(_agents: NewAgent[]): ManageChannel {
		const instance = new ManageChannel();
		instance.agents = _agents;
		return instance;
	}
}
