import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ActionsSubject, Store } from "@ngrx/store";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AppConfirmService } from "../../../../shared/services/app-confirm/app-confirm.service";
import * as zonesActions from "../../../zones/_state/actions/zones.actions";
import * as fromReducer from "../../_state/reducers";
import { Ubigeo } from "../../models/ubigeo.model";
import { Zone } from "../../models/zone.model";

@Component({
	selector: "app-zones-create",
	templateUrl: "./zones-create.component.html",
	styleUrls: ["./zones-create.component.scss"]
})
export class ZonesCreateComponent implements OnInit {
	protected ngUnsubscribe: Subject<any> = new Subject<any>();
	zone$: Observable<Zone> = this.store.select(fromReducer.getZoneById);
	ubicaciones$: Observable<Ubigeo[]> = this.store.select(fromReducer.getLocations);
	Zones$: Observable<Zone[]> = this.store.select(fromReducer.getItems);

	constructor(
		private store: Store<fromReducer.ZonesState>,
		private activatedRoute: ActivatedRoute,
		private actionsSubject$: ActionsSubject,
		private spinner: NgxSpinnerService,
		private confirmService: AppConfirmService,
		private router: Router
	) {
	}

	ngOnInit() {
		this.triggers();
		const zoneId = this.activatedRoute.snapshot.params["zoneId"];
		if (zoneId) {
			this.store.dispatch(new zonesActions.GetZoneById(zoneId));
		} else {
			this.store.dispatch(new zonesActions.SetDefaultZone());
		}
		this.store.dispatch(new zonesActions.Load());
		this.store.dispatch(new zonesActions.LoadLocations());
	}

	triggers() {
		this.actionsSubject$
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe(response => {
				switch (response.type) {
					case zonesActions.ZonesActionTypes.CreateZoneMasiveComplete:
						this.redirect();
						break;
					case zonesActions.ZonesActionTypes.UpdateZoneComplete:
						this.redirect();
						break;
					case zonesActions.ZonesActionTypes.GetZoneById:
						this.spinner.show();
						break;
					case zonesActions.ZonesActionTypes.GetZoneByIdComplete:
						this.spinner.hide();
						break;
				}
			});
	}

	addzone(event: any): void {
		this.confirmService
			.confirm({
				title: "Confirmación",
				message: "¿Está seguro de guardar esta zona?",
				showcancel: true
			})
			.subscribe(x => {
				if (x === true) {
					this.store.dispatch(new zonesActions.CreateZoneMasiveInit(event));
				}
			});
	}

	updatezone(event: any): void {
		this.confirmService
			.confirm({
				title: "Confirmación",
				message: "¿Está seguro de guardar esta zona?",
				showcancel: true
			})
			.subscribe(x => {
				if (x === true) {
					const zone: Zone = Zone.CreateInstance(event);
					this.store.dispatch(new zonesActions.UpdateZoneInit(zone));
				}
			});
	}

	redirect(): void {
		this.router.navigate(["/zones"]);
	}


}
