import { Class } from '../../../shared/models/class.model';
import { Use } from '../../../shared/models/use.model';
import { ChannelAgent } from './ChannelAgent';

export class Restriction {
	id: string;
	channel: ChannelAgent;
	use: Use;
	clazz: Class;
	initialDate: Date;
	endDate: Date;
	status: string;

	static CreateInstance(_use: Use, _class: Class,
		_initialDate: Date, _endDate: Date,
		_status: string, _channel: ChannelAgent): Restriction {
		const instance = new Restriction();
		instance.use = _use;
		instance.clazz = _class;
		instance.initialDate = _initialDate;
		instance.endDate = _endDate;
		instance.status = _status;
		instance.channel = _channel;
		return instance;
	}
}