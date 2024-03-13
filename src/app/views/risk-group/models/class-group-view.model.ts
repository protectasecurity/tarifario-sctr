import { ClassGroup } from '../../../shared/models/class-group.model';

export interface IClassGroupView {
	classGroup: ClassGroup;
	actions: string;
}

export class ClassGroupView implements IClassGroupView {
	actions: string;
	classGroup: ClassGroup;
}
