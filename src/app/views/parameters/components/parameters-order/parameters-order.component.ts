import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";
import { ActionsSubject } from "@ngrx/store";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable, Subject } from "rxjs";
import { ParametersTypeConfiguration } from "../../models/company-type.model";
import { Parameter } from "../../models/parameter.model";

@Component({
	selector: "app-parameters-order",
	templateUrl: "./parameters-order.component.html",
	styleUrls: ["./parameters-order.component.scss"]
})
export class ParametersOrderComponent implements OnInit {
	protected ngUnsubscribe: Subject<any> = new Subject<any>();
	parameters: Parameter[];
	operatorType: any[] = [];
	displayedColumns: string[] = ['description'];
	useSelected: string;

	constructor(@Inject(MAT_DIALOG_DATA) public data: any,
							private actionsSubject$: ActionsSubject,
							private spinner: NgxSpinnerService) {
		Object.keys(ParametersTypeConfiguration).forEach(key => {
			this.operatorType.push({ 'key': key, 'value': ParametersTypeConfiguration[key] });
		});
	}

	ngOnInit() {
	}

}
