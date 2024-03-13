import { Brand } from './brand.model';

export interface IModel {
	id: string;
	brand: Brand;
	description: string;
	descriptionBrand: string;
}

export class Model implements IModel {
	brand: Brand;
	description: string;
	descriptionBrand: string;
	id: string;

	/* 	constructor(data: any) {
		this.id = data.id;
		this.description = data.description;
		this.brand = data.brand;
	}

	static mapFromResponse(brand: any, data: any) {
		const newData = <any>{};
		newData.idTarifa = data.id;
		newData.type = data.type;

		return new Model(null);
	} */
}
