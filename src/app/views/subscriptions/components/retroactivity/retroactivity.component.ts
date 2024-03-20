import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef, MatSlideToggleChange, MatTableDataSource } from "@angular/material";
import { RangeDaysComponent } from "app/views/subscriptions/shared/components/range-days/range-days.component";

@Component({
	selector: "app-retroactivity",
	templateUrl: "./retroactivity.component.html",
	styleUrls: ["./retroactivity.component.scss"]
})
export class RetroactivityComponent implements OnInit {
	displayedColumns: string[] = [
		"movementType",
		"date",
		"dayRange",
		"operator",
		"payrollAmount",
		"requirement",
		"exclude",
		"approvalType",
		"clientType",
		"state",
		"actions"
	];
	data = [];
	dataSource: MatTableDataSource<any> = new MatTableDataSource([]);

	pageSize: number = 10;

	constructor(private readonly dialog: MatDialog) {
	}


	ngOnInit() {
		for (let _: number = 0; _ <= 10; _++) {
			this.data.push({
				movementType: "Emisión",
				date: "Inicio de vigencia",
				dayRange: {
					rangeMin: "[",
					rangeMax: "]",
					min: 1,
					max: 2,
					value: "[1,2]"
				},
				operator: "Mayor que >",
				payrollAmount: 50000,
				requirement: "Ninguno",
				exclude: "Sábado, domingos y feriados",
				approvalType: "Automática",
				clientType: "Privado",
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

	edit(): void {
		const dialogRef: MatDialogRef<RangeDaysComponent> = this.dialog.open(RangeDaysComponent);

		dialogRef.afterClosed().subscribe(result => {
			console.log(result);
		});
	}
}
