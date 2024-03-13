import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../../../environments/environment";
import { Actividades } from "../../actividades/models/Actividades";
import { Parameter } from "../../parameters/models/parameter.model";
import { Zone } from "../../zones/models/zone.model";
import { MatrizRiesgo } from "../models/matriz.model";

const httpOptions = {
	headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable()

export class MatrizService {
	private api: string = environment.sctrBaseApiUrl;
	private apiIntegration: string = environment.integrationApiUrl;


	constructor(private httpclient: HttpClient) {
	}

	buildURL(apiZones: string, serviceUrl: string): string {
		const protocol = "https:"; // + document.location.protocol;
		return `${protocol}//${apiZones + serviceUrl}`;
	}

	getZones(): Observable<Zone[]> {
		const url = this.buildURL(this.api, `/api/area/groups`);
		return this.httpclient.get(url).pipe(map((data: any) => data.map(item => Zone.mapFromResponse(item))));
	}

	getActividades(): Observable<Actividades[]> {
		const url = this.buildURL(this.apiIntegration, `/api/integration/activities`);
		return this.httpclient.get(url).pipe(map((data: any) => data.map(item => Actividades.mapFromResponse(item))));
	}

	getPremiun(search: any): Observable<any[]> {
		const url = this.buildURL(this.api, `/api/tariff/getRate`);
		return this.httpclient.post(url, search).pipe(map((data: any) => data));
	}

	getMatrices(): Observable<MatrizRiesgo[]> {
		const url = this.buildURL(this.api, `/api/tariff/matrix`);
		return this.httpclient.get(url).pipe(map((data: any) => data.map(item => MatrizRiesgo.mapFromMatrixResponse(item))));
	}

	getItem(id: string, date: string): Observable<MatrizRiesgo> {
		let url = this.buildURL(this.api, `/api/tariff/matrix/${id}`);
		if (date !== null) {
			url = this.buildURL(this.api, `/api/tariff/matrix/${id}?queryDate=${date}`);
		}
		return this.httpclient.get(url).pipe(map(item => MatrizRiesgo.mapFromMatrixResponse(item)));
	}

	getEffectDate(id: string, date: string): Observable<any> {
		const url = this.buildURL(this.api, `/api/tariff/matrix/effectDate/${id}?effectDate=${date}`);
		return this.httpclient.get(url).pipe(map((data: any) => data));
	}

	getParameters(): Observable<Parameter[]> {
		const url = this.buildURL(this.api, `/api/parameters`);
		return this.httpclient.get<Parameter[]>(url);
	}

	createMatriz(matriz: MatrizRiesgo): Observable<any> {
		const url = this.buildURL(this.api, `/api/tariff/matrix`);
		return this.httpclient.post(url, matriz).pipe(map((data: any) => data));
	}

	updateMatriz(matriz: MatrizRiesgo): Observable<any> {
		const url = this.buildURL(this.api, `/api/tariff/matrix/${matriz.id}`);
		return this.httpclient.patch(url, matriz).pipe(map((data: any) => data));
	}

	updatesMatriz(id: string): Observable<any> {
		const url = this.buildURL(this.api, `/api/tariff/matrix/${id}/updates`);
		return this.httpclient.get(url).pipe(map((data: any) => data));
	}

	deleteMatriz(id: string): Observable<any> {
		const url = this.buildURL(this.api, `/api/tariff/matrix/${id}`);
		return this.httpclient.delete(url).pipe(map((data: any) => data));
	}

}
