import { Component, Inject, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource } from "@angular/material";
import { Router } from "@angular/router";
import { Fee } from "../../../fee/models/fee.model";
import { MatrizRiesgo } from "../../../matriz/models/matriz.model";

@Component({
	selector: "app-matriz-picker-dialog",
	templateUrl: "./matriz-picker-dialog.component.html",
	styleUrls: ["./matriz-picker-dialog.component.scss"]
})
export class MatrizPickerDialogComponent {
	descriptionFilter = new FormControl();
	dataSource: MatTableDataSource<MatrizRiesgo>;
	isbase: boolean = false;
	type: string = "";
	displayedColumns: string[] = ["description", "startDate", "endDate", "currency", "actions"];
	filteredValues = {
		description: ""
	};

	constructor(@Inject(MAT_DIALOG_DATA) public data: any,
							public r: Router,
							private dialogRef: MatDialogRef<MatrizPickerDialogComponent>) {

		this.dataSource = new MatTableDataSource(data.matList);
		this.isbase = data.isbase;
		this.type = data.type;
		this.dataSource.filterPredicate = this.feeFilterPredicate();
	}

	setFilters() {
		this.descriptionFilter.valueChanges.subscribe(descriptionFilterValue => {
			this.filteredValues["description"] = descriptionFilterValue;
			this.dataSource.filter = JSON.stringify(this.filteredValues);
		});
	}

	feeFilterPredicate() {
		const myFilterPredicate = function(data: MatrizRiesgo, filter: string): boolean {
			const searchString = JSON.parse(filter);

			// description
			const findDescript = searchString.description
				? searchString.description
					.toString()
					.toLocaleLowerCase()
					.trim()
				: "";
			const descriptionFilter =
				data.description
					.toString()
					.toLocaleLowerCase()
					.trim()
					.indexOf(findDescript) !== -1;

			return descriptionFilter;
		};
		return myFilterPredicate;
	}

	handleContainer(matriz: MatrizRiesgo) {
		switch (this.type) {
			case "campaign":
				this.r.navigate([`/matriz/campaign/${matriz.id}`]);
				break;
			case "base":
				this.r.navigate([`/matriz/basechannel/${matriz.id}`]);
				break;
			case "basespecial":
				this.r.navigate([`/matriz/basespecialchannel/${matriz.id}`]);
				break;
		}
		// if (this.type === "campaign") {
		// 	this.r.navigate([`/matriz/campaign/${matriz.id}`]);
		// }
		// if (this.isbase) {
		// 	this.r.navigate([`/matriz/basechannel/${matriz.id}`]);
		// } else {
		// 	this.r.navigate([`/matriz/basespecialchannel/${matriz.id}`]);
		// }
		this.dialogRef.close();
	}
}
