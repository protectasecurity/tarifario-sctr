import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { MatDialog, MatRadioChange, MatTableDataSource } from "@angular/material";
import { AccessMaping, AppModules, EActions } from "../../../../shared/security/access.mapping";
import { AppConfirmService } from "../../../../shared/services/app-confirm/app-confirm.service";
import { Ubigeo } from "../../models/ubigeo.model";
import { Zone } from "../../models/zone.model";
import { ZoneModalComponent } from "../zones-create-popup-detail/zone-modal";


@Component({
	selector: "app-zones-create-detail",
	templateUrl: "./zones-create-detail.component.html",
	styleUrls: ["./zones-create-detail.component.scss"]
})
export class ZonesCreateDetailComponent implements OnInit, OnChanges {
	dataSource = new MatTableDataSource<Ubigeo>();
	displayUbigeo: Ubigeo[] = [];
	displayedColumns: string[] = ["description", "acciones"];
	grupoDescripcion: string = "";
	isEditing: boolean;
	selectedtype: string = "2";
	isGroup: boolean = true;

	@Input()
	Zone: Zone = new Zone();
	@Input()
	Zones: Zone[];
	@Input()
	ubicaciones: Ubigeo[];
	@Output()
	onAddzone: EventEmitter<any> = new EventEmitter<any>();
	@Output()
	onUpdatezone: EventEmitter<any> = new EventEmitter<any>();

	modificationAllowed: boolean;
	constructor(
		public dialog: MatDialog,
		private confirmService: AppConfirmService,
		private permits: AccessMaping
	) {
		this.isEditing = false;
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.Zone && changes.Zone.currentValue) {
			const arraUbigeos = changes.Zone.currentValue.locations;
			this.refreshTable(arraUbigeos);
			this.grupoDescripcion = changes.Zone.currentValue.description;
			this.isEditing = this.Zone.id !== null;
		}
	}

	ngOnInit() {
		this.modificationAllowed = this.permits.ShouldDo(AppModules.zone, EActions.modification);
	}

	refreshTable(locations: any): void {
		this.displayUbigeo = locations;
		this.dataSource = new MatTableDataSource(this.displayUbigeo);
	}

	openZonePicker() {
		const arraUbigeos: Ubigeo[] = [];
		for (let index = 0; index < this.Zones.length; index++) {
			const zoneA = this.Zones[index];
			if (zoneA.active) {
				for (let idx = 0; idx < zoneA.locations.length; idx++) {
					const departA = zoneA.locations[idx];
					const fndDep = arraUbigeos.find(x => x.id === departA.id);
					if (fndDep === undefined) {
						arraUbigeos.push(departA);
					}
				}
			}
		}

		const dialogRef = this.dialog.open(ZoneModalComponent, {
			disableClose: true,
			data: { ubicaciones: this.ubicaciones, isNew: !this.isEditing, displayUbigeo: this.displayUbigeo, inUseActive: arraUbigeos }
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.refreshTable(result);
				if (!this.isEditing) {
					this.concatGroupDescription();
				}
			}
		});
	}

	delete(row: any) {
		this.displayUbigeo = this.displayUbigeo.filter(x => x.id !== row.id);
		if (this.displayUbigeo.length === 1) {
			this.isGroup = false;
			this.regenerateDescription(true);
		}
		this.dataSource = new MatTableDataSource(this.displayUbigeo);
		if (!this.isEditing) {
			this.concatGroupDescription();
		}
	}

	concatGroupDescription(): void {
		this.grupoDescripcion = this.displayUbigeo.map(y => y.description).join(", ");
	}

	regenerateDescription(item: any): void {
		item ? this.concatGroupDescription() : this.grupoDescripcion = this.Zone.description;
	}

	typechange(event: MatRadioChange) {
		this.isGroup = event.value !== "1";
	}

	save(): void {
		if (this.isEditing) {
			this.Zone.locations = this.displayUbigeo;
			this.Zone.description = this.grupoDescripcion;
			this.onUpdatezone.emit(this.Zone);
		} else {
			if (this.isGroup) {
				const zones: Zone[] = [];
				this.Zone = new Zone();
				this.Zone.locations = this.displayUbigeo;
				this.Zone.description = this.grupoDescripcion;
				zones.push(this.Zone);
				this.onAddzone.emit(zones);
			} else {
				const zones: Zone[] = [];
				for (let index = 0; index < this.displayUbigeo.length; index++) {
					this.Zone = new Zone();
					this.Zone.locations = [];
					this.Zone.locations.push(this.displayUbigeo[index]);
					this.Zone.description = this.displayUbigeo[index].description;
					zones.push(this.Zone);
				}
				this.onAddzone.emit(zones);
			}
		}
	}

}
