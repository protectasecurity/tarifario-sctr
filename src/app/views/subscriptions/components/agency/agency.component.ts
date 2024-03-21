import { Component, OnInit } from "@angular/core";
import { MatSlideToggleChange, MatTableDataSource } from "@angular/material";

@Component({
	selector: "app-agency",
	templateUrl: "./agency.component.html",
	styleUrls: ["./agency.component.scss"]
})
export class AgencyComponent implements OnInit {
	displayedColumns: string[] = [
		"agencyType",
		"condition1",
		"operator",
		"condition2",
		"valueType",
		"requirement",
		"clientType",
		"state",
		"actions"
	];
	data = [];
	dataSource: MatTableDataSource<any> = new MatTableDataSource([]);

	pageSize: number = 10;

	ngOnInit() {
		for (let _ = 1; _ <= 3; _++) {
			this.data.push({
				agencyType: "Actual agenciamiento sin movimiento",
				condition1: "Inactividad",
				operator: "Mayor o igual que >=",
				condition2: 6,
				valueType: "Meses",
				requirement: "Carta de nombre",
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
