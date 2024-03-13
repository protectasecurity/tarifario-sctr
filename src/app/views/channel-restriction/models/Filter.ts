export class Filter {
	description: string;

	static CreateInstance(_description: string): Filter {
		const instance = new Filter();
		instance.description = _description;
		return instance;
	}

}