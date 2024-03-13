import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { map, share } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Fee, IFeeSearch, IPlateSearch } from './models/fee.model';
import { TariffMatrix } from './models/tariffmatrix.model';


@Injectable()
export class FeeService {
	private api: string = environment.soatBaseApiUrl;
	private integrationApiUrl: string = environment.integrationApiUrl;

	constructor(private httpclient: HttpClient) { }

	buildURL(serviceUrl: string): string {
		const protocol = 'https:'; // + document.location.protocol;
		return `${protocol}//${this.api + serviceUrl}`;
	}

	buildURLIntegration(serviceUrl: string): string {
		const protocol = 'https:'; // + document.location.protocol;
		return `${protocol}//${this.integrationApiUrl + serviceUrl}`;
	}

	getFee(id: string, date: string): Observable<Fee> {
		let url = this.buildURL(`/api/tariff/matrices/${id}`);
		if (date !== null) {
			url = this.buildURL(`/api/tariff/matrices/${id}?queryDate=${date}`);
		}
		return this.httpclient.get(url).pipe(
			map(item => Fee.mapFromMatrixResponse(item)),
			share()
		);
	}

	getFeeUpdates(id: string): Observable<string[]> {
		const url = this.buildURL(`/api/tariff/matrices/${id}/updates`);
		return this.httpclient.get(url).pipe(map((data: any) => data));
	}

	createFee(tariffMatrix: TariffMatrix): Observable<any> {
		const url = this.buildURL(`/api/tariff/matrices`);
		return this.httpclient.post(url, tariffMatrix).pipe(map((data: any) => data));
	}

	updateFee(tariffMatrix: TariffMatrix): Observable<any> {
		const url = this.buildURL(`/api/tariff/matrices/${tariffMatrix.id}`);
		return this.httpclient.patch(url, tariffMatrix).pipe(map((data: any) => data));
	}

	deleteFee(id: string): Observable<any> {
		const url = this.buildURL(`/api/tariff/matrices/${id}`);
		return this.httpclient.delete(url).pipe(map((data: any) => data));
	}

	getFees(): Observable<Fee[]> {
		const url = this.buildURL(`/api/tariff/matrices`);
		return this.httpclient.get(url).pipe(map((data: any) => data.map(item => Fee.mapFromMatrixResponse(item))));
	}

	searchRegist(plate: string): Observable<IPlateSearch> {
		const url = this.buildURLIntegration(`/api/integration/plate/${plate}`);
		return this.httpclient.get(url).pipe(map((data: any) => data));
	}

	searchFee(body: any): Observable<IFeeSearch[]> {
		const url = this.buildURL(`/api/tariff/searchFromList`);
		return this.httpclient.post(url, body.query).pipe(map((data: any) => data));
	}
}
