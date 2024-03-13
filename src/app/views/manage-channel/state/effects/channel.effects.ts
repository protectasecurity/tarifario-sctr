import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of as observableOf } from 'rxjs';
import { catchError, map, switchMap } from "rxjs/operators";
import { AgentService } from "../../services/agent.service";
import { ChannelService } from "../../services/channel.service";
import * as channelActions from '../actions/channel.actions';
import { FeeService } from './../../../fee/fee.service';
import { UseService } from '../../../../shared/services/use/use.service';
import { ClassService } from '../../../../shared/services/class/class.service';

@Injectable()
export class ChannelEffects {
	constructor(
		private useService: UseService,
		private classService: ClassService,
		private channelService: ChannelService,
		private router: Router,
		private agentService: AgentService,
		private feeService: FeeService,
		private actions$: Actions) { }

	@Effect()
	getClasses$ = this.actions$.pipe(
		ofType<channelActions.LoadClasses>(channelActions.ChannelActionTypes.LoadClasses),
		switchMap(() => this.classService.list()),
		map(classes => new channelActions.LoadClassesComplete(classes)),
		catchError(error => {
			return observableOf(new channelActions.HandledErrors(error));
		})
	);


	@Effect()
	getUses$ = this.actions$.pipe(
		ofType<channelActions.LoadUses>(channelActions.ChannelActionTypes.LoadUses),
		switchMap(() => this.useService.getUses()),
		map(uses => new channelActions.LoadUsesComplete(uses)),
		catchError(error => {
			return observableOf(new channelActions.HandledErrors(error));
		})
	);

	@Effect()
	getChannels$ = this.actions$.pipe(
		ofType<channelActions.LoadChannels>(channelActions.ChannelActionTypes.LoadChannels),
		switchMap(() => this.channelService.list()),
		map(channelGroups => new channelActions.LoadChannelsComplete(channelGroups)),
		catchError(error => {
			return observableOf(new channelActions.HandledErrors(error));
		})
	);
	@Effect()
	getBrokers$ = this.actions$.pipe(
		ofType<channelActions.LoadBrokers>(channelActions.ChannelActionTypes.LoadBrokers),
		switchMap(action => this.agentService.get(action.payload)),
		map(agents => new channelActions.LoadBrokersComplete(agents)),
		catchError(error => {
			return observableOf(new channelActions.HandledErrors(error));
		})
	);

	@Effect()
	getChannelGroup$ = this.actions$.pipe(
		ofType<channelActions.GetChannelGroup>(channelActions.ChannelActionTypes.GetChannelGroup),
		switchMap(action => this.channelService.getById(action.groupId)),
		map(group => new channelActions.GetChannelGroupComplete(group)),
		catchError(error => {
			return observableOf(new channelActions.HandledErrors(error));
		})
	);

	@Effect()
	getCustomerByName$ = this.actions$.pipe(
		ofType<channelActions.GetCustomerByName>(channelActions.ChannelActionTypes.GetCustomerByName),
		switchMap(action => this.channelService.findCustomerByName(action.name)),
		map(customers => new channelActions.GetCustomerByNameComplete(customers)),
		catchError(error => {
			return observableOf(new channelActions.HandledErrors(error));
		})
	);

	@Effect()
	getMiddlemen$ = this.actions$.pipe(
		ofType<channelActions.LoadMiddlemen>(channelActions.ChannelActionTypes.LoadMiddlemen),
		switchMap(action => this.agentService.get(action.payload)),
		map(agents => new channelActions.LoadMiddlemenComplete(agents)),
		catchError(error => {
			return observableOf(new channelActions.HandledErrors(error));
		})
	);
	@Effect()
	getSalesPoint$ = this.actions$.pipe(
		ofType<channelActions.LoadSalesPoint>(channelActions.ChannelActionTypes.LoadSalesPoint),
		switchMap(action => this.agentService.get(action.payload)),
		map(agents => new channelActions.LoadSalesPointComplete(agents)),
		catchError(error => {
			return observableOf(new channelActions.HandledErrors(error));
		})
	);
	@Effect()
	createChannelGroup$ = this.actions$.pipe(
		ofType<channelActions.AddChannelGroup>(channelActions.ChannelActionTypes.AddChannelGroup),
		switchMap((action) => {
			const newRecord = action.payload;
			return this.agentService.create(newRecord).pipe(
				switchMap(response => {
					/* 	this.router.navigate(['/manage-channels']); */
					return [
						new channelActions.AddChannelGroupComplete(),
						/* 	new channelActions.LoadChannels() */
					];
				})
			);
		}),
		catchError(error => {
			return observableOf(new channelActions.HandledErrors(error));
		})
	);

	@Effect()
	deleteChannelGroup$ = this.actions$.pipe(
		ofType<channelActions.DeleteChannelGroup>(channelActions.ChannelActionTypes.DeleteChannelGroup),
		switchMap(action =>
			this.channelService.delete(action.payload).pipe(
				switchMap(() => {
					return [new channelActions.DeleteChannelGroupComplete(), new channelActions.LoadChannels()];
				})
			)
		),
		catchError(error => {
			return observableOf(new channelActions.HandledErrors(error));
		})
	);

	@Effect()
	updateChannelGroup$ = this.actions$.pipe(
		ofType<channelActions.UpdateChannelGroup>(channelActions.ChannelActionTypes.UpdateChannelGroup),
		switchMap(action =>
			this.channelService.update(action.payload).pipe(
				switchMap(() => {
					this.router.navigate(['/manage-channels']);
					return [new channelActions.UpdateChannelGroupComplete()];
				})
			)
		),
		catchError(error => {
			return observableOf(new channelActions.HandledErrors(error));
		})
	);

	@Effect()
	getFeeCollection$ = this.actions$.pipe(
		ofType<channelActions.LoadFeeCollection>(channelActions.ChannelActionTypes.LoadFeeCollection),
		switchMap(() => this.channelService.getFeeCollection()),
		map(mfees => new channelActions.LoadFeeCollectionComplete(mfees)),
		catchError(error => {
			return observableOf(new channelActions.HandledErrors(error));
		})
	);

}
