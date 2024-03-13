import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { MatDialog, MatTableDataSource } from "@angular/material";
import { AppConfirmService } from "app/shared/services/app-confirm/app-confirm.service";
import { sortArray } from "../../../../shared/helpers/utils";
import { AccessMaping, AppModules, EActions } from "../../../../shared/security/access.mapping";
import { MainProductServices } from "../../../../shared/services/main.product.service";
import { ManageChannelCreatePopupComponent } from "../../container/manage-channel-create-popup/manage-channel-create-popup.component";
import { ManageChannelCreatePopupTkComponent } from "../../container/manage-channel-create-popup/manage-channel-create-popup.tk.component";
import { DisplayAgent } from "../../container/manage-channel-create/manage-channel-create.component";
import { EAgentType } from "../../models/EAgentType";
import { ManageChannel } from "../../models/ManageChannel";
import { ManageChannelGroup } from "../../models/ManageChannelGroup";
import { NewAgent } from "../../models/NewAgent";

@Component({
	selector: "manage-channel-create-detail",
	templateUrl: "./manage-channel-create-detail.component.html",
	styleUrls: ["./manage-channel-create-detail.component.scss"]
	// changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageChannelCreateDetailComponent implements OnInit, OnChanges {
	dataSource = new MatTableDataSource<DisplayAgent>();
	displayAgents: DisplayAgent[] = [];
	manageChannel: ManageChannel[] = [];
	displayedColumns: string[] = ["description", "acciones"];
	grupoDescripcion: string = "";
	grupoDescripcionDB: string = "";
	isButtonAceptarDisabled: boolean = false;
	isEditing: boolean = false;
	checked = false;
	@Input()
	channelGroup: ManageChannelGroup = new ManageChannelGroup();
	@Output()
	onAddGroupChannel: EventEmitter<any> = new EventEmitter<any>();
	@Output()
	onUpdateGroupChannel: EventEmitter<any> = new EventEmitter<any>();

	modificationAllowed: boolean;
	constructor(public dialog: MatDialog, private confirmService: AppConfirmService,
		private mainApp: MainProductServices, private permits: AccessMaping) {
	}

	ngOnChanges(changes: SimpleChanges): void {

		if (changes.channelGroup && changes.channelGroup.currentValue) {
			const editChannelGroup = changes.channelGroup.currentValue.channels;
			if (editChannelGroup) {
				this.manageChannel = [];
				this.displayAgents = [];
				this.isEditing = true;
				editChannelGroup.map((x: any) => {
					this.refreshTable(x.agents);
				});
			}
			this.grupoDescripcion = changes.channelGroup.currentValue.description;
			this.grupoDescripcionDB = changes.channelGroup.currentValue.description;
		}
	}

	ngOnInit() {
		this.modificationAllowed = this.permits.ShouldDo(AppModules.channels, EActions.modification);
	}

	refreshTable(agents: NewAgent[]): void {
		const broker = sortArray(agents.filter(x => x.type === EAgentType.BROKER), "id", 1);
		const midleman = agents.filter(x => x.type === EAgentType.MIDDLEMAN);
		const points = agents.filter(x => x.type === EAgentType.POINT_OF_SALE);
		const customer = agents.filter(x => x.type === EAgentType.CUSTOMER);

		//////////////////////////////////////////////////////
		let collecion: any[] = this.cascade([broker], midleman);
		collecion = this.cascade(collecion, points);
		collecion = this.cascade(collecion, customer);


		for (let index = 0; index < collecion.length; index++) {
			const item = collecion[index];
			const newItem = DisplayAgent.CreateInstance(item);
			if (this.displayAgents.filter(x => x.ids === newItem.ids).length > 0) {
				this.confirmService.confirm({
					title: "Validación",
					message: "El canal seleccionado ya existe.",
					showcancel: false
				});
				return;

			} else {

				/*
				if (this.displayAgents.length > 0) {
					const onlyDirect = agents.filter(x => x.type === EAgentType.BROKER).filter(x => x.coreType === 8);
					const onlyCorred = agents.filter(x => x.type === EAgentType.BROKER).filter(x => x.coreType !== 8);

					const actualDirect = this.displayAgents.filter(x => x.agents.find(y => y.type === EAgentType.BROKER && y.coreType === 8));
					const actualCorred = this.displayAgents.filter(x => x.agents.find(y => y.type === EAgentType.BROKER && y.coreType !== 8));


					if (actualCorred.length > 0 && onlyDirect.length > 0) {
						this.confirmService.confirm({
							title: "Validación",
							message: "Ya se encuentra configurado un canal de tipo 'CORREDOR', por lo que no se puede agrupar con un tipo 'DIRECTO'.",
							showcancel: false
						});
						return;
					}
					if (actualDirect.length > 0 && onlyCorred.length > 0) {
						this.confirmService.confirm({
							title: "Validación",
							message: "Ya se encuentra consigurado un canal de tipo 'DIRECTO', por lo que no se puede agrupar con un tipo 'CORREDOR'.",
							showcancel: false
						});
						return;
					}
				}
				*/
				this.displayAgents.push(newItem);
				this.manageChannel.push(ManageChannel.CreateInstance(item));
			}

		}
		this.dataSource = new MatTableDataSource(this.displayAgents);

		/* collecion.forEach(item => {
			const newItem = DisplayAgent.CreateInstance(item);
			if (this.displayAgents.filter(x => x.ids === newItem.ids).length > 0) {
				this.confirmService.confirm({
					title: "Validación",
					message: "Una algunas de las combinaciones seleccionadas ya existen.",
					showcancel: false
				});
			} else {
				console.log(newItem);
				this.displayAgents.push(newItem);
				this.manageChannel.push(ManageChannel.CreateInstance(item));
			}
		}); */

	}

	cascade(base: any[][], collecion: any[]): any[][] {

		const result: any[][] = [];
		base.forEach(arr => {
			collecion.forEach(coll => {
				result.push(arr.concat(coll));
			});
		});
		return result.length === 0 ? base : result;
	}

	concatGroupDescription(): void {
		if (!this.isEditing) {
			this.generateDescription();
		}
	}

	selectItem(event: any) {
		if (event.checked) {
			this.generateDescription();
		} else {
			this.grupoDescripcion = this.grupoDescripcionDB;
		}
	}

	generateDescription() {
		this.grupoDescripcion = this.manageChannel.map(x => x.agents.map(y => y.description).join(", ")).join("\n\n");
	}

	openPopup(): void {
		if (this.mainApp.getMainProduct() === "SOAT") {
			const dialogRef = this.dialog.open(ManageChannelCreatePopupComponent, {
				width: "1200px"
			});
			dialogRef.afterClosed().subscribe((result: NewAgent[]) => {
				if (result) {
					this.refreshTable(result);
					this.concatGroupDescription();
				}
			});
		} else {
			const dialogRef = this.dialog.open(ManageChannelCreatePopupTkComponent, {
				width: "1200px"
			});
			dialogRef.afterClosed().subscribe((result: NewAgent[]) => {
				if (result) {
					this.refreshTable(result);
					this.concatGroupDescription();
				}
			});
		}

	}

	delete(row: any) {
		this.displayAgents = this.displayAgents.filter(x => x.ids !== row.ids);
		this.dataSource = new MatTableDataSource(this.displayAgents);
		this.manageChannel = this.manageChannel.filter(x => row.agents !== x.agents);
		this.concatGroupDescription();
	}

	manageGroupChannel(): void {
		const errorMessage = this.getErrorMessage();
		if (errorMessage.length > 0) {
			this.confirmService.confirm({
				title: "Error",
				message: errorMessage,
				showcancel: false
			});
			return;
		}
		if (this.channelGroup.id) {
			this.updateGroupChannel();
		} else {
			this.addGroupChannel();
		}
	}

	getErrorMessage(): string {
		let errorMessage = "";
		if (this.manageChannel.length === 0) {
			errorMessage += "Debe seleccionar como mínimo un canal.";
		}
		if (this.grupoDescripcion === undefined || this.grupoDescripcion.length === 0) {
			errorMessage += "Debe ingresar una descripción.";
		}
		return errorMessage;
	}

	addGroupChannel(): void {
		const newGroup: any = {
			grupoDescripcion: this.grupoDescripcion,
			manageChannel: this.manageChannel
		};
		this.onAddGroupChannel.emit(newGroup);
	}

	updateGroupChannel(): void {
		const updatedGroup: any = {
			id: this.channelGroup.id,
			grupoDescripcion: this.grupoDescripcion,
			manageChannel: this.manageChannel
		};
		this.onUpdateGroupChannel.emit(updatedGroup);
	}
}
