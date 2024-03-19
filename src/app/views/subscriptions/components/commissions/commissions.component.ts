import { Component, OnInit } from "@angular/core";
import { MatSlideToggleChange, MatTableDataSource } from "@angular/material";

@Component({
	selector: "app-commissions",
	templateUrl: "./commissions.component.html",
	styleUrls: ["./commissions.component.scss"]
})
export class CommissionsComponent implements OnInit {
	displayedColumns: string[] = [
		"commissionType",
		"operator",
		"reference",
		"value",
		"valueType",
		"approvalType",
		"clientType",
		"state",
		"actions"
	];
	data = [];
	dataSource: MatTableDataSource<any> = new MatTableDataSource([]);

	pageSize: number = 10;

	ngOnInit() {
		for (let _ = 1; _ <= 5; _++) {
			this.data.push({
				commissionType: "Porcentaje de comisión (tasa de tarifario)",
				operator: "Menor o igual que <=",
				reference: "Tasa del tarifario",
				value: 20,
				valueType: "%",
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
