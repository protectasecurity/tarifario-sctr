import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PersonTypeInMemoryProvider } from '../../inmemory-db/person-type-in-memory.provider';
import { IPersonType } from '../../models/person-type.model';
import { PersonTypeProvider } from './person-type.provider';
@Injectable()
export class PersonTypeService {
	private api: string = environment.integrationApiUrl;

	constructor(@Inject(PersonTypeInMemoryProvider) private personTypeProvider: PersonTypeProvider, private httpClient: HttpClient) {}

	buildURL(serviceUrl: string): string {
		const protocol = 'https:'; // + document.location.protocol;
		return `${protocol}//${this.api + serviceUrl}`;
	}

	list(): Observable<IPersonType[]> {
		const url = this.buildURL(`/api/integration/persontypes`);
		return this.httpClient.get<IPersonType[]>(url);
	}

	getById(personTypeId: number): Observable<IPersonType> {
		return this.personTypeProvider.getById(personTypeId);
	}
}
