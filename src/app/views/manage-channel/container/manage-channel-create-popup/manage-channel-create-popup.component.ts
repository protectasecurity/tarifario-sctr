import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Agent } from '../../models/Agent';
import { Customer } from '../../models/Customer';
import * as channelActions from '../../state/actions/channel.actions';
import * as fromReducer from '../../state/reducers';

@Component({
	selector: 'app-manage-channel-create-popup',
	templateUrl: './manage-channel-create-popup.component.html',
	styleUrls: ['./manage-channel-create-popup.component.scss']
})
export class ManageChannelCreatePopupComponent implements OnInit, AfterViewInit {
	brokers$: Observable<Agent[]> = this.store.select(fromReducer.brokerItemsVisible);
	middlemen$: Observable<Agent[]> = this.store.select(fromReducer.middlemanItemsVisible);
	customers$: Observable<Customer[]> = this.store.select(fromReducer.getCustomers);

	constructor(private store: Store<fromReducer.ChannelState>,
		private dialogRef: MatDialogRef<ManageChannelCreatePopupComponent>,
		private cd: ChangeDetectorRef) {
		this.store.dispatch(new channelActions.SetCustomerByDefault());
	}

	ngAfterViewInit() {
		this.cd.detectChanges();
	}

	ngOnInit() {
		this.store.dispatch(new channelActions.LoadBrokers('9,6'));
		this.store.dispatch(new channelActions.LoadMiddlemen('10'));
		this.cd.detectChanges();
	}
	getBrokers(event: any): void {
		this.store.dispatch(new channelActions.LoadBrokers(event));
		this.cd.detectChanges();
	}
	getMiddlemen(event: any): void {
		this.store.dispatch(new channelActions.LoadMiddlemen(event));
		this.cd.detectChanges();
	}
	searchBrokers(event: any): void {
		this.store.dispatch(new channelActions.UpdateBrokerSearchText(event));
		this.cd.detectChanges();
	}
	searchMiddlemen(event: any): void {
		this.store.dispatch(new channelActions.UpdateMiddlemenSearchText(event));
		this.cd.detectChanges();
	}
	searchCustomers(event: any): void {
		const query = event === undefined ? false : event === '' ? false : true;
		if (query) {
			this.store.dispatch(new channelActions.GetCustomerByName(event));
		}
		this.cd.detectChanges();
	}
	addAgents(event: any): void {
		if (event) {
			this.dialogRef.close(event);
			this.cd.detectChanges();
		}
	}
}
