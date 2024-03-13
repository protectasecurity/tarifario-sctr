import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TypeTokenServices } from '../../../../shared/services/typeToken.services';
import { CreateRestrictionDialogComponent } from '../../components/restriction/create-restriction-dialog/create-restriction-dialog.component';
import { ChannelAgent } from '../../models/ChannelAgent';
import { Restriction } from '../../models/Restriction';
import * as fromAction from '../../state/actions/channel.restriction.actions';
import * as fromReducer from '../../state/reducers';

@Component({
	selector: 'channel-restriction-manage-restriction',
	templateUrl: './manage-restriction.component.html',
	styleUrls: ['./manage-restriction.component.scss']
})
export class ManageRestrictionComponent implements OnInit {
	selectedChannel: ChannelAgent;
	restrictionOfChannel: Restriction[] = [];
	selectedChannel$: Observable<ChannelAgent> = this.store.select(fromReducer.getSelectedChannel);
	restrictionOfChannel$: Observable<Restriction[]> = this.store.select(fromReducer.getRestrictionsOfChannel);

	constructor(
		private store: Store<fromReducer.ChannelRestrictionState>,
		public router: Router,
		private typeTokenServices: TypeTokenServices,
		public dialog: MatDialog) {
		if (this.typeTokenServices.getToken() === 'SCTR') {
			this.router.navigate(['/']);
		}
	}

	ngOnInit() {
		this.selectedChannel$.subscribe(channel => {
			this.selectedChannel = channel;
			if (channel != null) {
				this.store.dispatch(new fromAction.LoadRestrictionsOfChannel(this.selectedChannel.id));
			}
		});
		this.restrictionOfChannel$.subscribe(list => this.restrictionOfChannel = list);
	}

	openDialog(): void {
		const dialogRef = this.dialog.open(CreateRestrictionDialogComponent, {
			width: "800px",
			data: { nameChannel: this.selectedChannel.description }
		});
		dialogRef.afterClosed().subscribe((result: Restriction[]) => {
			if (result) {
				this.addNewRestriction(result);
			}
		});
	}

	addNewRestriction(result: Restriction[]) {
		if (this.restrictionOfChannel.length === 0) {
			result.forEach(item => this.store.dispatch(new fromAction.AddRestriction(item)));
		} else {
			result.forEach(constraint => {
				if (this.validRestriction(constraint)) {
					this.store.dispatch(new fromAction.AddRestriction(constraint));
				}
			});
		}
	}

	validRestriction(newRestriction: Restriction) {
		for (let i = 0; i < this.restrictionOfChannel.length; i++) {
			const item = this.restrictionOfChannel[i];
			item.initialDate = new Date(item.initialDate);
			item.endDate = new Date(item.endDate);
			if (((newRestriction.initialDate.getTime() >= item.initialDate.getTime()
				&& newRestriction.initialDate.getTime() <= item.endDate.getTime())
				|| (newRestriction.endDate.getTime() >= item.initialDate.getTime()
					&& newRestriction.endDate.getTime() <= item.endDate.getTime()))
				&& newRestriction.use.id === item.use.id
				&& newRestriction.clazz.id === item.clazz.id
			) {
				return false;
			}
		}
		return true;
	}

}
