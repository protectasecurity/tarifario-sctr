import { Component, OnInit } from "@angular/core";
import { MatSlideToggleChange, MatTableDataSource } from "@angular/material";

@Component({
	selector: "app-new-category",
	templateUrl: "./new-category.component.html",
	styleUrls: ["./new-category.component.scss"]
})
export class NewCategoryComponent implements OnInit {
	displayedColumns: string[] = ["lastApprove", "rateType", "newCategory", "approveType", "clientType", "actions"];

	data = [
		{
			lastApprove: "Automática",
			rateType: "Flat",
			newCategory: "Si",
			approveType: "Automática",
			clientType: "Ambos",
			active: true
		},
		{
			lastApprove: "Suscripción",
			rateType: "Por categoría",
			newCategory: "Si",
			approveType: "Suscripción",
			clientType: "Ambos",
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
