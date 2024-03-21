import { Component, OnInit } from "@angular/core";
import { MatSlideToggleChange, MatTableDataSource } from "@angular/material";

@Component({
	selector: "app-declaration-types",
	templateUrl: "./declaration-types.component.html",
	styleUrls: ["./declaration-types.component.scss"]
})
export class DeclarationTypesComponent implements OnInit {
	displayedColumns: string[] = ["declarationType", "operator", "amount", "approvalType", "clientType", "state"];
	data = [
		{
			declarationType: "Mes adelantado (Declaración regular)",
			operator: null,
			amount: null,
			approvalType: "Automática",
			clientType: "Ambos",
			active: true
		},
		{
			declarationType: "Mes adelantado con regularización",
			operator: "Mayor o igual que >=",
			amount: 100000,
			approvalType: "Automática",
			clientType: "Ambos",
			active: true
		},
		{
			declarationType: "Mes vencido",
			operator: "Mayor o igual que >=",
			amount: 100000,
			approvalType: "Automática",
			clientType: "Ambos",
			active: true
		},
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
