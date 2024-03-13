import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of as observableOf } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import * as actividadesAction from "../../../actividades/states/action/actividades.actions";
import { ActividadesServices } from "../../services/actividades.services";

@Injectable()
export class ActividadesEffects {


	constructor(private router: Router,
		private actividadesService: ActividadesServices,
		private actions$: Actions) { }

	@Effect()
	listParams$ = this.actions$.pipe(
		ofType<actividadesAction.LoadActividades>(actividadesAction.ActividadesActionTypes.LoadActividades),
		switchMap(() => this.actividadesService.list()),
		map(paramList => new actividadesAction.LoadActividadesComplete(paramList)),
		catchError(error => {
			return observableOf(new actividadesAction.HandledErrors(error));
		})
	);

	@Effect()
	deleteParams$ = this.actions$.pipe(
		ofType<actividadesAction.DeleteActividades>(actividadesAction.ActividadesActionTypes.DeleteActividades),
		switchMap(action =>
			this.actividadesService.delete(action.payload).pipe(
				switchMap(() => {
					return [new actividadesAction.DeleteActividadesComplete(), new actividadesAction.LoadActividades()];
				})
			)
		),
		catchError(error => {
			return observableOf(new actividadesAction.HandledErrors(error));
		})
	);

	@Effect()
	updateParams$ = this.actions$.pipe(
		ofType<actividadesAction.UpdateActividades>(actividadesAction.ActividadesActionTypes.UpdateActividades),
		switchMap(action =>
			this.actividadesService.update(action.payload).pipe(
				switchMap(() => {
					this.router.navigate(['/actividades']);
					return [new actividadesAction.UpdateActividadesComplete()];
				})
			)
		),
		catchError(error => {
			return observableOf(new actividadesAction.HandledErrors(error));
		})
	);

	@Effect()
	createParams$ = this.actions$.pipe(
		ofType<actividadesAction.AddActividades>(actividadesAction.ActividadesActionTypes.AddActividades),
		switchMap((action) => {
			const newRecord = action.payload;
			return this.actividadesService.create(newRecord).pipe(
				switchMap(response => {
					this.router.navigate(['/actividades']);
					return [
						new actividadesAction.AddActividadesComplete(),
						new actividadesAction.LoadActividades()
					];
				})
			);
		}),
		catchError(error => {
			return observableOf(new actividadesAction.HandledErrors(error));
		})
	);

	@Effect()
	listParameters$ = this.actions$.pipe(
		ofType<actividadesAction.LoadParameter>(actividadesAction.ActividadesActionTypes.LoadParameter),
		switchMap(() => this.actividadesService.listParameter()),
		map(paramList => new actividadesAction.LoadParameterComplete(paramList)),
		catchError(error => {
			return observableOf(new actividadesAction.HandledErrors(error));
		})
	);


}
