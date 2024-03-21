import { Component, OnInit } from "@angular/core";
import { MatSlideToggleChange, MatTableDataSource } from "@angular/material";

@Component({
	selector: "app-data-correction",
	templateUrl: "./data-correction.component.html",
	styleUrls: ["./data-correction.component.scss"]
})
export class DataCorrectionComponent implements OnInit {
	displayedColumns: string[] = [
		"dataList",
		"operator",
		"condition",
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
		for (let _ = 0; _ <= 10; _++) {
			this.data.push({
				dataList: "Cambio de letra de nombres",
				operator: "Menor o igual que <=",
				condition: "La nueva tasa es igual a la anterior",
				valueType: "Años cronológicos",
				approvalType: "Plataforma digital",
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
