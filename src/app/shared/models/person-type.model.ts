export interface IPersonType {
	id: number;
	description: string;
}

export class PersonType implements IPersonType {
	description: string;
	id: number;
}
export enum PersonTypeEnum {
	NATURAL = 'NATURAL',
	JURIDIC = 'JURIDIC',
	ALL = 'ALL'
}
