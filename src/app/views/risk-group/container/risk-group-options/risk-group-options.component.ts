import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Brand } from '../../../../shared/models/brand.model';
import { Class, SubGroups } from '../../../../shared/models/class.model';
import { Use } from "../../../../shared/models/use.model";
import { UseClass } from "../../../../shared/models/use-class.model";
import * as riskActions from '../../_state/actions/risk.actions';
import * as fromReducer from '../../_state/reducers';
export interface DialogData {
	data: SubGroups;
	uso: Use;
}
@Component({
	selector: 'app-risk-group-options',
	templateUrl: './risk-group-options.component.html',
	styleUrls: ['./risk-group-options.component.scss']
})
export class RiskGroupOptionsComponent implements OnInit {
	classesByUse$: Observable<UseClass[]> = this.store.select(fromReducer.getClassesByUse);
	classes: Class [] = [];
	brands$: Observable<Brand[]> = this.store.select(fromReducer.getBrandsByClass);
	existingSubGroups: SubGroups = null;
	editionSubGroup: SubGroups;

	constructor(private store: Store<fromReducer.RiskState>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
		if (data.uso ) {
			this.store.dispatch(new riskActions.LoadClassesByUse(data.uso.id));
		}

		if (data.data) {
			this.editionSubGroup = data.data;
		}
	}

	ngOnInit() {
		this.classesByUse$.subscribe(useClass =>  {
			useClass.forEach(value => {
				if (!this.searchIdClassIsPresent(value.clazz.id) && value.status === 'ACTIVE') {
					this.classes.push(value.clazz);
				} else {
					if (this.editionSubGroup != null && value.status === 'INACTIVE') {
						if (this.editionSubGroup.vehicleClass.id.toString() === value.clazz.id.toString()) {
							this.classes.push(this.editionSubGroup.vehicleClass);
						}
					}
				}
			});
		});
	}

	searchIdClassIsPresent(id: string): boolean {
		return this.classes.find(c => c.id === id ) !== undefined;
	}

	loadBrandsByClass(classId: string) {
		this.store.dispatch(new riskActions.LoadBrandsByClass(classId));
	}
}
