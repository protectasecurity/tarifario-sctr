import { Component, OnInit } from "@angular/core";
import { MatSlideToggleChange, MatTableDataSource } from "@angular/material";

@Component({
	selector: "app-movements",
	templateUrl: "./movements.component.html",
	styleUrls: ["./movements.component.scss"]
})
export class MovementsComponent implements OnInit {
	displayedColumns: string[] = [
		"movement",
		"date",
		"dayRange",
		"operator",
		"payrollAmount",
		"requirement",
		"exclude",
		"approvalType",
		"clientType",
		"state",
		"actions"
	];
	data = [];
	dataSource: MatTableDataSource<any> = new MatTableDataSource([]);

	pageSize: number = 10;

	ngOnInit() {
		for (let _: number = 0; _ <= 10; _++) {
			this.data.push({
				movement: "Anulación",
				date: "Inicio de vigencia",
				dayRange: {
					rangeMin: "[",
					rangeMax: "]",
					min: 1,
					max: 2,
					value: "[1,4]"
				},
				operator: "Mayor igual que >=",
				payrollAmount: 10000,
				requirement: "Planilla de emisión = planilla de exclusión",
				exclude: "Sábado, domingos y feriados",
				approvalType: "Automática",
				clientType: "Ambos",
				active: true
			});
		}
		this.loadPage(0);
	}

	toggleState(index: number, e: MatSlideToggleChange): void {
		console.log(e.checked);
	}

	onPageChange(event): void {
		this.loadPage(event.pageIndex);
	}

	loadPage(pageIndex: number): void {
		const startIndex = pageIndex * this.pageSize;
		const endIndex = startIndex + this.pageSize;
		this.dataSource = new MatTableDataSource(this.data.slice(startIndex, endIndex));
	}
}
