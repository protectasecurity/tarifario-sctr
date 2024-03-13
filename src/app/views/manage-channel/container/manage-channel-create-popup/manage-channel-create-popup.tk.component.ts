import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { Agent } from "../../models/Agent";
import { Customer } from "../../models/Customer";
import * as channelActions from "../../state/actions/channel.actions";
import * as fromReducer from "../../state/reducers";

@Component({
	selector: "app-manage-channel-create-popup-tk",
	templateUrl: "./manage-channel-create-popup.tk.component.html",
	styleUrls: ["./manage-channel-create-popup.tk.component.scss"]
})
export class ManageChannelCreatePopupTkComponent implements OnInit {
	brokers$: Observable<Agent[]> = this.store.select(fromReducer.brokerItemsVisible);
	middlemen$: Observable<Agent[]> = this.store.select(fromReducer.middlemanItemsVisible);
	customers$: Observable<Customer[]> = this.store.select(fromReducer.getCustomers);
	salesPoint$: Observable<Customer[]> = this.store.select(fromReducer.getSalesPoint);

	constructor(private store: Store<fromReducer.ChannelState>,
		private dialogRef: MatDialogRef<ManageChannelCreatePopupTkComponent>) {
		this.store.dispatch(new channelActions.SetCustomerByDefault());
	}

	ngOnInit() {
		this.store.dispatch(new channelActions.LoadBrokers('6'));
		this.store.dispatch(new channelActions.LoadMiddlemen('10'));
	}

	getBrokers(event: any): void {
		this.store.dispatch(new channelActions.LoadBrokers(event));
	}

	getMiddlemen(event: any): void {
		this.store.dispatch(new channelActions.LoadMiddlemen(event));
	}

	searchBrokers(event: any): void {
		this.store.dispatch(new channelActions.UpdateBrokerSearchText(event));
	}

	searchMiddlemen(event: any): void {
		const query = event === undefined ? false : event === "" ? false : true;
		if (query) {
			this.store.dispatch(new channelActions.UpdateMiddlemenSearchText(event));
		}
	}

	searchCustomers(event: any): void {
		const query = event === undefined ? false : event === "" ? false : true;
		if (query) {
			this.store.dispatch(new channelActions.GetCustomerByName(event));
		}
	}

	onGetPointOfSales(event: any): void {
		this.store.dispatch(new channelActions.LoadSalesPoint(event));
	}

	addAgents(event: any): void {
		if (event) {
			this.dialogRef.close(event);
		}
	}
}
