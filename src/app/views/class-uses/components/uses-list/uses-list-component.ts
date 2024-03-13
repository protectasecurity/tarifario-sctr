import { Component, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog, MatTableDataSource } from "@angular/material";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { Class } from "../../../../shared/models/class.model";
import { UseClass } from "../../../../shared/models/use-class.model";
import { Use } from "../../../../shared/models/use.model";
import { AppConfirmService } from "../../../../shared/services/app-confirm/app-confirm.service";
import { FileExportService } from "../../../../shared/services/file.export.service";
import * as useClassActions from "../../../class-uses/_state/actions/uses.clases.actions";
import * as usesActions from "../../_state/actions/uses.clases.actions";
import * as fromReducer from "../../_state/reducers";

@Component({
	selector: 'app-uses-list',
	templateUrl: './uses-list.component.html',
	styleUrls: ['./uses-list.component.scss']
})
export class UsesListComponent implements OnInit, OnChanges {
	uses: Use[];
	classes: Class[];
	uses$: Observable<Use[]> = this.store.select(fromReducer.getUses);
	class$: Observable<Class[]> = this.store.select(fromReducer.getClasses);
	useClass$: Observable<UseClass[]> = this.store.select(fromReducer.getUseClasses);
	dataSource: MatTableDataSource<UseClass>;

	displayedColumns: string[] = ["use.description", "description", "isActive", "actions"];
	useFilter = new FormControl();
	classFilter = new FormControl();
	stateFilter = new FormControl();
	filteredValues = {
		use: "",
		clazz: "",
		status: ""
	};
	constructor(private confirmService: AppConfirmService,
							private exportService: FileExportService,
							private store: Store<fromReducer.UsesClasesState>,
							public dialog: MatDialog,
							private router: Router
							) {
	}
	ngOnInit(): void {
		this.store.dispatch(new usesActions.LoadUses());
		this.store.dispatch(new usesActions.LoadClasses());
		this.store.dispatch(new usesActions.LoadUseClasses());
		this.useClass$.subscribe(value => {
			this.dataSource = new MatTableDataSource(value);
			this.dataSource.filterPredicate = this.feeFilterPredicate();
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});
		this.filters();
	}

	ngOnChanges(changes: SimpleChanges): void {
	}
	filters() {
		this.classFilter.valueChanges.subscribe(classs => {
			this.filteredValues['clazz'] = classs;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});
		this.useFilter.valueChanges.subscribe(use => {
			this.filteredValues['use'] = use;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});
		this.stateFilter.valueChanges.subscribe(state => {
			this.filteredValues['status'] = state;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});
	}
	feeFilterPredicate(): (data: UseClass, filter: string) => boolean {
		return  function (data: UseClass, filter: string): boolean {
			const searchString = JSON.parse(filter);
			const useDescript = searchString.use
				? searchString.use
					.toString()
					.toLocaleLowerCase()
					.trim()
				: '';
			const useDescriptionFilter = useDescript === '' ? true
				:	data.use.description
					.toString()
					.toLocaleLowerCase()
					.trim()
					.indexOf(useDescript) !== -1;
			const classDescription = searchString.clazz
				? searchString.clazz
					.toString()
					.toLocaleLowerCase()
					.trim()
				: '';
			const classDescriptionFilter = classDescription === '' ? true
				:	data.clazz.description
				.toString()
				.toLocaleLowerCase()
				.trim()
				.indexOf(classDescription) !== -1;
			const estadoFilter = (data.status === searchString.status || searchString.status === "");

			return useDescriptionFilter && classDescriptionFilter && estadoFilter;
		};
	}

	excelExport(e) {
		e.preventDefault();
		if (this.dataSource.data.length > 0) {
			this.exportService.exportUseClasses(this.dataSource.data, ['Uso', 'Descripción', 'Estado']);
		} else {
			this.confirmService.confirm({
				title: "Error",
				message: "No existen datos para exportar.",
				showcancel: false
			});
		}
	}
	add() {
		const data = JSON.stringify(this.dataSource.data);
		this.router.navigate([`/class-uses/create/${data}`]);
	}
	changeStatus(item: UseClass) {
		item.status = (item.status === 'ACTIVE') ? 'INACTIVE' : 'ACTIVE';
		const element = {
			"associationId": item.id,
			"status": item.status
		};
		this.store.dispatch(new usesActions.UpdateUseClassState(element));
	}
	delete(row: string) {
		this.confirmService
			.confirm({
				title: 'Confirmación',
				message: '¿Está seguro de eliminar la relación uso-clase seleccionada?',
				showcancel: true
			})
			.subscribe(x => {
				if (x === true) {
					this.store.dispatch(new useClassActions.DeleteUseClass(row));
				}
			});
	}

}
