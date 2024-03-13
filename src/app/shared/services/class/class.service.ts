import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ClassInMemoryProvider } from '../../inmemory-db/class-in-memory.provider';
import { Class } from '../../models/class.model';
import { ClassProvider } from './class.provider';
@Injectable()
export class ClassService {
	private api: string = environment.integrationApiUrl;

	constructor(@Inject(ClassInMemoryProvider) private classProvider: ClassProvider, private httpClient: HttpClient) {}

	buildURL(serviceUrl: string): string {
		const protocol = 'https:'; // + document.location.protocol;
		return `${protocol}//${this.api + serviceUrl}`;
	}

	list(): Observable<Class[]> {
		const url = this.buildURL(`/api/integration/classes`);
		return this.httpClient.get<Class[]>(url);
	}

	getById(clazzId: string): Observable<Class> {
		return this.classProvider.getById(clazzId);
	}
}
