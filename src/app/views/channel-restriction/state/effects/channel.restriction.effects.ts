import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, flatMap } from 'rxjs/operators';
import { ClassService } from '../../../../shared/services/class/class.service';
import { UseClassService } from "../../../../shared/services/use-class/use-class.service";
import { UseService } from '../../../../shared/services/use/use.service';
import { AgentService } from '../../services/agent.service';
import { RestrictionService } from '../../services/restriction.service';
import * as moduleActions from '../actions/channel.restriction.actions';

@Injectable()
export class ChannelRestrictionEffects {
	constructor(
		private restrictionService: RestrictionService,
		private useService: UseService,
		private classService: ClassService,
		private agentService: AgentService,
		private useClassService: UseClassService,
		private actions$: Actions) { }

	@Effect()
	loadAgent$ = this.actions$.pipe(
		ofType<moduleActions.LoadAgents>(moduleActions.ChannelRestrictionActionType.LoadAgents),
		switchMap((action) => this.agentService.get(action.payload)),
		map((agents) => new moduleActions.LoadAgentsComplete(agents)),
		catchError(error => {
			return of(new moduleActions.HandledErrors(error));
		})
	);

	@Effect()
	loadRestrictions$ = this.actions$.pipe(
		ofType<moduleActions.LoadRestrictions>(moduleActions.ChannelRestrictionActionType.LoadRestrictions),
		switchMap(() => this.restrictionService.list()),
		map((restrictions) => {
			return new moduleActions.LoadRestrictionsComplete(restrictions);
		}),
		catchError(error => {
			return of(new moduleActions.HandledErrors(error));
		})
	);

	@Effect()
	loadRestrictionOfChannel$ = this.actions$.pipe(
		ofType<moduleActions.LoadRestrictionsOfChannel>(moduleActions.ChannelRestrictionActionType.LoadRestrictionsOfChannel),
		switchMap((action) => this.restrictionService.getByChannelId(action.payload)),
		map((restrictions) => {
			return new moduleActions.LoadRestrictionsOfChannelComplete(restrictions);
		}),
		catchError(error => {
			return of(new moduleActions.HandledErrors(error));
		})
	);

	@Effect()
	addRestriction$ = this.actions$.pipe(
		ofType<moduleActions.AddRestriction>(moduleActions.ChannelRestrictionActionType.AddRestriction),
		map(action => action.payload),
		flatMap((restriction) => {
			return this.restrictionService.add(restriction).pipe(
				map((newRestriction) => new moduleActions.AddRestrictionComplete(newRestriction)),
				catchError(error => {
					return of(new moduleActions.HandledErrors(error));
				})
			);
		}));

	@Effect()
	updateRestriction$ = this.actions$.pipe(
		ofType<moduleActions.UpdateRestriction>(moduleActions.ChannelRestrictionActionType.UpdateRestriction),
		map(action => action.payload),
		switchMap((restriction) =>
			this.restrictionService.update(restriction).pipe(
				map((newRestriction) => new moduleActions.UpdateRestrictionComplete(newRestriction)),
				catchError(error => {
					return of(new moduleActions.HandledErrors(error));
				})
			)),
	);

	@Effect()
	deleteRestriction$ = this.actions$.pipe(
		ofType<moduleActions.DeleteRestriction>(moduleActions.ChannelRestrictionActionType.DeleteRestriction),
		map(action => action.payload),
		switchMap(id =>
			this.restrictionService.delete(id).pipe(
				map((newRestriction) => new moduleActions.DeleteRestrictionComplete(newRestriction)),
				catchError(error => {
					return of(new moduleActions.HandledErrors(error));
				})
			)
		)
	);

	@Effect()
	getUses$ = this.actions$.pipe(
		ofType<moduleActions.LoadUses>(moduleActions.ChannelRestrictionActionType.LoadUses),
		switchMap(() => this.useService.getUses()),
		map(uses => new moduleActions.LoadUsesComplete(uses)),
		catchError(error => {
			return of(new moduleActions.HandledErrors(error));
		})
	);

	@Effect()
	getClasses$ = this.actions$.pipe(
		ofType<moduleActions.LoadClasses>(moduleActions.ChannelRestrictionActionType.LoadClasses),
		switchMap(() => this.classService.list()),
		map(classes => new moduleActions.LoadClassesComplete(classes)),
		catchError(error => {
			return of(new moduleActions.HandledErrors(error));
		})
	);

	@Effect()
	getClassesByUse$ = this.actions$.pipe(
		ofType<moduleActions.LoadClassesByUse>(moduleActions.ChannelRestrictionActionType.LoadClassesByUse),
		switchMap((action) => this.useClassService.getClassesByIdUse(action.payload)),
		map(result => new moduleActions.LoadClassesByUseComplete(result)),
		catchError(error => {
			return of(new moduleActions.HandledErrors(error));
		})
	);
}
