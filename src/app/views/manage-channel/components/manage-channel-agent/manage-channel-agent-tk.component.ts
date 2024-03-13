import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatListOption, MatSelectionList } from '@angular/material';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Agent } from '../../models/Agent';
import { AgentType } from '../../models/AgentType';

@Component({
	selector: 'manage-channel-agent-tk',
	templateUrl: './manage-channel-agent-tk.component.html',
	styleUrls: ['./manage-channel-agent-tk.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageChannelAgentTkComponent implements OnInit, AfterViewInit {
	@Input()
	agents: Agent[] = [];
	@Input()
	agentTypes: AgentType[];
	@Input()
	disabled: boolean = false;
	@Input()
	showFiltrar: boolean = true;
	@Output()
	onGetAgents: EventEmitter<any> = new EventEmitter<any>();
	@Output()
	onSearchAgents: EventEmitter<any> = new EventEmitter<any>();
	@Output()
	onSelectAgent: EventEmitter<Agent> = new EventEmitter<Agent>();

	defaultAgentType: string;
	agentText: string = '';

	@ViewChild(MatSelectionList) selectionList: MatSelectionList;
	searchControl: FormControl = new FormControl();

	constructor(private confirmService: AppConfirmService) { }

	ngOnInit(): void {
		this.selectionList.selectedOptions = new SelectionModel<MatListOption>(true);
		this.searchEvent();
	}
	ngAfterViewInit(): void {
		this.defaultAgentType = this.agentTypes[0].id;
	}
	searchEvent(): void {
		this.searchControl.valueChanges
			.pipe(
				debounceTime(400),
				distinctUntilChanged()
			)
			.subscribe(val => {
				val = val.length > 0 ? val.toUpperCase() : '';
				this.onSearchAgents.emit(val);
			});
	}
	selectAgentType(event: any): void {
		this.onGetAgents.emit(event.value);
	}
	selectAgent(event: any): void {
		this.onSelectAgent.emit(<Agent>event.option.value);
	}
	searchByText() {
		if (this.agentText.length < 4) {
			this.confirmService.confirm({
				title: 'Error',
				message: 'Debe ingresar como minimo 4 caracteres.',
				showcancel: false
			});
			return;
		}
		this.onSearchAgents.emit(this.agentText.toUpperCase());
	}
}
