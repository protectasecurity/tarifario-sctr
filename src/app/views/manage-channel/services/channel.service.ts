import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Channel } from '../models/Channels';
import { Customer } from '../models/Customer';
import { ManageChannelGroup } from '../models/ManageChannelGroup';
import { MainProductServices } from './../../../shared/services/main-product.service';
import { Fee } from './../../fee/models/fee.model';
import { IMatrixChannel, IMatrixChannelGroup } from './../../fee/models/tariffmatrix.model';

@Injectable({
	providedIn: 'root'
})
export class ChannelService {
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

	list(): Observable<Channel[]> {
		const url = this.buildURL(`/api/channel/groups`);
		return this.http.get<Channel[]>(url);
	}
	listMatrixChannel(): Observable<IMatrixChannelGroup[]> {
		const url = this.buildURL(`/api/channel/groups`);
		return this.http.get(url).pipe(map((data: any) => data.map(item => IMatrixChannelGroup.mapFromResponse(item))));
	}
	delete(groupId: string): Observable<any> {
		const url = this.buildURL(`/api/channel/groups/${groupId}`);
		const response = this.http.delete(url);
		return response.pipe(map((data: Response) => data));
	}
	getById(groupId: string): Observable<ManageChannelGroup> {
		const url = this.buildURL(`/api/channel/groups/${groupId}`);
		return this.http.get<ManageChannelGroup>(url);
	}
	update(channelsGroup: ManageChannelGroup): Observable<any> {
		const url = this.buildURL(`/api/channel/groups/${channelsGroup.id}`);
		const response = this.http.patch(url, channelsGroup);
		return response.pipe(map((data: Response) => data));
	}
	findCustomerByName(name: string): Observable<Customer[]> {
		const url = this.buildURLIntegration(`/api/integration/clients/findByName?name=${name}`);
		return this.http.get(url).pipe(map((data: any) => data.map(item => Customer.mapFromResponse(item))));
	}

	getFeeCollection(): Observable<Fee[]> {
		let url; // = this.buildURL(`/api/tariff/matrices`);
		if (this.typeService.getMainProduct() === 'SOAT') {
			url = this.buildURL(`/api/tariff/matrices`);
		} else {
			url = this.buildURL(`/api/tariff/matrix`);
		}
		return this.http.get(url).pipe(map((data: any) => data.map(item => Fee.mapFromMatrixResponse(item))));
	}
}
