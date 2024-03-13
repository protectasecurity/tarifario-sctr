import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { MainProductServices } from './../../../shared/services/main-product.service';

import { ManageChannelGroup } from '../../manage-channel/models/ManageChannelGroup';
import { Parameter } from '../models/parameter.model';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ParametersService {
	private api: string = environment.sctrBaseApiUrl;

	constructor(private httpclient: HttpClient, private typeService: MainProductServices) {
		if (this.typeService.getMainProduct() === 'SCTR') {
			this.api = environment.sctrBaseApiUrl;
		} else {
			this.api = environment.soatBaseApiUrl;
		}
	}

	buildURL(serviceUrl: string): string {
		const protocol = 'https:'; // + document.location.protocol;
		return `${protocol}//${this.api + serviceUrl}`;
	}

	list(): Observable<Parameter[]> {
		const url = this.buildURL(`/api/parameters`);
		return this.httpclient.get<Parameter[]>(url);
	}
	delete(paramId: string): Observable<any> {
		const url = this.buildURL(`/api/parameters/${paramId}`);
		const response = this.httpclient.delete(url);
		return response.pipe(map((data: Response) => data));
	}
	create(param: Parameter[]): Observable<any> {
		const url = this.buildURL(`/api/parameters`);
		const response = this.httpclient.post(url, param);
		return response.pipe(map((data: Response) => data));
	}
	update(param: Parameter): Observable<any> {
		const url = this.buildURL(`/api/parameters/${param.id}`);
		const response = this.httpclient.patch(url, param);
		return response.pipe(map((data: Response) => data));
	}
}
