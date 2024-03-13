export class Ubigeo {
	id: string;
	description: string;
	isUsed: boolean;
	type: string;
	parent: string;

	constructor(data: any) {
		if (data) {
			this.id = data.id;
			this.description = data.description;
			this.isUsed = data.isUsed;
			this.type = data.type;
			this.parent = data.parent;
		}
	}

	static mapFromResponse(data: any): Ubigeo {
		return new Ubigeo(data);
	}

}
