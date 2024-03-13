import { SelectionModel } from "@angular/cdk/collections";
import { Component, Inject, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource } from "@angular/material";
import { Store } from "@ngrx/store";
import { sortArray } from "app/shared/helpers/utils";
import * as moment from "moment";
import { Observable } from "rxjs";
import { AppConfirmService } from "../../../../shared/services/app-confirm/app-confirm.service";
import * as fromReducer from "../../../matriz/state/reducers";
import { ILinkedChannel, IMatrixChannelGroup, ParameterStatus } from "../../models/matriz.model";

@Component({
	selector: "app-matriz-channel-list",
	templateUrl: "./matriz-channel-list.component.html",
	styleUrls: ["./matriz-channel-list.component.scss"]
})
export class MatrizChannelListComponent implements OnInit {
	channels$: Observable<IMatrixChannelGroup[]> = this.store.select(fromReducer.getChannelGroup);
	displayedColumns: string[] = ["select", "description"];
	dataSource = new MatTableDataSource<IMatrixChannelGroup>();
	selection = new SelectionModel<IMatrixChannelGroup>(true, []);
	nameFilter = new FormControl();
	filteredValues = { nameFilter: "" };
	current_channels: IMatrixChannelGroup[] = [];
	current_ramo = "";
	current_ramos: ParameterStatus[] = [];
	effectDate = moment();
	minDate = moment();
	maxDate = null;


	constructor(@Inject(MAT_DIALOG_DATA) public data: any,
		private store: Store<fromReducer.MatrizState>,
		private confirmService: AppConfirmService,
		private dialogRef: MatDialogRef<MatrizChannelListComponent>
	) {
		this.effectDate = moment(new Date(data.iniVig), "DD/MM/YYYY");
		this.minDate = moment(new Date(data.iniVig), "DD/MM/YYYY");
		this.current_ramo = data.current_ramo;
		data.current_ramos.forEach(cr => this.current_ramos.push({
			id: cr.id,
			description: cr.description,
			isActive: this.current_ramo === cr.id
		}));
		this.current_channels = data.current_channels;
		this.channels$.subscribe(channels => {
			let arr = sortArray(channels, "description", 1);
			if (arr.length > 0) {
				arr = arr.filter(x => x.isActive === true);
			}
			const filter = [];
			arr.map(a => {
				const res = this.current_channels.filter(b => b["channelGroup"].id === a.id).length === 0;
				if (res) {
					filter.push(a);
				}
			});
			this.dataSource = new MatTableDataSource(filter);
			this.dataSource.filterPredicate = this.filterPredicate();
		});
	}

	ngOnInit() {
		this.nameFilter.valueChanges.subscribe(n => {
			this.filteredValues["nameFilter"] = n;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});
	}

	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	masterToggle() {
		this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
	}

	checkboxLabel(row?: IMatrixChannelGroup): string {
		if (!row) {
			return `${this.isAllSelected() ? "select" : "deselect"} all`;
		}
	}

	checkRamos() {
		let checked: number = 0;
		this.current_ramos.forEach(cr => {
			if (cr.isActive) {
				checked++;
			}
		});
		return checked;
	}

	save() {
		const list: ILinkedChannel[] = [];
		this.current_ramos.forEach(cr => {
			if (cr.isActive) {
				this.selection.selected.forEach(ss => {
					const linkendChannel: ILinkedChannel = {
						startDate: this.effectDate.toISOString(),
						endDate: "",
						channelGroup: ss,
						parameters: [],
						commission: "",
						distribution: "",
						discount: "",
						fieldsId: cr.id
					};
					list.push(linkendChannel);
				});
			}
		});
		this.dialogRef.close({ data: list });
	}

	close() {
		this.dialogRef.close();
	}

	filterPredicate() {
		const myFilterPredicate = function (data: IMatrixChannelGroup, filter: string): boolean {
			const searchString = JSON.parse(filter);

			// description
			const findDescript = searchString.nameFilter
				? searchString.nameFilter
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

			return descriptionFilter;
		};
		return myFilterPredicate;
	}
}
