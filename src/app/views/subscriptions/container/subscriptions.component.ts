import { Component } from "@angular/core";
import { MatTabChangeEvent } from "@angular/material";
import { Router } from "@angular/router";

@Component({
	selector: "app-subscriptions",
	templateUrl: "./subscriptions.component.html",
	styleUrls: ["./subscriptions.component.scss"]
})
export class SubscriptionsComponent {
	private readonly routes: Record<number, string> = {
		0: "tasas",
		1: "ajuste-tasas",
		2: "prima-minima",
		3: "retroactividad",
		4: "tipos-declaracion",
		5: "movimientos",
		6: "correccion-datos",
		7: "comisiones",
		8: "agenciamiento",
		9: "delimitacion"
	};

	constructor(private readonly router: Router) {
	}

	navigate(event: MatTabChangeEvent): void {
		this.router.navigate([`/suscripciones/${this.routes[event.index]}`]);
	}
}
