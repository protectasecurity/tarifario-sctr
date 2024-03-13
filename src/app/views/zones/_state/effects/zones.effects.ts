import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of as observableOf } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { ZoneService } from '../../zone.service';
import * as ZoneActions from '../actions/zones.actions';
import * as fromRoot from '../reducers';
@Injectable()
export class ZonesEffects {
	constructor(private zoneService: ZoneService, private actions$: Actions) { }

	@Effect()
	getZones$ = this.actions$.pipe(
		ofType<ZoneActions.Load>(ZoneActions.ZonesActionTypes.Load),
		switchMap(() => this.zoneService.getZones()),
		map(mzones => new ZoneActions.LoadComplete(mzones)),
		catchError(error => {
			return observableOf(new ZoneActions.HandledError(error));
		})
	);

	@Effect()
	getLocations$ = this.actions$.pipe(
		ofType<ZoneActions.LoadLocations>(ZoneActions.ZonesActionTypes.LoadLocations),
		switchMap(() => this.zoneService.getLocations()),
		map(mubigeos => new ZoneActions.LoadLocationsComplete(mubigeos)),
		catchError(error => {
			return observableOf(new ZoneActions.HandledError(error));
		})
	);

	@Effect()
	createZoneMasive$ = this.actions$.pipe(
		ofType<ZoneActions.CreateZoneMasiveInit>(ZoneActions.ZonesActionTypes.CreateZoneMasiveInit),
		map(action => action.payload),
		switchMap(setting =>
			this.zoneService.createZoneMasive(setting).pipe(
				map(() => new ZoneActions.CreateZoneMasiveComplete()),
				catchError(error => {
					return observableOf(new ZoneActions.HandledError(error));
				})
			)
		)
	);

	@Effect()
	updateZone$ = this.actions$.pipe(
		ofType<ZoneActions.UpdateZoneInit>(ZoneActions.ZonesActionTypes.UpdateZoneInit),
		map(action => action.payload),
		switchMap(setting =>
			this.zoneService.updateZone(setting).pipe(
				map(() => new ZoneActions.UpdateZoneComplete()),
				catchError(error => {
					return observableOf(new ZoneActions.HandledError(error));
				})
			)
		)
	);

	@Effect()
	deleteZone$ = this.actions$.pipe(
		ofType<ZoneActions.DeleteZoneInit>(ZoneActions.ZonesActionTypes.DeleteZoneInit),
		map(action => action.payload),
		switchMap(setting =>
			this.zoneService.deleteZone(setting).pipe(
				map(() => new ZoneActions.DeleteZoneComplete()),
				map(() => new ZoneActions.Load()),
				catchError(error => {
					return observableOf(new ZoneActions.HandledError(error));
				})
			)
		)
	);

	@Effect()
	getZoneById$ = this.actions$.pipe(
		ofType<ZoneActions.GetZoneById>(ZoneActions.ZonesActionTypes.GetZoneById),
		switchMap(action => this.zoneService.getById(action.zoneId)),
		map(zone => new ZoneActions.GetZoneByIdComplete(zone)),
		catchError(error => {
			return observableOf(new ZoneActions.HandledError(error));
		})
	);
}
