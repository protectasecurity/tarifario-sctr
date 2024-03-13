import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { RiskGroupInMemoryProvider } from '../../inmemory-db/risk-group-in-memory.provider';
import { RiskGroup } from '../../models/risk-group.model';
import { RiskGroupProvider } from './risk-group.provider';

@Injectable()
export class RiskGroupService {
	private api: string = environment.soatBaseApiUrl;

	constructor(private http: HttpClient) {}

	buildURL(serviceUrl: string): string {
		const protocol = 'https:'; // + document.location.protocol;
		return `${protocol}//${this.api + serviceUrl}`;
	}
	list(): Observable<RiskGroup[]> {
		const url = this.buildURL(`/api/risk/groups`);
		return this.http.get<RiskGroup[]>(url);
	}
	getById(riskGroupId: string): Observable<RiskGroup> {
		const url = this.buildURL(`/api/risk/groups/${riskGroupId}`);
		return this.http.get<RiskGroup>(url);
	}
	create(value: RiskGroup): Observable<any> {
		const url = this.buildURL(`/api/risk/groups`);
		const response = this.http.post(url, value);
		return response.pipe(map((data: Response) => data));
	}

	update(value: RiskGroup): Observable<any> {
		const url = this.buildURL(`/api/risk/groups/${value.id}`);
		const response = this.http.patch(url, value);
		return response.pipe(map((data: Response) => data));
	}

	updateorder(value: RiskGroup): Observable<any> {
		if (value !== undefined) {
			const json = {
				order: value.order
			};
			const url = this.buildURL(`/api/risk/groups/${value.id}`);
			return this.http.patch(url, json).pipe(map((data: any) => data));
		} else {
			return new Observable(observer => {
				observer.complete();
			});
		}
	}

	delete(groupId: string): Observable<any> {
		const url = this.buildURL(`/api/risk/groups/${groupId}`);
		const response = this.http.delete(url);
		return response.pipe(map((data: Response) => data));
	}
}
