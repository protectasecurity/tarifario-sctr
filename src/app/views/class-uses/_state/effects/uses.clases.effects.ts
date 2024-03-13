import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of as observableOf } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { ClassService } from "../../../../shared/services/class/class.service";
import { UseClassService } from "../../../../shared/services/use-class/use-class.service";
import { UseService } from "../../../../shared/services/use/use.service";
import * as riskActions from "../actions/uses.clases.actions";
import { LoadUseClassesComplete, UsesClassActionTypes } from "../actions/uses.clases.actions";
import * as fromRoot from "../reducers";

@Injectable()
export class UsesClaseEffect {
	constructor(
		private useService: UseService,
		private useClasseService: UseClassService,
		private classService: ClassService,
		private actions$: Actions,
		private store: Store<fromRoot.UsesClasesState>,
		private router: Router,

	) { }


	@Effect()
	getClasses$ = this.actions$.pipe(
		ofType<riskActions.LoadClasses>(riskActions.UsesClassActionTypes.LoadClasses),
		switchMap(() => this.classService.list()),
		map(classes => new riskActions.LoadClassesComplete(classes)),
		catchError(error => {
			return observableOf(new riskActions.HandledErrors(error));
		})
	);


	@Effect()
	getUses$ = this.actions$.pipe(
		ofType<riskActions.LoadUses>(riskActions.UsesClassActionTypes.LoadUses),
		switchMap(() => this.useService.getUses()),
		switchMap(uses => [new riskActions.LoadUsesComplete(uses), new riskActions.UpdateUseSelected(uses.sort((a, b) => a.order - b.order)[0].id)]),
		catchError(error => {
			return observableOf(new riskActions.HandledErrors(error));
		})
	);

	@Effect()
	createUseClasses$ = this.actions$.pipe(
		ofType<riskActions.CreateUseClasses>(riskActions.UsesClassActionTypes.CreateUseClasses),
		switchMap(value => {
			return this.useClasseService.createUseClass(value.payload)
				.pipe(switchMap(() => {
					this.router.navigate(['/class-uses']);
					return [new riskActions.LoadUseClasses()];
				}),
					catchError(error => {
						return observableOf(new riskActions.HandledErrors(error));
					}));
		})
	);
	@Effect()
	updateStateUseClass$ = this.actions$.pipe(
		ofType<riskActions.UpdateUseClassState>(riskActions.UsesClassActionTypes.UpdateUseClassState),
		switchMap(value => {
			return this.useClasseService.updateStateUseClass(value.payload).pipe(
				switchMap(response => {
					this.router.navigate(['/class-uses']);
					return [new riskActions.LoadUseClasses(), new riskActions.UpdateUseClassStateComplete()];
				} ),
				catchError(err => {
					return observableOf(new riskActions.HandledErrors(err));
				})
			);
		})
	);
	@Effect()
	deleteUseClass$ = this.actions$.pipe(
		ofType<riskActions.DeleteUseClass>(riskActions.UsesClassActionTypes.DeleteUseClass),
		switchMap(action => {
			return this.useClasseService.deleteUseClass(action.payload).pipe(
				switchMap(() => [new riskActions.DeleteUseClassComplete(), new riskActions.LoadUseClasses()])
			);
		}),
		catchError(err => observableOf(new riskActions.HandledErrors(err)))
	);
	@Effect()
	getUseClasses$ = this.actions$.pipe(
		ofType<riskActions.LoadUseClasses>(UsesClassActionTypes.LoadUseClasses),
		switchMap(action => {
			return this.useClasseService.loadUseClasses().pipe(
				switchMap(response => [new LoadUseClassesComplete(response)])
			);
		}),
		catchError(err => observableOf(new riskActions.HandledErrors(err)))
	);
}
