import { Component, OnInit } from "@angular/core";
import { MatSlideToggleChange, MatTableDataSource } from "@angular/material";

@Component({
	selector: "app-rates",
	templateUrl: "./rates.component.html",
	styleUrls: ["./rates.component.scss"]
})
export class RatesComponent implements OnInit {
	displayedColumns: string[] = ["tariffRate", "type", "clientType", "actions"];
	data = [
		{
			tariffRate: "Mayor o igual que >=",
			type: "Automática",
			clientType: "Privado",
			active: true
		},
		{
			tariffRate: "Menor que <",
			type: "Suscripción",
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
