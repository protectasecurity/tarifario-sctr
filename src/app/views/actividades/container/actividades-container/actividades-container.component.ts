import { Parameter } from 'app/views/parameters/models/parameter.model';
import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable } from "rxjs";
import { AppConfirmService } from "../../../../shared/services/app-confirm/app-confirm.service";
import { Actividades } from "../../models/Actividades";
import * as actividadesAction from "../../states/action/actividades.actions";
import * as fromReducer from "../../states/reducers";

@Component({
	selector: 'app-actividades-container',
	templateUrl: './actividades-container.component.html',
	styleUrls: ['./actividades-container.component.scss']
})
export class ActividadesContainerComponent implements OnInit {

	listActividades$: Observable<Actividades[]> = this.store.select(fromReducer.getActividad);
	parameter$ = this.store.select(fromReducer.getParameter);
	/* 	parameterColl: Parameter[]; */

	constructor(
		private store: Store<fromReducer.ActividadesState>,
		private confirmService: AppConfirmService,
		private router: Router,
		private _spinner: NgxSpinnerService,
	) { }

	ngOnInit() {
		this.store.dispatch(new actividadesAction.LoadActividades());
		this.store.dispatch(new actividadesAction.LoadParameter());

		/* this.parameter$.subscribe(mParameters => {
			if (mParameters) {
				this.parameterColl = mParameters.filter(x => x.type === 'FIELD' && x.isActive === true);
				console.log(mParameters);
			}
		}); */
	}

	delete(groupId: any) {
		this.confirmService
			.confirm({
				title: 'Confirmación',
				message: '¿Está seguro de eliminar la actividad?',
				showcancel: true
			})
			.subscribe(x => {
				if (x === true) {
					this.store.dispatch(new actividadesAction.DeleteActividades(groupId));
				}
			});
	}
	create(event: any): void {
		this.store.dispatch(new actividadesAction.AddActividades(event));
	}
	updateStatus(row: Actividades) {
		this.store.dispatch(new actividadesAction.UpdateActividades(row));
	}

}
