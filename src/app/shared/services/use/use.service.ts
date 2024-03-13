import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Use } from '../../models/use.model';

@Injectable()
export class UseService {
	private api: string = environment.integrationApiUrl;

	constructor(private httpClient: HttpClient) {}

	buildURL(serviceUrl: string): string {
		const protocol = 'https:'; // + document.location.protocol;
		return `${protocol}//${this.api + serviceUrl}`;
	}

	getUses(): Observable<Use[]> {
		const url = this.buildURL(`/api/integration/uses`);
		return this.httpClient.get<Use[]>(url);
	}

	getById(useId: number): Observable<Use> {
		return name; // this.useProvider.getById(useId);
	}
}
