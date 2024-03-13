import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of as observableOf } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { ChannelService } from "../../../manage-channel/services/channel.service";
import { ZoneService } from "../../../zones/zone.service";
import { MatrizService } from "../../services/matriz.service";
import * as matrizActions from "../actions/matriz.actions";

@Injectable()
export class MatrizEffects {

	constructor(
		private matrizService: MatrizService,
		private zoneService: ZoneService,
		private channelService: ChannelService,
		private actions$: Actions,
		private router: Router
	) {
	}

	@Effect()
	getZones$ = this.actions$.pipe(
		ofType<matrizActions.LoadZones>(matrizActions.MatrizActionsType.LoadZones),
		switchMap(() => this.matrizService.getZones()),
		map(mzones => new matrizActions.LoadZonesCompleted(mzones)),
		catchError(error => {
			return observableOf(new matrizActions.HandledErrors(error));
		})
	);
	@Effect()
	getActividades$ = this.actions$.pipe(
		ofType<matrizActions.LoadActividades>(matrizActions.MatrizActionsType.LoadActividades),
		switchMap(() => this.matrizService.getActividades()),
		map(mactividades => new matrizActions.LoadActividadesCompleted(mactividades)),
		catchError(error => {
			return observableOf(new matrizActions.HandledErrors(error));
		})
	);
	@Effect()
	getParameters$ = this.actions$.pipe(
		ofType<matrizActions.LoadParameters>(matrizActions.MatrizActionsType.LoadParameters),
		switchMap(() => this.matrizService.getParameters()),
		map(paramList => new matrizActions.LoadParametersComplete(paramList)),
		catchError(error => {
			return observableOf(new matrizActions.HandledErrors(error));
		})
	);

	@Effect()
	createMatriz$ = this.actions$.pipe(
		ofType<matrizActions.CreateMatriz>(matrizActions.MatrizActionsType.CreateMatriz),
		map(action => action.payload),
		switchMap(newMat =>
			this.matrizService.createMatriz(newMat).pipe(
				map(() => new matrizActions.CreateMatrizCompleted()),
				catchError(error => {
					return observableOf(new matrizActions.HandledErrors(error));
				})
			)
		)
	);
	@Effect()
	getItems$ = this.actions$.pipe(
		ofType<matrizActions.LoadM>(matrizActions.MatrizActionsType.LoadM),
		switchMap(() => this.matrizService.getMatrices()),
		map(matriz => new matrizActions.LoadCompleteM(matriz)),
		catchError(error => {
			return observableOf(new matrizActions.HandledErrors(error));
		})
	);

	@Effect()
	getPremiun$ = this.actions$.pipe(
		ofType<matrizActions.LoadGetPremiun>(matrizActions.MatrizActionsType.LoadGetPremiun),
		switchMap(action => this.matrizService.getPremiun(action.payload).pipe(
			map(tariff => new matrizActions.LoadGetPremiunComplete(tariff)),
			catchError(error => {
				return observableOf(new matrizActions.HandledErrors(error));
			})
			)
		)
	);

	@Effect()
	getItem$ = this.actions$.pipe(
		ofType<matrizActions.LoadMatriz>(matrizActions.MatrizActionsType.LoadMatriz),
		switchMap(action => this.matrizService.getItem(action.payload, action.date).pipe(
			map(matriz => new matrizActions.LoadMatrizComplete(matriz)),
			catchError(error => {
				return observableOf(new matrizActions.HandledErrors(error));
			})
			)
		)
	);
	@Effect()
	updateMatriz$ = this.actions$.pipe(ofType<matrizActions.LoadMatrizUpdates>(matrizActions.MatrizActionsType.LoadMatrizUpdates),
		map(action => action.payload),
		switchMap(newMatriz =>
			this.matrizService.updateMatriz(newMatriz).pipe(
				map(update => new matrizActions.LoadMatrizUpdatesComplete(update)),
				catchError(error => {
					return observableOf(new matrizActions.HandledErrors(error));
				})
			)
		)
	);

	@Effect()
	getChannelGroup$ = this.actions$.pipe(
		ofType<matrizActions.LoadChannelGroup>(matrizActions.MatrizActionsType.LoadChannelGroup),
		switchMap(() => this.channelService.listMatrixChannel()),
		map(channels => new matrizActions.LoadChannelGroupComplete(channels)),
		catchError(error => {
			return observableOf(new matrizActions.HandledErrors(error));
		})
	);

	@Effect()
	getDepartments$ = this.actions$.pipe(
		ofType<matrizActions.LoadDepartments>(matrizActions.MatrizActionsType.LoadDepartments),
		switchMap(() => this.zoneService.getLocations()),
		map(departments => new matrizActions.LoadDepartmentsComplete(departments)),
		catchError(error => {
			return observableOf(new matrizActions.HandledErrors(error));
		})
	);

	@Effect()
	updatesMatriz$ = this.actions$.pipe(
		ofType<matrizActions.LoadUpdatesMatriz>(matrizActions.MatrizActionsType.LoadUpdatesMatriz),
		map(action => action.payload),
		switchMap(idMatriz => this.matrizService.updatesMatriz(idMatriz)),
		map(update => new matrizActions.LoadUpdatesMatrizComplete(update)),
		catchError(error => {
			return observableOf(new matrizActions.HandledErrors(error));
		})
	);
	@Effect()
	deleteMatriz$ = this.actions$.pipe(
		ofType<matrizActions.DeleteMatriz>(matrizActions.MatrizActionsType.DeleteMatriz),
		map(action => action.payload),
		switchMap(id =>
			this.matrizService.deleteMatriz(id).pipe(
				map(() => new matrizActions.DeleteMatrizCompleted()),
				map(() => new matrizActions.LoadM()),
				catchError(error => {
					return observableOf(new matrizActions.HandledErrors(error));
				})
			)
		)
	);
	@Effect()
	getEffectDate$ = this.actions$.pipe(
		ofType<matrizActions.LoadEffectDate>(matrizActions.MatrizActionsType.LoadEffectDate),
		switchMap(action => this.matrizService.getEffectDate(action.payload, action.date).pipe(
			map(effectDate => new matrizActions.LoadEffectDateCompleted(effectDate)),
			catchError(error => {
				return observableOf(new matrizActions.HandledErrors(error));
			})
			)
		)
	);
}
