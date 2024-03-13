import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MainProductServices } from "../../../shared/services/main.product.service";
import { Agent } from '../models/Agent';
import { ManageChannelGroup } from '../models/ManageChannelGroup';

@Injectable({
	providedIn: 'root'
})
export class AgentService {
	private apiIntegration: string = environment.integrationApiUrl;
	private api: string;

	constructor(private http: HttpClient, private typeService: MainProductServices
	) {
		if (this.typeService.getMainProduct() === 'SCTR') {
			this.api = environment.sctrBaseApiUrl;
		} else {
			this.api = environment.soatBaseApiUrl;
		}
	}


	buildURL(api: string, serviceUrl: string): string {
		const protocol = 'https:';
		return `${protocol}//${api + serviceUrl}`;
	}

	get(types: string): Observable<Agent[]> {
		const url = this.buildURL(this.apiIntegration, `/api/integration/channel?types=${types}`);
		return this.http.get<Agent[]>(url);
	}

	create(channelsGroup: ManageChannelGroup): Observable<any> {
		const url = this.buildURL(this.api, `/api/channel/groups`);
		const response = this.http.post(url, channelsGroup);
		return response.pipe(map((data: Response) => data));
	}
}
