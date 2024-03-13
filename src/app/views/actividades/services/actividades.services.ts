import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../../../environments/environment";
import { MainProductServices } from "../../../shared/services/main-product.service";
import { Actividades } from "../models/Actividades";
import { Parameter } from "app/views/parameters/models/parameter.model";

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable()
export class ActividadesServices {
	// private api: string = environment.baseApiUrl;
	private api: string;

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

	buildURLIntegration(serviceUrl: string): string {
		const protocol = 'https:'; // + document.location.protocol;
		return `${protocol}//${environment.integrationApiUrl + serviceUrl}`;
	}

	list(): Observable<Actividades[]> {
		const url = this.buildURLIntegration(`/api/integration/activities`);
		return this.httpclient.get<Actividades[]>(url);
	}

	listParameter(): Observable<Parameter[]> {
		const url = this.buildURL(`/api/parameters`);
		return this.httpclient.get<Parameter[]>(url);
	}

	delete(paramId: string): Observable<any> {
		const url = this.buildURL(`/api/activity/groups/${paramId}`);
		const response = this.httpclient.delete(url);
		return response.pipe(map((data: Response) => data));
	}
	create(param: Actividades[]): Observable<any> {
		const url = this.buildURL(`/api/activity/groups`);
		const response = this.httpclient.post(url, param);
		return response.pipe(map((data: Response) => data));
	}
	update(param: Actividades): Observable<any> {
		const url = this.buildURL(`/api/activity/groups/${param.id}`);
		const response = this.httpclient.patch(url, param);
		return response.pipe(map((data: Response) => data));
	}
}
