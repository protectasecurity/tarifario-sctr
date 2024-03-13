import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Brand } from '../../models/brand.model';
import { environment } from './../../../../environments/environment';
import { BranchProvider } from './branch.provider';

@Injectable()
export class BrandService {
	private api: string = environment.integrationApiUrl;

	constructor(private httpClient: HttpClient) {}

	buildURL(serviceUrl: string): string {
		const protocol = 'https:'; // + document.location.protocol;
		return `${protocol}//${this.api + serviceUrl}`;
	}

	getBrandsByClass(clazzId: string): Observable<Brand[]> {
		const url = this.buildURL(`/api/integration/classes/${clazzId}/brands`);
		return this.httpClient.get<Brand[]>(url);
	}

	/* 	getById(clazzId: number, branchId: number): Observable<IBranch> {
		return this.branchProvider.getById(clazzId, branchId);
	} */
}
