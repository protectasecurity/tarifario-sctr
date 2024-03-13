import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Model } from '../../models/model.model';
import { environment } from './../../../../environments/environment';

@Injectable()
export class ModelService {
	private api: string = environment.integrationApiUrl;

	constructor(private httpClient: HttpClient) {}

	buildURL(serviceUrl: string): string {
		const protocol = 'https:'; // + document.location.protocol;
		return `${protocol}//${this.api + serviceUrl}`;
	}

	getModelsByBrandsByClass(clazzId: string, brandId: string): Observable<Model[]> {
		const url = this.buildURL(`/api/integration/classes/${clazzId}/brands/${brandId}/models`);
		return this.httpClient.get<Model[]>(url);
		// return this.httpClient.get(url).pipe(map((data: any) => data.map(item => Model.mapFromResponse(brandId, item))));
	}

	/* 	getById(clazzId: number, branchId: number): Observable<IBranch> {
		return this.branchProvider.getById(clazzId, branchId);
	} */
}
