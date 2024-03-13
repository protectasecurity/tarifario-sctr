

export interface IVariations {
	branchCode: string;
	branchCoreName: string;
	value: string;
}

export class Actividades {
	id: string;
	groupId: number;
	group: string;
	isActive: boolean;
	description: string;
	isSelfManaging: boolean;
	isDelimiter: boolean;
	discount: number;
	factor: number;
	order: number;
	isUsed: boolean;
	variations: IVariations[];

	static CreateInstance(data: any) {

		const instance = new Actividades();
		instance.id = data.id;
		instance.group = data.group;
		instance.description = data.description;
		instance.groupId = data.groupId;
		instance.isActive = Boolean(Number(data.isActive));
		instance.isSelfManaging = Boolean(Number(data.isSelfManaging));
		instance.isDelimiter = Boolean(Number(data.isDelimiter));
		instance.factor = data.factor;
		instance.discount = data.discount;
		instance.variations = data.variations;
		instance.order = data.order;
		return instance;
	}

	static mapFromResponse(data: any): Actividades {
		return this.CreateInstance(data);
	}

}
