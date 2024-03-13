import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPersonType, PersonType } from '../models/person-type.model';
import { PersonTypeProvider } from '../services/person-type/person-type.provider';

@Injectable()
export class PersonTypeInMemoryProvider implements PersonTypeProvider {
	private personTypes: PersonType[] = [
		{ id: 1, description: 'PERSONA NATURAL' },
		{ id: 2, description: 'PERSONA JURIDICA (RUC 20)' },
		{ id: 0, description: 'NINGUNA' }
	];

	getById(personTypeId: number): Observable<IPersonType> {
		return new Observable(observer => {
			const val = this.personTypes.filter(value => value.id === personTypeId)[0];
			observer.next(val);
			observer.complete();
		});
	}

	list(): Observable<IPersonType[]> {
		return new Observable(observer => {
			observer.next(this.personTypes);
			observer.complete();
		});
	}
}
