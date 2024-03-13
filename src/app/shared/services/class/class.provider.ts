import { Observable } from 'rxjs';
import { Class } from '../../models/class.model';

export interface ClassProvider {
	list(): Observable<Class[]>;
	getById(classId: string): Observable<Class>;
}
