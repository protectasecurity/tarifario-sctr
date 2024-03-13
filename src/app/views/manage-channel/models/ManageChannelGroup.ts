import { ManageChannel } from './ManageChannel';

export class ManageChannelGroup {
	id: string;
	description: string;
	isActive: boolean;
	channels: ManageChannel[];

	static CreateInstance(_description: string, _channels: ManageChannel[], _id: string = ''): ManageChannelGroup {
		const instance = new ManageChannelGroup();
		instance.description = _description;
		instance.channels = _channels;
		instance.id = _id;
		return instance;
	}
}
