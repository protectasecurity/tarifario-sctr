import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AppConfirmService } from "app/shared/services/app-confirm/app-confirm.service";

import { Observable } from "rxjs";
import { Agent } from "../../models/Agent";
import { AgentType } from "../../models/AgentType";
import { Customer } from "../../models/Customer";
import { EAgentType } from "../../models/EAgentType";
import { NewAgent } from "../../models/NewAgent";
import { AgentKtVisible } from "../../services/agent.kt.visible";


@Component({
	selector: "manage-channel-create-popup-detail-tk",
	templateUrl: "./manage-channel-create-popup-detail-tk.component.html",
	styleUrls: ["./manage-channel-create-popup-detail-tk.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageChannelCreatePopupDetailTkComponent implements OnInit {

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
	onGetPointOfSales: EventEmitter<any> = new EventEmitter<any>();
	@Output()
	onAddAgents: EventEmitter<NewAgent[]> = new EventEmitter<NewAgent[]>();

	brokerTypes: AgentType[] = [AgentType.CreateInstance("6", "Corredores"), AgentType.CreateInstance("8", "Directos")];
	middlemenTypes: AgentType[] = [AgentType.CreateInstance("10", "Comercializadores"), AgentType.CreateInstance("11", "Banca Seguros")];
	PointOfSalesTypes: AgentType[] = [AgentType.CreateInstance("97", "Punto de Venta")];
	CustomerTypes: AgentType[] = [AgentType.CreateInstance("98", "Clientes")];
	newAgents: NewAgent[] = [];
	showFiltrarInCustomers = false;

	showBrokersCheck: boolean;
	showMiddlemenCheck: boolean;
	showPointOfSalesCheck: boolean;
	showClientsCheck: boolean;
	visibilityFilter$: Observable<any[]>;
	brokerTypeCore: number;
	middlemenTypeCore: number;

	constructor(private confirmService: AppConfirmService, private visible: AgentKtVisible) {
	}

	ngOnInit() {
		this.onSearchBrokers.emit("");
		this.onSearchMiddlemen.emit("");
		this.onSearchMiddlemen.emit("");
		this.onSearchCustomers.emit("");
		this.visibilityFilter$ = this.visible.getInstance();
		this.visible.fetchAll();
		this.visibilityFilter$.subscribe(value => {
			value.forEach(item => {
				switch (item.type) {
					case "broker":
						this.showBrokersCheck = item.hasSelected;
						break;
					case "middlemen":
						this.showMiddlemenCheck = item.hasSelected;
						break;
					case "pointsofpoints":
						this.showPointOfSalesCheck = item.hasSelected;
						break;
					default:
						this.showClientsCheck = item.hasSelected;
				}
			});
		});

		const mEvent = {};
		(mEvent as any).checked = true;
		this.Click(mEvent, "Directos", "broker", "8");
		this.Click(mEvent, "Comercializadores", "middlemen", "10");
	}

	public Click(event: any, name: string, type: string, filter: string) {
		this.visible.setVisibility(name, type, event.checked);
		if (type === "broker" && event.checked) {
			this.brokerTypeCore = filter.length === 1 ? Number(filter) : Number(filter.split(",")[1]);
			this.onGetBrokers.emit(filter);
		}
		if (type === "middlemen" && event.checked) {
			this.middlemenTypeCore = Number(filter);
			this.onGetMiddlemen.emit(filter);
		}

		if (type === "pointsofpoints" && event.checked) {
			this.onGetPointOfSales.emit(filter);
		}
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

	searchPointOfSales(event: any) {
		// this.onGetPointOfSales.emit(event);
	}

	selectBrokerAgent(event: Agent): void {
		const length = this.newAgents.length;
		this.newAgents = this.newAgents.filter(x => x.id !== event.id);
		if (length === this.newAgents.length) {
			const newAgent = NewAgent.CreateInstance(event.id, event.description, EAgentType.BROKER, this.brokerTypeCore);
			this.newAgents.push(newAgent);
		}
	}

	selectMiddlemanAgent(event: Agent): void {
		if (this.newAgents.filter(x => x.id === event.id).length === 1) {
			this.newAgents = this.newAgents.filter(x => x.id !== event.id);
		} else {
			const newAgent = NewAgent.CreateInstance(event.id, event.description, EAgentType.MIDDLEMAN, this.middlemenTypeCore);
			this.newAgents.push(newAgent);
		}
	}

	selectcustomerAgent(event: Agent): void {
		if (this.newAgents.filter(x => x.id === event.id).length === 1) {
			this.newAgents = this.newAgents.filter(x => x.id !== event.id);
		} else {
			const newAgent = NewAgent.CreateInstance(event.id, event.description, EAgentType.CUSTOMER, 98);
			this.newAgents.push(newAgent);
		}
	}

	selectPointOfSalesAgent(event: Agent): void {
		if (this.newAgents.filter(x => x.id === event.id).length === 1) {
			this.newAgents = this.newAgents.filter(x => x.id !== event.id);
		} else {
			const newAgent = NewAgent.CreateInstance(event.id, event.description, EAgentType.POINT_OF_SALE, 97);
			this.newAgents.push(newAgent);
		}
	}

	addAgents() {
		const BROKER = this.newAgents.filter(x => x.type === EAgentType.BROKER);
		const MIDDLEMAN = this.newAgents.filter(x => x.type === EAgentType.MIDDLEMAN);
		const CUSTOMER = this.newAgents.filter(x => x.type === EAgentType.CUSTOMER);
		const POINT_OF_SALE = this.newAgents.filter(x => x.type === EAgentType.POINT_OF_SALE);

		if (this.newAgents.filter(x => x.type === EAgentType.BROKER).length === 0) {
			this.confirmService.confirm({
				title: "Error",
				message: "Debe seleccionar como mínimo un canal de tipo 'Corredor' o de tipo 'Directos'.",
				showcancel: false
			});
			return;
		}

		if (BROKER.length === 0 && MIDDLEMAN.length === 0) {
			this.confirmService.confirm({
				title: "Error",
				message: "Debe seleccionar como mínimo un canal de tipo 'Comercializador' o de tipo 'Banca Seguros'.",
				showcancel: false
			});
			return;
		} else if (BROKER.length === 0 && MIDDLEMAN.length > 1) {
			this.confirmService.confirm({
				title: "Error",
				message: "Solo puede seleccionar un Middleman",
				showcancel: false
			});
			return;
		} else if (BROKER.length > 1 && MIDDLEMAN.length > 1) {
			this.confirmService.confirm({
				title: "Error",
				message: "Solo puede seleccionar un Middleman y hasta 2 Broker o uno de cada uno",
				showcancel: false
			});
			return;
		} else if (BROKER.length === 1 && MIDDLEMAN.length > 1) {
			this.confirmService.confirm({
				title: "Error",
				message: "Solo puede seleccionar un Middleman y hasta 2 Broker o uno de cada uno1",
				showcancel: false
			});
			return;
		} else if (BROKER.length > 2) {
			this.confirmService.confirm({
				title: "Error",
				message: "Solo puede seleccionar hasta 2 Broker",
				showcancel: false
			});
			return;
		} else if (CUSTOMER.length > 1 || POINT_OF_SALE.length > 1) {
			this.confirmService.confirm({
				title: "Error",
				message: "Solo puede seleccionar un Cliente y Punto de venta",
				showcancel: false
			});
			return;
		} else if (CUSTOMER.length > 1) {
			this.confirmService.confirm({
				title: "Error",
				message: "Solo puede seleccionar un Cliente",
				showcancel: false
			});
			return;
		} else if (POINT_OF_SALE.length > 1) {
			this.confirmService.confirm({
				title: "Error",
				message: "Solo puede seleccionar un Punto de Venta",
				showcancel: false
			});
			return;
		}
		if (this.newAgents.length === 0) {
			this.confirmService.confirm({
				title: "Error",
				message: "Debe Seleccionar agentes.",
				showcancel: false
			});
			return;
		}
		this.onAddAgents.emit(this.newAgents);
	}
}
