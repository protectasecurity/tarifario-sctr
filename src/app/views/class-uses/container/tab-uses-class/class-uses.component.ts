import { Component, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import { Class } from "../../../../shared/models/class.model";
import { Use } from "../../../../shared/models/use.model";
import * as usesActions from "../../_state/actions/uses.clases.actions";
import * as fromReducer from "../../_state/reducers";


@Component({
	selector: 'app-class-uses',
	templateUrl: './class-uses.component.html',
	styleUrls: ['./class-uses.component.css']
})
export class ClassUsesComponent implements OnInit {
	uses$: Observable<Use[]> = this.store.select(fromReducer.getUses);
	class$: Observable<Class[]> = this.store.select(fromReducer.getClasses);
	protected ngUnsubscribe: Subject<any> = new Subject<any>();

	constructor(private store: Store<fromReducer.UsesClasesState>) {
	}

	ngOnInit() {
		this.store.dispatch(new usesActions.LoadUses());
		this.store.dispatch(new usesActions.LoadClasses());

	}
}
