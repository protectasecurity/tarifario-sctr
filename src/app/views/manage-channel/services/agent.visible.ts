import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";


interface VisibilityFilter {
	name: string;
	isChecked: boolean;
	isDisabled: boolean;
}


@Injectable({
	providedIn: "root"
})
export class AgentVisible {
	private visible: VisibilityFilter[];
	private subject = new BehaviorSubject(this.visible);

	constructor() {}

	public getInstance(): Observable<VisibilityFilter[]> {
		return this.subject.asObservable();
	}

	public fetchAll() {
		this.visible = [
			{ name: "Corredores", isChecked: true, isDisabled: true },
			{ name: "Intermediarios", isChecked: true, isDisabled: true },
			{ name: "Puntos de Venta", isChecked: false, isDisabled: false },
			{ name: "Clientes", isChecked: false, isDisabled: false }
		];
		this.refresh();
	}
	private refresh() {
		this.subject.next(this.visible);
	}

	public setVisibility(text, value) {
		for (let i = 0; i < this.visible.length; i++) {
			if (this.visible[i].name === text) {
				this.visible[i].isChecked = value;
			}
		}
		this.refresh();
	}

}
