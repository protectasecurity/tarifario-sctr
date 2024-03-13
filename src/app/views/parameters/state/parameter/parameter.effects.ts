import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of as observableOf } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { ParametersService } from "../../../parameters/services/parameters.service";
import * as paramActions from '../../../parameters/state/actions/parameter.actions';

@Injectable()
export class ParameterEffects {

	constructor(
		private paremetersService: ParametersService,
		private router: Router,
		private actions$: Actions) { }


	@Effect()
	listParams$ = this.actions$.pipe(
		ofType<paramActions.LoadParameters>(paramActions.ParameterActionTypes.LoadParameters),
		switchMap(() => this.paremetersService.list()),
		map(paramList => new paramActions.LoadParametersComplete(paramList)),
		catchError(error => {
			return observableOf(new paramActions.HandledErrors(error));
		})
	);

	@Effect()
	deleteParams$ = this.actions$.pipe(
		ofType<paramActions.DeleteParameter>(paramActions.ParameterActionTypes.DeleteParameter),
		switchMap(action =>
			this.paremetersService.delete(action.payload).pipe(
				switchMap(() => {
					return [new paramActions.DeleteParameterComplete(), new paramActions.LoadParameters()];
				})
			)
		),
		catchError(error => {
			return observableOf(new paramActions.HandledErrors(error));
		})
	);

	@Effect()
	updateParams$ = this.actions$.pipe(
		ofType<paramActions.UpdateParameter>(paramActions.ParameterActionTypes.UpdateParameter),
		switchMap(action =>
			this.paremetersService.update(action.payload).pipe(
				switchMap(() => {
					return [
						new paramActions.UpdateParameterComplete(),
						new paramActions.LoadParameters()];
				})
			)
		),
		catchError(error => {
			return observableOf(new paramActions.HandledErrors(error));
		})
	);


	@Effect()
	createParams$ = this.actions$.pipe(
		ofType<paramActions.AddParameter>(paramActions.ParameterActionTypes.AddParameter),
		switchMap((action) => {
			const newRecord = action.payload;
			return this.paremetersService.create(newRecord).pipe(
				switchMap(response => {
					this.router.navigate(['/parameters']);
					return [
						new paramActions.AddParameterComplete(),
						new paramActions.LoadParameters()
					];
				})
			);
		}),
		catchError(error => {
			return observableOf(new paramActions.HandledErrors(error));
		})
	);
}
