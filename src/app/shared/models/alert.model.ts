export interface IAlert {
	title: string;
	message: string;
	type: string;
}

export class Alert implements IAlert {
	message: string;
	title: string;
	type: string;
}
