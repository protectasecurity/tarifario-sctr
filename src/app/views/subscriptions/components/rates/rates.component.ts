import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material";

@Component({
	selector: "app-rates",
	templateUrl: "./rates.component.html",
	styleUrls: ["./rates.component.scss"]
})
export class RatesComponent implements OnInit {
	displayedColumns: string[] = ["tariffRate", "type", "clientType", "actions"];
	types: string[] = ["Automática", "Suscripción"];
	clientTypes: string[] = ["Público", "Privado", "Ambos"];

	optionsType = [
		{
			type: 1,
			desc: ">="
		},
		{
			type: 2,
			desc: "<"
		},
		{
			type: 3,
			desc: "=="
		}
	];

	data = [
		{
			description: "Mayor o igual que",
			tariffRate: 1,
			type: "Automática",
			clientType: "Privado"
		},
		{
			description: "Menor que",
			tariffRate: 2,
			type: "Suscripción",
			clientType: "Público"
		},
		{
			description: "Igual que",
			tariffRate: 3,
			type: "Suscripción",
			clientType: "Público"
		},
		{
			description: "Mayor o igual que",
			tariffRate: 1,
			type: "Automática",
			clientType: "Ambos"
		},
		{
			description: "Menor que",
			tariffRate: 2,
			type: "Suscripción",
			clientType: "Ambos"
		}
	];
	dataSource: MatTableDataSource<any> = new MatTableDataSource([]);

	pageSize: number = 10;

	ngOnInit() {
		this.loadPage(0);
	}

	removeItem(index: number): void {
		this.data.splice(index, 1);
		this.dataSource = new MatTableDataSource(this.data);
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
