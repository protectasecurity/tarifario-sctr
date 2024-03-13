import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { MatListOption, MatSelectionList } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Class } from '../../../../../shared/models/class.model';
import { UseClass } from "../../../../../shared/models/use-class.model";
import { Use } from "../../../../../shared/models/use.model";
import * as fromAction from '../../../state/actions/channel.restriction.actions';
import * as fromReducer from '../../../state/reducers';

@Component({
	selector: 'channel-restriction-class',
	templateUrl: './class.component.html',
	styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit, OnChanges {
	classCollection: Class[];
	listSelected: Class[] = [];
	classCollection$: Observable<UseClass[]> = this.store.select(fromReducer.getClassesByUse);
	@ViewChild(MatSelectionList) selectionList: MatSelectionList;
	@Output() classesSelected: EventEmitter<Class[]> = new EventEmitter<Class[]>();
	@Input() useSelectedIn: Use;
	isCheck: boolean = false;

	constructor(private store: Store<fromReducer.ChannelRestrictionState>) {
	}

	ngOnInit() {
		this.selectionList.selectedOptions = new SelectionModel<MatListOption>(true);
		this.classCollection$.subscribe(classes => {
			if (classes.length > 0) {
				const clazz: Class [] = [];
				classes.forEach(useClass => {
					if (useClass.status === 'ACTIVE') {
						clazz.push(useClass.clazz);
					}
				});
				this.classCollection = clazz;
			} else {
				this.listSelected = [];
				this.isCheck = false;
				this.classCollection = [];
			}
			}
		);
	}
	ngOnChanges(changes: SimpleChanges): void {
		if (changes.useSelectedIn !== undefined) {
			this.listSelected = [];
			this.classesSelected.emit([]);
			this.reloadClass(changes.useSelectedIn.currentValue);
		}
	}

	reloadClass(event) {
		if (event !== undefined ) {
			this.store.dispatch(new fromAction.LoadClassesByUse(event.id));
		}
	}
	selectClass(options: MatListOption[]) {
		this.listSelected = [];
		options.forEach(o => this.listSelected.push(o.value));
		this.classesSelected.emit(this.listSelected);
	}

	onSelectedAll(e: any) {
		this.listSelected = [];
		if (e.checked) {
			this.isCheck = true;
			this.selectionList.selectAll();
			this.selectionList.selectedOptions.selected.forEach(o => this.listSelected.push(o.value));
			this.classesSelected.emit(this.listSelected);
		} else {
			this.isCheck = false;
			this.selectionList.deselectAll();
			this.classesSelected.emit(this.listSelected);
		}
	}
}
