import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange, MatTableDataSource } from "@angular/material";

@Component({
  selector: 'app-minimum-premium',
  templateUrl: './minimum-premium.component.html',
  styleUrls: ['./minimum-premium.component.scss']
})
export class MinimumPremiumComponent implements OnInit {
	displayedColumns: string[] = ["movementType", "minimumPremium", "premiumEndorsement", "clientType", "actions"];
	data = [
		{
			movementType: "Emisión",
			minimumPremium: "Si excluyente",
			premiumEndorsement: "No",
			clientType: "Ambos",
			active: true
		},
		{
			movementType: "Renovación",
			minimumPremium: "Si excluyente",
			premiumEndorsement: "No",
			clientType: "Ambos",
			active: true
		},
		{
			movementType: "Inclusión",
			minimumPremium: "No",
			premiumEndorsement: "Si excluyente",
			clientType: "Privado",
			active: true
		},
		{
			movementType: "Ajuste de planilla (dentro de la vigencia)",
			minimumPremium: "No",
			premiumEndorsement: "Si excluyente",
			clientType: "Privado",
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
