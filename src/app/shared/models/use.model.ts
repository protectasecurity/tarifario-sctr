export class Use {
	description: string;
	id: string;
	order?: number;
	status?: boolean;

	static CreateModel(main: Use) {
		const instance = new Use();
		instance.description = main.description;
		instance.id = main.id + '';
		return instance;
	}
}
