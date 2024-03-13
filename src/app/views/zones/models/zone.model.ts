import { Ubigeo } from './ubigeo.model';

export class Zone {
	id: string;
	description: string;
	active: boolean;
	used: boolean;
	locations: Ubigeo[];
	indice: number;

	static CreateInstance(data: any) {
		const instance = new Zone();
		instance.id = data.id;
		instance.description = data.description; //  data.description;
		instance.active = data.isActive;
		instance.locations = data.locations
			.map(ubi => {
				return {
					id: ubi.id,
					description: ubi.description,
					type: ubi.type,
					isUsed: true
				};
			});
		instance.indice = data.order === undefined ? 0 : data.order;
		instance.used = data.isUsed;
		return instance;
	}

	static mapFromResponse(data: any): Zone {
		return this.CreateInstance(data);
	}
}
