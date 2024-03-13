import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import * as zonesActions from '../../_state/actions/zones.actions';
import * as fromReducer from '../../_state/reducers';
import { Zone } from '../../models/zone.model';

@Component({
	selector: 'app-zones',
	templateUrl: './zones.component.html',
	styleUrls: ['./zones.component.scss']
})
export class ZonesComponent implements OnInit {
	protected ngUnsubscribe: Subject<any> = new Subject<any>();
	zones$: Observable<Zone[]> = this.store.select(fromReducer.getItems);
	public items: Zone[];
	constructor(
		private store: Store<fromReducer.ZonesState>,
		private router: Router,
		private confirmService: AppConfirmService,
		private actionsSubject$: ActionsSubject
	) {
		this.triggers();
	}

	triggers() {
		this.actionsSubject$
			.pipe(takeUntil(this.ngUnsubscribe))
			.pipe(ofType(zonesActions.ZonesActionTypes.UpdateZoneComplete))
			.subscribe(response => {
				this.store.dispatch(new zonesActions.Load());
				this.router.navigate(["/zones"]);
			});
	}

	ngOnInit() {
		this.store.dispatch(new zonesActions.Load());
	}

	updateStatus(row: Zone) {
		row.active = !row.active;
		this.store.dispatch(new zonesActions.UpdateZoneInit(row));
	}

	drop(zone: Zone) {
		this.store.dispatch(new zonesActions.UpdateZoneInit(zone));
	}

	edit(id: any) {
		this.confirmService
			.confirm({
				title: 'Confirmación',
				message: '¿Está seguro de editar esta zona?',
				showcancel: true
			})
			.subscribe(x => {
				if (x === true) {
					this.router.navigate([`/zones/edit/${id}`]);
				}
			});
	}

	delete(id: any) {
		this.confirmService
			.confirm({
				title: 'Confirmación',
				message: '¿Está seguro de eliminar esta zona?',
				showcancel: true
			})
			.subscribe(x => {
				if (x === true) {
					this.store.dispatch(new zonesActions.DeleteZoneInit(id));
				}
			});
	}
}
