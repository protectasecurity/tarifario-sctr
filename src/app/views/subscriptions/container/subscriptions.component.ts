import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatTabChangeEvent, MatTabGroup } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
	selector: "app-subscriptions",
	templateUrl: "./subscriptions.component.html",
	styleUrls: ["./subscriptions.component.scss"],
	encapsulation: ViewEncapsulation.None
})
export class SubscriptionsComponent implements AfterViewInit {
	private readonly routes: Record<number, string> = {
		0: "tasas",
		1: "nueva-categoria",
		2: "ajuste-tasas",
		3: "reglas-derivacion",
		4: "prima-minima",
		5: "retroactividad",
		6: "tipos-declaracion",
		7: "movimientos",
		8: "correccion-datos",
		9: "comisiones",
		10: "agenciamiento",
		11: "delimitacion"
	};

	@ViewChild("matTabGroup") matTabGroup: MatTabGroup;

	constructor(
		private readonly router: Router,
		private readonly route: ActivatedRoute
	) {
	}

	ngAfterViewInit() {
		this.matTabGroup.selectedIndex = this.route.snapshot.queryParams["tabIndex"] || 0;
	}

	navigate(event: MatTabChangeEvent): void {
		this.router.navigate([`/suscripciones/${this.routes[event.index]}`], {
			queryParams: {
				tabIndex: event.index
			}
		});
	}
}
