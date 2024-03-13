import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatListOption, MatSelectionList } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Use } from '../../../../../shared/models/use.model';
import * as fromAction from '../../../state/actions/channel.restriction.actions';
import * as fromReducer from '../../../state/reducers';

@Component({
	selector: 'channel-restriction-use',
	templateUrl: './use.component.html',
	styleUrls: ['./use.component.scss']
})
export class UseComponent implements OnInit {
	useActivated: Use;
	useCollection: Use[];
	@ViewChild(MatSelectionList) selectionList: MatSelectionList;
	@Output() useSelected: EventEmitter<Use> = new EventEmitter<Use>();
	useCollection$: Observable<Use[]> = this.store.select(fromReducer.getUses);

	constructor(private store: Store<fromReducer.ChannelRestrictionState>) {
		this.store.dispatch(new fromAction.LoadUses);
	}

	ngOnInit() {
		this.selectionList.selectedOptions = new SelectionModel<MatListOption>(false);
		this.useCollection$.subscribe(uses => this.useCollection = uses);
	}

	selectUse(options: MatListOption[]) {
		this.useActivated = (options.length > 0) ? options[0].value : null;
		this.useSelected.emit(this.useActivated);
	}
}
