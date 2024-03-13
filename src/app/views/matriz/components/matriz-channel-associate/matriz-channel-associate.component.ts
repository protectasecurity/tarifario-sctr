import { SelectionModel } from "@angular/cdk/collections";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatButtonToggleGroup, MatDialog, MatDialogRef, MatTableDataSource } from "@angular/material";
import { AppConfirmService } from "../../../../shared/services/app-confirm/app-confirm.service";
import { ChannelChildDialogComponent } from "../../../fee/components/channel-child-dialog/channel-child-dialog";
import { Parameter } from "../../../parameters/models/parameter.model";
import { EffectDateService } from "../../components/effectdate-confirm/effectdate-confirm.service";
import { ILinkedChannel, ParameterStatus } from "../../models/matriz.model";
import { MatrizChannelListComponent } from "../matriz-channel-list/matriz-channel-list.component";
import { MatrizStartendDialogComponent } from "../matriz-startend-dialog/matriz-startend-dialog.component";

@Component({
	selector: "app-matriz-channel-associate",
	templateUrl: "./matriz-channel-associate.component.html",
	styleUrls: ["./matriz-channel-associate.component.scss"]
})
export class MatrizChannelAssociateComponent implements OnInit {
	@ViewChild(MatButtonToggleGroup) matButtonToggleGroup: MatButtonToggleGroup;

	descriptionFilter = new FormControl();
	disabled: boolean = false;

	filteredValues = {
		description: "",
		iniVig: "",
		finVig: "",
		toogleSelected: ""
	};

	dataSource: MatTableDataSource<ILinkedChannel>;
	dataActual: ILinkedChannel[] = [];
	parameters: Parameter[] = [];
	current_ramos: ParameterStatus[] = [];
	paramStatus: ParameterStatus[] = [];
	selection = new SelectionModel<ILinkedChannel>(true, []);
	displayedColumns: string[] = [
		"description",
		"startDate",
		"endDate",
		"commission",
		"distribution",
		"discount"
	];

	constructor(@Inject(MAT_DIALOG_DATA) public data: any,
		private confirmService: AppConfirmService,
		private dateService: EffectDateService,
		public dialog: MatDialog,
		private dialogRef: MatDialogRef<MatrizChannelAssociateComponent>) {

		this.dataActual = data.linked;
		this.disabled = data.canEdit;
		this.parameters = data.parameters;

		const tmpHeaders = this.parameters.filter(d => (d.isActive) && (d.type === "WORKER_TYPE"));
		tmpHeaders.forEach(w => {
			this.paramStatus.push({
				id: w.id,
				description: w.description,
				isActive: false
			});
		});

		const tmpRamos = this.parameters.filter(d => (d.isActive) && (d.type === "FIELD"));

		tmpRamos.forEach(w => this.current_ramos.push({
			id: w.id,
			description: w.description,
			isActive: false
		}));

		const workers = tmpHeaders.map(a => a.description);
		this.displayedColumns = this.displayedColumns.concat(workers, ["actions"]);
	}

	countChannel() {
		return this.dataActual.length;
	}

	ngOnInit() {
		this.dataActual.length === 0 ?
			this.filteredValues.toogleSelected = "" :
			this.filteredValues.toogleSelected = this.current_ramos[0].id;
		this.populate();
		this.dataSource.filterPredicate = this.feeFilterPredicate();
		this.setFilters();
	}

	setFilters() {
		this.descriptionFilter.valueChanges.subscribe(descriptionFilterValue => {
			this.filteredValues["description"] = descriptionFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});
	}

	feeFilterPredicate() {
		const myFilterPredicate = function (data: ILinkedChannel, filter: string): boolean {
			const searchString = JSON.parse(filter);

			// description
			const findDescript = searchString.description
				? searchString.description
					.toString()
					.toLocaleLowerCase()
					.trim()
				: "";
			const descriptionFilter =
				data.channelGroup.description
					.toString()
					.toLocaleLowerCase()
					.trim()
					.indexOf(findDescript) !== -1;

			return descriptionFilter;
		};
		return myFilterPredicate;
	}

	addNewChannelToFee() {
		const current_channels = this.dataActual.filter(a => a.fieldsId === this.filteredValues.toogleSelected);
		const dialogRef = this.dialog.open(MatrizChannelListComponent, {
			width: "1000px",
			disableClose: true,
			data: {
				"current_ramos": this.current_ramos, "current_ramo": this.filteredValues.toogleSelected,
				"current_channels": current_channels, iniVig: this.data.startDate
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				result.data.forEach(e => {
					let channelRepeat: ILinkedChannel[] = [];
					e.fieldsId === "" ?
						channelRepeat = this.dataActual.filter(f => f.channelGroup.id === e.channelGroup.id) :
						channelRepeat = this.dataActual.filter(f => f.channelGroup.id === e.channelGroup.id && f.fieldsId === e.fieldsId);
					if (channelRepeat.length === 0) {
						const paramStatus: ParameterStatus[] = [];
						this.paramStatus.forEach(w => {
							paramStatus.push({
								id: w.id,
								description: w.description,
								isActive: false
							});
						});
						e["parameters"] = paramStatus;
						this.dataActual.push(e);
					}
				});
				this.disabled = true;
				this.filteredValues.toogleSelected = this.dataActual[0].fieldsId;
				this.populate();
			}
		});
	}

	openChannelList() {
		const dialogRef = this.dialog.open(ChannelChildDialogComponent, {
			width: '1330px',
			disableClose: true,
			data: this.dataActual
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
			}
		});
	}

	edit(element: ILinkedChannel) {
		const tmp = JSON.parse(JSON.stringify(element));
		const dialogRef = this.dialog.open(MatrizStartendDialogComponent, {
			width: "500px",
			disableClose: true,
			data: { channel: tmp, minDate: this.data.startDate }
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				// const dd = { start: this.effectDate, end: this.endDate };
				const ilg = this.dataActual.find(x => x.channelGroup.id === element.channelGroup.id && x.fieldsId === element.fieldsId);
				if (ilg !== null) {
					ilg.startDate = result.start;
					ilg.endDate = result.end;
					ilg.commission = result.commission;
					ilg.discount = result.discount;
					ilg.distribution = result.distrubition;
					ilg.channelGroup = result.channelGroup;
				}
			}
		});
	}

	delete(element: any) {
		this.confirmService
			.confirm({
				message: "¿Está seguro de eliminar el canal seleccionado?",
				showcancel: true
			})
			.subscribe((x: any) => {
				if (x === true) {
					this.dataActual = this.dataActual.filter(f => f.channelGroup.id !== element.channelGroup.id || f.fieldsId !== element.fieldsId);
					this.populate();
				}
			});
	}

	populate() {
		const tmpDataSource = this.dataActual.filter(f => f.fieldsId === this.filteredValues.toogleSelected);
		this.dataSource = new MatTableDataSource(tmpDataSource);
	}

	save() {
		this.dialogRef.close(this.dataActual);
	}

	close() {
		this.dialogRef.close();
	}

	toggleChange(event: any) {
		this.filteredValues.toogleSelected = event.value;
		this.populate();
	}
}
