import { Component, OnInit } from "@angular/core";
import { MatSlideToggleChange, MatTableDataSource } from "@angular/material";

@Component({
	selector: "app-rate-adjustment",
	templateUrl: "./rate-adjustment.component.html",
	styleUrls: ["./rate-adjustment.component.scss"]
})
export class RateAdjustmentComponent implements OnInit {
	displayedColumns: string[] = ["lastRate", "approveType", "clientType", "actions"];

	data = [
		{
			lastRate: "Aumento",
			approveType: "Automática",
			clientType: "Privado",
			active: true
		},
		{
			lastRate: "Disminución",
			approveType: "Suscripción",
			clientType: "Privado",
			active: true
		}
	];
	dataSource: MatTableDataSource<any> = new MatTableDataSource([]);

	pageSize: number = 10;

	ngOnInit() {
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
