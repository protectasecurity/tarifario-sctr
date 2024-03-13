import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatListOption, MatSelectChange, MatSelectionList } from '@angular/material';
import { Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { Agent } from '../../../models/Agent';
import * as fromActions from '../../../state/actions/channel.restriction.actions';
import * as fromReducer from '../../../state/reducers';

@Component({
	selector: 'channel-restriction-agent',
	templateUrl: './channel-agent.component.html',
	styleUrls: ['./channel-agent.component.scss']
})
export class ChannelAgentComponent implements OnInit {
	agent: any;
	items: Agent[] = [];
	agentActivated: Agent;
	agentTypes: Agent[] = [
		Agent.CreateInstance("8", "Directos", 0),
		Agent.CreateInstance("6", "Corredores", 1),
		Agent.CreateInstance("10", "Comercializadores", 2)];
	searchControl: FormControl = new FormControl();
	@ViewChild(MatSelectionList) selectionList: MatSelectionList;
	agents$: Observable<Agent[]> = this.store.select(fromReducer.getAgents);
	@Output() onSelectedAgent: EventEmitter<Agent> = new EventEmitter<Agent>();

	constructor(private store: Store<fromReducer.ChannelRestrictionState>, private _spinner: NgxSpinnerService) { }

	ngOnInit() {
		this.selectionList.selectedOptions = new SelectionModel<MatListOption>(false);
		this.agent = "6";
		this.loadAgents();
		this.searchControl.valueChanges.subscribe((text: string) => {
			this.agents$.subscribe(agent => {
				this.items = agent.filter(item => (item.description.toUpperCase().search(text.toUpperCase()) > -1));
			});
		});
	}

	selectAgent(option: MatListOption[]) {
		if (option.length > 0) {
			this.agentActivated = option[0].value;
			this.onSelectedAgent.emit(this.agentActivated);
		}
	}

	selectAgentType(e: MatSelectChange) {
		if (e.value) {
			this.agent = e.value;
			this.loadAgents();
			this.searchControl.setValue('');
		}
	}

	loadAgents() {
		this._spinner.show();
		this.store.dispatch(new fromActions.LoadAgents(this.agent));
		this.agents$.subscribe(agent => {
			this.items = agent;
			this._spinner.hide();
		});
	}
}
