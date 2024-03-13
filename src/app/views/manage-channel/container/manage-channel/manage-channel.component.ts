import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { Fee } from 'app/views/fee/models/fee.model';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Channel } from '../../models/Channels';
import { ManageChannelGroup } from '../../models/ManageChannelGroup';
import * as channelActions from '../../state/actions/channel.actions';
import * as fromReducer from '../../state/reducers';
import { ILinkedChannel } from './../../../fee/models/tariffmatrix.model';


@Component({
	selector: 'app-manage-channel',
	templateUrl: './manage-channel.component.html',
	styleUrls: ['./manage-channel.component.scss']
})
export class ManageChannelComponent implements OnInit {
	protected ngUnsubscribe: Subject<any> = new Subject<any>();
	channels$: Observable<Channel[]> = this.store.select(fromReducer.getChannels);
	fees$: Observable<Fee[]> = this.store.select(fromReducer.getFeeCollection);

	linkedchannels: any[];

	constructor(
		private store: Store<fromReducer.ChannelState>,
		private router: Router,
		private confirmService: AppConfirmService,
		private actionsSubject$: ActionsSubject
	) {
		this.triggers();
	}
	triggers() {
		this.linkedchannels = [];
		this.fees$.subscribe(arr => {
			const mchann = [];
			for (let index = 0; index < arr.length; index++) {
				const element = arr[index];
				for (let idx = 0; idx < element.linkedchannels.length; idx++) {
					const mChannel = element.linkedchannels[idx];
					mchann.push(mChannel.channelGroup);
				}
			}
			this.linkedchannels = mchann;
		});
		this.actionsSubject$
			.pipe(takeUntil(this.ngUnsubscribe))
			.pipe(ofType(channelActions.ChannelActionTypes.UpdateChannelGroupComplete))
			.subscribe(response => {
				this.store.dispatch(new channelActions.LoadChannels());
			});
	}
	ngOnInit() {
		this.store.dispatch(new channelActions.LoadChannels());
		this.store.dispatch(new channelActions.LoadFeeCollection());
	}

	delete(groupId: any) {
		let exists: boolean = false;
		for (let index = 0; index < this.linkedchannels.length; index++) {
			const element = this.linkedchannels[index];
			if (element.id === groupId) {
				exists = true;
				break;
			}
		}

		if (exists) {
			this.confirmService.confirm({
				title: 'Error',
				message: 'El canal seleccionado no se puede eliminar. (Se encuentra registrado en una o más tarifas)',
				showcancel: false
			});
			return;
		}

		this.confirmService
			.confirm({
				title: "Confirmación",
				message: "¿Está seguro de eliminar el grupo de canal?",
				showcancel: true
			})
			.subscribe(x => {
				if (x === true) {
					this.store.dispatch(new channelActions.DeleteChannelGroup(groupId));
				}
			});
	}
	edit(groupId: any) {
		this.router.navigate([`/manage-channels/edit/${groupId}`]);
	}

	constraints(groupId: any) {
		this.router.navigate([`/manage-channels/constraint/${groupId}`]);
	}

	updateStatus(row: ManageChannelGroup) {
		this.store.dispatch(new channelActions.UpdateChannelGroup(row));
	}
}
