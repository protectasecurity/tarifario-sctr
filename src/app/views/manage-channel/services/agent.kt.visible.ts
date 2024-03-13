import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";


interface VisibilityFilter {
	name: string;
	isChecked: boolean;
	type: string;
	filter: string;
}

interface GroupRol {
	type: string;
	hasSelected: boolean;
	agents: VisibilityFilter[];

}


@Injectable({
	providedIn: "root"
})
export class AgentKtVisible {
	private visible: GroupRol[];
	private subject = new BehaviorSubject(this.visible);

	constructor() {
	}

	public getInstance(): Observable<GroupRol[]> {
		return this.subject.asObservable();
	}

	public fetchAll() {
		this.visible = [
			{
				type: "broker", hasSelected: false, agents: [
					{ name: "Corredores", isChecked: false, type: "broker", filter: "9,6" },
					{ name: "Directos", isChecked: false, type: "broker", filter: "8" }
				]
			},
			{
				type: "middlemen", hasSelected: false, agents: [
					{ name: "Comercializadores", isChecked: false, type: "middlemen", filter: "10" },
					{ name: "Banca Seguros", isChecked: false, type: "middlemen", filter: "11" }
				]
			},
			{
				type: "pointsofpoints", hasSelected: false, agents: [
					{ name: "Puntos de Venta", isChecked: false, type: "pointsofpoints", filter: "9,7" }
				]
			},
			{
				type: "customer", hasSelected: false, agents: [
					{ name: "Clientes", isChecked: false, type: "customer", filter: "9,8" }
				]
			}
		];
		this.refresh();
	}

	private refresh() {
		this.subject.next(this.visible);
	}

	public setVisibility(text, type, value) {
		for (let i = 0; i < this.visible.length; i++) {
			if (this.visible[i].type === type) {
				this.visible[i].hasSelected = value;
				this.visible[i].agents.forEach((value1, index) => {
					if (value1.name === text) {
						value1.isChecked = value;
					} else {
						value1.isChecked = false;
					}
				});
			}
		}
		this.refresh();
	}

}
