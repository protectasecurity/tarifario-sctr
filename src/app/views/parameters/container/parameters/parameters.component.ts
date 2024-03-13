import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog, MatPaginator, MatTable, MatTableDataSource } from "@angular/material";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable } from "rxjs";
import { AppConfirmService } from "../../../../shared/services/app-confirm/app-confirm.service";
import { DisplayAgent } from "../../../manage-channel/container/manage-channel-create/manage-channel-create.component";
import * as paramActions from '../../../parameters/state/actions/parameter.actions';
import { Parameter } from "../../models/parameter.model";
import * as fromReducer from "../../state/reducers";


@Component({
	selector: 'app-parameters',
	templateUrl: './parameters.component.html',
	styleUrls: ['./parameters.component.css']
})

export class ParametersComponent implements OnInit {
	listParamas$: Observable<Parameter[]> = this.store.select(fromReducer.getParameters);
	displayAgents: DisplayAgent[] = [];

	constructor(
		public dialog: MatDialog,
		private store: Store<fromReducer.ParamState>,
		private _spinner: NgxSpinnerService,
		private router: Router,
		private confirmService: AppConfirmService,
	) {
		this._spinner.show();
	}


	ngOnInit(): void {
		this.store.dispatch(new paramActions.LoadParameters());
		this._spinner.hide();
	}

	delete(groupId: any) {
		this.confirmService
			.confirm({
				title: 'Confirmación',
				message: '¿Está seguro de eliminar el parametro?',
				showcancel: true
			})
			.subscribe(x => {
				if (x === true) {
					this.store.dispatch(new paramActions.DeleteParameter(groupId));
				}
			});
	}
	edit(event: any): void {
		this.store.dispatch(new paramActions.UpdateParameter(event));
		this._spinner.hide();
	}
	create(event: any): void {
		this.store.dispatch(new paramActions.AddParameter(event));
	}
	updateStatus(row: Parameter) {
		this.store.dispatch(new paramActions.UpdateParameter(row));
	}



}
