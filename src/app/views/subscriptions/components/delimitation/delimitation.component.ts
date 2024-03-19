import { Component, OnInit } from "@angular/core";
import { MatSlideToggleChange, MatTableDataSource } from "@angular/material";

@Component({
	selector: "app-delimitation",
	templateUrl: "./delimitation.component.html",
	styleUrls: ["./delimitation.component.scss"]
})
export class DelimitationComponent implements OnInit {
	displayedColumns: string[] = ["economicActivity", "approvalType", "clientType", "state"];
	data = [];
	dataSource: MatTableDataSource<any> = new MatTableDataSource([]);

	pageSize: number = 10;

	ngOnInit() {
		for (let _: number = 1; _ <= 15; _++) {
			this.data.push({
				economicActivity: "ACTIVIDADES DE ORGANIZACIONES, ASOCIACIONES Y/O CANDIDATOS",
				approvalType: "Suscripción",
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
