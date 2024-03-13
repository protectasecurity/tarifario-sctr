import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { Class } from "../../../../shared/models/class.model";
import { UseClass } from "../../../../shared/models/use-class.model";
import { Use } from "../../../../shared/models/use.model";
import * as usesActions from "../../_state/actions/uses.clases.actions";
import * as fromReducer from "../../_state/reducers";

@Component({
	selector: 'app-use-class-container',
	templateUrl: './use-class-container.component.html',
	styleUrls: ['./use-class-container.component.scss']
})
export class UseClassContainerComponent implements OnInit {
	uses$: Observable<Use[]> =  this.store.select(fromReducer.getUses);
	class$: Observable<Class[]> = this.store.select(fromReducer.getClasses);
	uses: Use [];
	classes: Class[];
	data: UseClass[];
	constructor(private store: Store<fromReducer.UsesClasesState>, private activatedRoute: ActivatedRoute) { }
	ngOnInit() {
		this.store.dispatch(new usesActions.LoadUses());
		this.store.dispatch(new usesActions.LoadClasses());
		this.uses$.subscribe(u => this.uses = u);
		this.class$.subscribe(c => this.classes = c);
		const lista = JSON.parse(this.activatedRoute.snapshot.params['data']);
		this.data = lista;
	}

	save(useClass: UseClass) {
		this.store.dispatch(new usesActions.CreateUseClasses(useClass));
	}

}
