import { Component, OnInit } from "@angular/core";
import { MatSlideToggleChange, MatTableDataSource } from "@angular/material";

@Component({
	selector: "app-derivation-rules",
	templateUrl: "./derivation-rules.component.html",
	styleUrls: ["./derivation-rules.component.scss"]
})
export class DerivationRulesComponent implements OnInit {
	displayedColumns: string[] = ["condition", "operator", "value", "valueType", "quotationType", "approvalType", "clientType", "state"];

	data = [
		{
			condition: "Número de trabajadares",
			operator: "Mayor que >",
			value: 300,
			valueType: "Nominal",
			quotationType: "Ambos",
			approvalType: "Suscripción",
			clientType: "Ambos",
			active: true
		},
		{
			condition: "Monto de planilla",
			operator: "Mayor que >",
			value: 300000,
			valueType: "Nominal",
			quotationType: "Ambos",
			approvalType: "Suscripción",
			clientType: "Ambos",
			active: true
		},
		{
			condition: "Edad mínima de ingreso",
			operator: "Menor que <",
			value: 18,
			valueType: "Años cronológicos",
			quotationType: "Con planilla",
			approvalType: "Suscripción",
			clientType: "Ambos",
			active: true
		},
		{
			condition: "Edad máxima de ingreso",
			operator: "Menor que <",
			value: 65,
			valueType: "Años cronológicos",
			quotationType: "Con planilla",
			approvalType: "Suscripción",
			clientType: "Ambos",
			active: true
		},
		{
			condition: "RMA",
			operator: "Mayor que >",
			value: 10,
			valueType: "%",
			quotationType: "Con planilla",
			approvalType: "Suscripción",
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
