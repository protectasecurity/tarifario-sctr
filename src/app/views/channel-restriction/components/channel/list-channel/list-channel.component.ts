import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, OnChanges, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { sortArray } from 'app/shared/helpers/utils';
import { Observable } from 'rxjs';
import { AccessMaping, AppModules, EActions } from '../../../../../shared/security/access.mapping';
import { ChannelAgent } from '../../../models/ChannelAgent';
import { Filter } from '../../../models/Filter';
import { Restriction } from '../../../models/Restriction';
import * as fromAction from '../../../state/actions/channel.restriction.actions';
import * as fromReducer from '../../../state/reducers';


@Component({
	selector: 'channel-restriction-list-channel',
	templateUrl: './list-channel.component.html',
	styleUrls: ['./list-channel.component.scss']
})
export class ListChannelComponent implements OnInit {
	myChannelList: ChannelAgent[] = [];
	displayedColumns: string[] = ["description", "actions"];
	filter$: Observable<Filter> = this.store.select(fromReducer.getFilter);
	dataSource: MatTableDataSource<ChannelAgent> = new MatTableDataSource();
	restrictions$: Observable<Restriction[]> = this.store.select(fromReducer.getRestrictions);
	channelAgents$: Observable<ChannelAgent[]> = this.store.select(fromReducer.getChannelAgents);

	@Output()
	onDelete: EventEmitter<any> = new EventEmitter<any>();
	@Output()
	onEdit: EventEmitter<any> = new EventEmitter<any>();

	shCreate: boolean;
	canChange: boolean;
	canDelete: boolean;


	constructor(
		private router: Router,
		private cd: ChangeDetectorRef,
		private permits: AccessMaping,
		private store: Store<fromReducer.ChannelRestrictionState>) { }

	ngOnInit() {
		this.shCreate = this.permits.ShouldDo(AppModules.channels, EActions.create);
		this.canDelete = !this.permits.ShouldDo(AppModules.channels, EActions.delete);
		this.canChange = !this.permits.ShouldDo(AppModules.channels, EActions.changestate);
		this.filter$.subscribe(filter => {
			this.dataSource.filter = JSON.stringify(filter);
		});
		const myChannelSet = new Set();
		this.myChannelList = [];
		this.restrictions$.subscribe(list => {
			list.forEach(item => {
				const size = myChannelSet.size;
				myChannelSet.add(item.channel.id);
				if (myChannelSet.size > size) {
					this.myChannelList.push(item.channel);
				}
			});
			this.dataSource = new MatTableDataSource(this.myChannelList);
			this.dataSource.filterPredicate = this.filterPredicate();
			this.store.dispatch(new fromAction.LoadChannelAgents(this.myChannelList));
		});

	}

	filterPredicate(): (data: ChannelAgent, filter: string) => boolean {
		const myFilterPredicate = function (data: ChannelAgent, filter: string): boolean {
			const searchString = JSON.parse(filter);

			const findDescript = searchString.description
				? searchString.description
					.toString()
					.toLocaleLowerCase()
					.trim()
				: "";

			const descriptionFilter =
				data.description
					.toString()
					.toLocaleLowerCase()
					.trim()
					.indexOf(findDescript) !== -1;

			return descriptionFilter;
		};
		return myFilterPredicate;
	}

	delete(row: any) {
		this.onDelete.emit(row.id);
	}

	constraint(row: any) {
		this.store.dispatch(new fromAction.LoadSelectedChannelAgents(row));
		this.store.dispatch(new fromAction.LoadRestrictionsOfChannel(row.id));
		this.router.navigate([`/channel-restriction/channel/restrictions`]);
	}

}
