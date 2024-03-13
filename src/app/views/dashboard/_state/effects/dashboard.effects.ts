import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of as observableOf } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { MatrizService } from "../../../matriz/services/matriz.service";
import * as dashboardActions from '../actions/dashboard.actions';
import { FeeService } from './../../../fee/fee.service';

@Injectable()
export class DashboardEffects {
	constructor(private feeService: FeeService, private matrizService: MatrizService, private actions$: Actions) {}

	@Effect()
	getFees$ = this.actions$.pipe(
		ofType<dashboardActions.LoadFee>(dashboardActions.DashboardActionTypes.LoadFee),
		switchMap(() => this.feeService.getFees()),
		map(mzones => new dashboardActions.LoadFeeComplete(mzones)),
		catchError(error => {
			return observableOf(new dashboardActions.HandledErrors(error));
		})
	);
	@Effect()
	getMatrices$ = this.actions$.pipe(
		ofType<dashboardActions.LoadMatriz>(dashboardActions.DashboardActionTypes.LoadMatriz),
		switchMap(() => this.matrizService.getMatrices()),
		map(matriz => new dashboardActions.LoadMatrizComplete(matriz)),
		catchError(error => {
			return observableOf(new dashboardActions.HandledErrors(error));
		})
	);
}
