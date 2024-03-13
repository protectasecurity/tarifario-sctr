import { Class } from './class.model';
import { IModel } from './model.model';
import { SeatConfiguration } from './seat-configuration.model';

export class ClassGroup {
	clazz: Class;
	id: string;
	models: IModel[];
	seatConfiguration: SeatConfiguration;
}
