import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MainProductServices } from '../../../shared/services/main.product.service';
import { Restriction } from '../models/Restriction';

@Injectable({
	providedIn: 'root'
})

export class RestrictionService {
	private api: string;
	private apiIntegration: string = environment.integrationApiUrl;

	constructor(private http: HttpClient,
		private typeService: MainProductServices
	) {
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

	buildURLIntegration(serviceUrl: string): string {
		const protocol = 'https:'; // + document.location.protocol;
		return `${protocol}//${this.apiIntegration + serviceUrl}`;
	}

	list(): Observable<Restriction[]> {
		const url = this.buildURLIntegration(`/api/integration/restriction`);
		return this.http.get<Restriction[]>(url);
	}

	getByChannelId(channelId: string): Observable<Restriction[]> {
		const url = this.buildURLIntegration(`/api/integration/restriction/channel/${channelId}`);
		return this.http.get<Restriction[]>(url);
	}

	add(restriction: Restriction): Observable<Restriction> {
		const url = this.buildURLIntegration(`/api/integration/restriction`);
		return this.http.post<Restriction>(url, restriction);
	}

	update(restriction: Restriction): Observable<Restriction> {
		const url = this.buildURLIntegration(`/api/integration/restriction`);
		return this.http.put<Restriction>(url, restriction);
	}

	delete(restrictionId: string): Observable<Restriction> {
		const url = this.buildURLIntegration(`/api/integration/restriction/${restrictionId}`);
		return this.http.delete<Restriction>(url);
	}

}
