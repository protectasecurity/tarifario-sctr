import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import 'rxjs/add/operator/map';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MainProductServices } from './../../shared/services/main.product.service';
import { Ubigeo } from './models/ubigeo.model';
import { Zone } from './models/zone.model';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ZoneService {
	private apiZones: string = environment.sctrBaseApiUrl;
	private apiIntegration: string = environment.integrationApiUrl;

	constructor(private httpclient: HttpClient,
		private typeService: MainProductServices
	) {
		if (this.typeService.getMainProduct() === 'SCTR') {
			this.apiZones = environment.sctrBaseApiUrl;
		} else {
			this.apiZones = environment.soatBaseApiUrl;
		}
	}

	buildURL(apiZones: string, serviceUrl: string): string {
		const protocol = 'https:'; // + document.location.protocol;
		return `${protocol}//${apiZones + serviceUrl}`;
	}

	getZones(): Observable<Zone[]> {
		const url = this.buildURL(this.apiZones, `/api/area/groups`);
		return this.httpclient.get(url).pipe(map((data: any) => data.map(item => Zone.mapFromResponse(item))));
	}

	getLocations(): Observable<Ubigeo[]> {
		const url = this.buildURL(this.apiIntegration, `/api/integration/locations`);
		return this.httpclient.get(url).pipe(map((data: any) => data.map(item => Ubigeo.mapFromResponse(item))));
	}

	createZone(zone: Zone[]): Observable<Zone[]> {
		let sResponse = null;
		const sResponseColl = [];
		let payload = {};
		const url = this.buildURL(this.apiZones, `/api/area/groups`);
		for (let index = 0; index < zone.length; index++) {
			const element = zone[index];

			payload = {
				locations: element.locations,
				isActive: true,
				isUsed: false,
				description: element.description
			};
			sResponse = this.httpclient.post(url, payload);
			sResponseColl.push(sResponse);
		}

		return forkJoin(sResponseColl).pipe(
			map((item: any[]) => {
				return item;
			}),
			publishReplay(1),
			refCount()
		);
	}

	createZoneMasive(zone: any[]): Observable<Response> {
		// return this.createZone(zone);
		const url = this.buildURL(this.apiZones, `/api/area/groups/addMany`);

		for (let index = 0; index < zone.length; index++) {
			const element = zone[index];
			element.id = '0';
			element.isActive = true;
		}

		return this.httpclient.post(url, zone).pipe(map((data: any) => data));
	}

	deleteZone(zone: Zone): Observable<any> {
		const url = this.buildURL(this.apiZones, `/api/area/groups/${zone}`);
		return this.httpclient.delete(url).pipe(map((data: any) => data));
	}

	getById(zoneId: string): Observable<Zone> {
		const url = this.buildURL(this.apiZones, `/api/area/groups/${zoneId}`);
		return this.httpclient.get<Zone>(url);
	}

	updateZone(zone: Zone): Observable<any> {
		const url = this.buildURL(this.apiZones, `/api/area/groups/${zone.id}`);
		const payload = {
			description: zone.description,
			order: zone.indice,
			isActive: zone.active,
			locations: zone.locations
		};
		return this.httpclient.patch(url, payload).pipe(map((data: any) => data));
	}

	updateMasiveZone(zones: Zone[]): Observable<any> {
		return of(null);
	}
}
