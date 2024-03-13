import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AppConfirmService } from "app/shared/services/app-confirm/app-confirm.service";

import { Observable } from "rxjs";
import { Agent } from "../../models/Agent";
import { AgentType } from "../../models/AgentType";
import { Customer } from "../../models/Customer";
import { EAgentType } from "../../models/EAgentType";
import { NewAgent } from "../../models/NewAgent";
import { AgentVisible } from "../../services/agent.visible";


@Component({
	selector: "manage-channel-create-popup-detail",
	templateUrl: "./manage-channel-create-popup-detail.component.html",
	styleUrls: ["./manage-channel-create-popup-detail.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageChannelCreatePopupDetailComponent implements OnInit {

	@Input()
	brokers: Agent[] = [];
	@Input()
	middlemen: Agent[] = [];
	@Input()
	pointOfSales: Agent[] = [];
	@Input()
	customers: Customer[] = [];
	@Output()
	onGetBrokers: EventEmitter<any> = new EventEmitter<any>();
	@Output()
	onGetMiddlemen: EventEmitter<any> = new EventEmitter<any>();
	@Output()
	onSearchBrokers: EventEmitter<any> = new EventEmitter<any>();
	@Output()
	onSearchMiddlemen: EventEmitter<any> = new EventEmitter<any>();
	@Output()
	onSearchCustomers: EventEmitter<any> = new EventEmitter<any>();
	@Output()
	onAddAgents: EventEmitter<NewAgent[]> = new EventEmitter<NewAgent[]>();

	brokerTypes: AgentType[] = [AgentType.CreateInstance("6", "Corredores"), AgentType.CreateInstance("8", "Directos")];
	middlemenTypes: AgentType[] = [AgentType.CreateInstance("10", "Comercializadores"), AgentType.CreateInstance("11", "Banca Seguros")];
	PointOfSalesTypes: AgentType[] = [AgentType.CreateInstance("11", "Punto de Venta")];
	CustomerTypes: AgentType[] = [AgentType.CreateInstance("12", "Clientes")];
	newAgents: NewAgent[] = [];
	showFiltrarInCustomers = false;

	showBrokersCheck: boolean = false;
	showMiddlemenCheck: boolean = false;
	showPointOfSalesCheck: boolean = false;
	showClientsCheck: boolean = false;
	visibilityFilter$: Observable<any[]>;

	constructor(private confirmService: AppConfirmService, private visible: AgentVisible) {
	}

	ngOnInit() {
		this.newAgents = [];
		this.onSearchBrokers.emit("");
		this.onSearchMiddlemen.emit("");
		this.onSearchMiddlemen.emit("");
		this.onSearchCustomers.emit("");

		this.visibilityFilter$ = this.visible.getInstance();
		this.visible.fetchAll();
		this.visibilityFilter$.subscribe(value => {
			value.forEach(item => {
				switch (item.name) {
					case "Corredores":
						this.showBrokersCheck = item.isChecked;
						break;
					case "Intermediarios":
						this.showMiddlemenCheck = item.isChecked;
						break;
					case "Puntos de Venta":
						this.showPointOfSalesCheck = item.isChecked;
						break;
					default:
						this.showClientsCheck = item.isChecked;
				}
			});
		});
	}

	public Click(event: any, name: string) {
		this.visible.setVisibility(name, event.checked);

	}

	getBrokers(event: any) {
		this.onGetBrokers.emit(event);
	}

	getMiddlemen(event: any) {
		this.onGetMiddlemen.emit(event);
	}

	searchBrokers(event: any) {
		this.onSearchBrokers.emit(event);
	}

	searchMiddlemen(event: any) {
		this.onSearchMiddlemen.emit(event);
	}

	searchCustomers(event: any) {
		this.onSearchCustomers.emit(event);
	}

	selectBrokerAgent(event: Agent): void {
		const length = this.newAgents.length;
		this.newAgents = this.newAgents.filter(x => x.id !== event.id);
		if (length === this.newAgents.length) {
			const newAgent = NewAgent.CreateInstance(event.id, event.description, EAgentType.BROKER, event.tipo);
			this.newAgents.push(newAgent);
		}
	}

	selectMiddlemanAgent(event: Agent): void {
		if (this.newAgents.filter(x => x.id === event.id).length === 1) {
			this.newAgents = this.newAgents.filter(x => x.id !== event.id);
		} else {
			const newAgent = NewAgent.CreateInstance(event.id, event.description, EAgentType.MIDDLEMAN, event.tipo);
			this.newAgents.push(newAgent);
		}
	}

	selectcustomerAgent(event: Agent): void {
		this.newAgents = this.newAgents.filter(x => x.type !== EAgentType.CUSTOMER);
		const newAgent = NewAgent.CreateInstance(event.id, event.description, EAgentType.CUSTOMER, event.tipo);
		this.newAgents.push(newAgent);
	}

	addAgents() {
		if (this.newAgents.filter(x => x.type === EAgentType.BROKER).length === 0) {
			this.confirmService.confirm({
				title: "Error",
				message: "Debe seleccionar como mínimo un canal de tipo 'Corredor' o de tipo 'Directos'.",
				showcancel: false
			});
			return;
		}
		if (this.newAgents.length === 0) {
			this.confirmService.confirm({
				title: "Error",
				message: "Debe seleccionar como mínimo un canal.",
				showcancel: false
			});
			return;
		}
		if (this.newAgents.filter(x => x.type === EAgentType.BROKER).length > 1 &&
			this.newAgents.filter(x => x.type === EAgentType.MIDDLEMAN).length > 0) {
			this.confirmService.confirm({
				title: "Error",
				message: "Si selecciona un canal de tipo 'Intermediario' solo puede seleccionar un canal de tipo 'Corredor' o de tipo 'Directos'.",
				showcancel: false
			});
			return;
		}
		this.onAddAgents.emit(this.newAgents);
	}
}
