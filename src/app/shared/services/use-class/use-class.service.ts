import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../../../environments/environment";
import { UseClass } from "../../models/use-class.model";

@Injectable()
export class UseClassService {
	private api: string = environment.integrationApiUrl;

	constructor(private httpClient: HttpClient) {}

	buildURL(serviceUrl: string): string {
		const protocol = 'https:';
		return `${protocol}//${this.api + serviceUrl}`;
	}
	createUseClass(useClasses: UseClass): Observable<any>  {
		const url = this.buildURL(`/api/integration/useclass`);
		const response = this.httpClient.post(url, useClasses);
		return response.pipe(map((data: Response) => data));
	}
	updateStateUseClass(useClass: any): Observable<any>  {
		const url = this.buildURL(`/api/integration/useclass`);
		const response = this.httpClient.put(url, useClass);
		return response.pipe(map((data: Response) => data));
	}
	deleteUseClass(idUseClass: string): Observable<any> {
		const url = this.buildURL(`/api/integration/useclass/${idUseClass}`);
		const response = this.httpClient.delete(url);
		return response.pipe(map((data: Response) => data));
	}
	getClassesByIdUse(idUseClass: string): Observable<any> {
		const url = this.buildURL(`/api/integration/useclass?useId=${idUseClass}`);
		const response = this.httpClient.get(url);
		return response.pipe(map((data: Response) => data));
	}
	loadUseClasses(): Observable<any> {
		const url = this.buildURL(`/api/integration/useclass`);
		const response = this.httpClient.get(url);
		return response.pipe(map((data: Response) => data));
	}
}
