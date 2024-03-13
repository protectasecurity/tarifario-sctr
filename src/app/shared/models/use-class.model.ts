import { Class } from "./class.model";
import { Use } from "./use.model";

export class UseClass {
	id: string;
	use: Use;
	clazz: Class;
	status: any;

	static CreateInstance(_use: Use, _class: Class): UseClass {
		const instance = new UseClass();
		instance.use = _use;
		instance.clazz = _class;
		instance.status = "ACTIVE";
		return instance;
	}
}
