import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Restriction } from 'app/views/channel-restriction/models/Restriction';
import { Observable } from 'rxjs';
import { Agent } from '../../../../manage-channel/models/Agent';
import * as fromActions from '../../../state/actions/channel.restriction.actions';
import * as fromReducer from '../../../state/reducers';

@Component({
	selector: 'channel-restriction-create-channel-dialog',
	templateUrl: './create-channel-dialog.component.html',
	styleUrls: ['./create-channel-dialog.component.scss']
})
export class CreateChannelDialogComponent implements OnInit {
	stateFilter = new FormControl();
	agente: Agent;
	restrictions$: Observable<Restriction[]> = this.store.select(fromReducer.getRestrictions);

	constructor(
		private store: Store<fromReducer.ChannelRestrictionState>,
		public dialogRef: MatDialogRef<CreateChannelDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) { }

	ngOnInit() {
	}

	getSelectedAgent(agent: Agent) {
		this.agente = agent;
	}

	addChannel() {
		this.store.dispatch(new fromActions.LoadSelectedChannelAgents(this.agente));
		const obj = { description: this.agente.description, id: this.agente.id };
		this.dialogRef.close(obj);
	}
}
