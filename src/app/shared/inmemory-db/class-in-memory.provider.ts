import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Class } from '../models/class.model';
import { ClassProvider } from '../services/class/class.provider';

@Injectable()
export class ClassInMemoryProvider implements ClassProvider {
	private classes: Class[] = [
		{ id: '1', description: 'AUTOMÓVIL' },
		{ id: '27', description: 'CAMIÓN - BARANDA' },
		{ id: '33', description: 'CAMIÓN - CISTERNA' },
		{ id: '44', description: 'CAMIÓN - COMPACTADOR' },
		{ id: '26', description: 'CAMIÓN - FURGÓN' },
		{ id: '24', description: 'CAMIÓN - REMOLCADOR' },
		{ id: '41', description: 'CAMIÓN - VOLQUETE' },
		{ id: '14', description: 'CAMIONETA PANEL' },
		{ id: '16', description: 'CAMIONETA PICK UP' },
		{ id: '9', description: 'CAMIONETA RURAL' },
		{ id: '8', description: 'STATION WAGON' }
	];

	getById(classId: string): Observable<Class> {
		return new Observable(observer => {
			const val = this.classes.filter(value => value.id === classId)[0];
			observer.next(val);
			observer.complete();
		});
	}

	list(): Observable<Class[]> {
		return new Observable(observer => {
			observer.next(this.classes);
			observer.complete();
		});
	}
}
