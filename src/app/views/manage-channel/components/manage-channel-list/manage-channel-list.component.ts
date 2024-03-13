import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatTableDataSource } from "@angular/material";
import { sortArray } from "app/shared/helpers/utils";
import { AccessMaping, AppModules, EActions } from "../../../../shared/security/access.mapping";
import { AppConfirmService } from "../../../../shared/services/app-confirm/app-confirm.service";
import { FileExportService } from "../../../../shared/services/file.export.service";
import { Channel } from "../../models/Channels";
import { ManageChannelGroup } from "../../models/ManageChannelGroup";

@Component({
	selector: "manage-channel-list",
	templateUrl: "./manage-channel-list.component.html",
	styleUrls: ["./manage-channel-list.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class ManageChannelListComponent implements OnInit, OnChanges {
	@Input()
	items: Channel[];
	@Output()
	onDelete: EventEmitter<any> = new EventEmitter<any>();
	@Output()
	onEdit: EventEmitter<any> = new EventEmitter<any>();
	@Output()
	onUpdateStatus: EventEmitter<ManageChannelGroup> = new EventEmitter<ManageChannelGroup>();
	@Output()
	onConstraint: EventEmitter<any> = new EventEmitter<any>();

	dataSource: MatTableDataSource<Channel>;
	displayedColumns: string[] = ["description", "isActive", "actions"];

	descriptionFilter = new FormControl();
	stateFilter = new FormControl('true');
	filteredValues = {
		description: "",
		state: "true"
	};
	shCreate: boolean;
	canChange: boolean;
	canDelete: boolean;

	constructor(private permits: AccessMaping, private exportService: FileExportService, private confirmService: AppConfirmService) {

	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.items && changes.items.currentValue) {
			this.FillData(changes.items.currentValue);
		}
	}

	ngOnInit() {
		this.shCreate = this.permits.ShouldDo(AppModules.channels, EActions.create);
		this.canDelete = !this.permits.ShouldDo(AppModules.channels, EActions.delete);
		this.canChange = !this.permits.ShouldDo(AppModules.channels, EActions.changestate);
		this.setFilters();
	}

	excelExport(e: Event) {
		e.preventDefault();
		if (this.dataSource.data.length > 0) {
			this.exportService.excelExport("Canales", ["Descripción", "Activo"], ["description", "isActive"], this.dataSource.data);
		} else {
			this.confirmService.confirm({
				title: "Error",
				message: "No existen datos para exportar.",
				showcancel: false
			});
		}
	}

	private FillData(records: Channel[]) {
		this.dataSource = new MatTableDataSource(sortArray(records, 'description', 1));
		this.dataSource.filterPredicate = this.filterPredicate();
		this.stateFilter.setValue('true');
		this.dataSource.filter = JSON.stringify(this.filteredValues);
	}

	delete(row: any) {
		this.onDelete.emit(row.id);
	}

	edit(row: any) {
		this.onEdit.emit(row.id);
	}

	setFilters(): any {
		this.descriptionFilter.valueChanges.subscribe(descriptionFilterValue => {
			this.filteredValues["description"] = descriptionFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});
		this.stateFilter.valueChanges.subscribe(stateFilterValue => {
			this.filteredValues["state"] = stateFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});
	}

	filterPredicate(): (data: Channel, filter: string) => boolean {
		const myFilterPredicate = function (data: Channel, filter: string): boolean {
			const searchString = JSON.parse(filter);

			const findDescript = searchString.description
				? searchString.description
					.toString()
					.toLocaleLowerCase()
					.trim()
				: "";

			const descriptionFilter =
				data.description
					.toString()
					.toLocaleLowerCase()
					.trim()
					.indexOf(findDescript) !== -1;

			const findEstado = searchString.state ? searchString.state.toString().trim() : "";
			const resultEstado = findEstado === "true" ? true : false;
			const estadoFilter = findEstado === "" ? true : data.isActive === resultEstado;

			return descriptionFilter && estadoFilter;
		};
		return myFilterPredicate;
	}

	changeStatus(row: ManageChannelGroup) {
		row.isActive = !row.isActive;
		this.onUpdateStatus.emit(row);
	}
}
