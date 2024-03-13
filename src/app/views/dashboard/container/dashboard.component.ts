import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { AccessMaping, AppModules, EActions } from "../../../shared/security/access.mapping";
import { MatrizRiesgo } from "../../matriz/models/matriz.model";
import * as dashboardActions from "../_state/actions/dashboard.actions";
import * as fromReducer from "../_state/reducers";
import { FeePickerDialogComponent } from "../components/fee-picker-dialog/fee-picker-dialog";
import { MatrizPickerDialogComponent } from "../components/matriz-picker-dialog/matriz-picker-dialog.component";
import { MainProductServices } from "./../../../shared/services/main.product.service";
import { Fee } from "./../../fee/models/fee.model";

@Component({
	selector: "dashboard",
	templateUrl: "./dashboard.component.html",
	styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
	public items$: Observable<Fee[]>;
	public matrices$: Observable<MatrizRiesgo[]>;
	feeList: Fee[] = [];
	matList: MatrizRiesgo[] = [];
	tarifario: string = "SOAT";
	baseFee: number = 0;
	baseFeeTotal: number = 0;
	specialFee: number = 0;
	specialFeeTotal: number = 0;

	baseMatriz: number = 0;
	baseMatrizTotal: number = 0;
	specialMatriz: number = 0;
	specialMatrizTotal: number = 0;

	lineChartSteppedData: Array<any> = [
		{
			data: [1, 8, 4, 8, 2, 2, 9],
			label: "Order",
			borderWidth: 0,
			fill: true
			// steppedLine: true
		},
		{
			data: [6, 2, 9, 3, 8, 2, 1],
			label: "New client",
			borderWidth: 1,
			fill: true
			// steppedLine: true
		}
	];
	public lineChartLabels: Array<any> = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July"];
	/*
	 * Full width Chart Options
	 */
	public lineChartOptions: any = {
		responsive: true,
		maintainAspectRatio: false,
		legend: {
			display: false,
			position: "bottom"
		},
		scales: {
			xAxes: [
				{
					display: false,
					gridLines: {
						color: "rgba(0,0,0,0.02)",
						zeroLineColor: "rgba(0,0,0,0.02)"
					}
				}
			],
			yAxes: [
				{
					display: false,
					gridLines: {
						color: "rgba(0,0,0,0.02)",
						zeroLineColor: "rgba(0,0,0,0.02)"
					},
					ticks: {
						beginAtZero: true,
						suggestedMax: 9
					}
				}
			]
		}
	};

	public lineChartColors: Array<any> = [
		{
			backgroundColor: "rgba(63, 81, 181, 0.16)",
			borderColor: "rgba(0,0,0,0)",
			pointBackgroundColor: "rgba(63, 81, 181, 0.4)",
			pointBorderColor: "rgba(0, 0, 0, 0)",
			pointHoverBackgroundColor: "rgba(63, 81, 181, 1)",
			pointHoverBorderColor: "rgba(148,159,177,0)"
		},
		{
			backgroundColor: "rgba(0, 0, 0, .08)",
			borderColor: "rgba(0,0,0,0)",
			pointBackgroundColor: "rgba(0, 0, 0, 0.06)",
			pointBorderColor: "rgba(0, 0, 0, 0)",
			pointHoverBackgroundColor: "rgba(0, 0, 0, 0.1)",
			pointHoverBorderColor: "rgba(0, 0, 0, 0)"
		}
	];
	public lineChartLegend: boolean = false;
	public lineChartType: string = "line";

	// Chart grid options
	doughnutChartColors1: any[] = [
		{
			backgroundColor: ["#fff", "rgba(0, 0, 0, .24)"]
		}
	];
	doughnutChartColors2: any[] = [
		{
			backgroundColor: ["rgba(0, 0, 0, .5)", "rgba(0, 0, 0, .15)"]
		}
	];
	total1: number = 500;
	data1: number = 200;
	doughnutChartData1: number[] = [this.data1, this.total1 - this.data1];

	total2: number = 600;
	data2: number = 400;
	doughnutChartData2: number[] = [this.data2, this.total2 - this.data2];
	doughnutLabels = ["Spent", "Remaining"];
	doughnutChartType = "doughnut";
	doughnutOptions: any = {
		cutoutPercentage: 85,
		responsive: true,
		legend: {
			display: false,
			position: "bottom"
		},
		elements: {
			arc: {
				borderWidth: 0
			}
		},
		tooltips: {
			enabled: true
		}
	};

	photos = [
		{
			name: "Photo 1",
			url: "assets/images/sq-15.jpg"
		},
		{
			name: "Photo 2",
			url: "assets/images/sq-8.jpg"
		},
		{
			name: "Photo 3",
			url: "assets/images/sq-9.jpg"
		},
		{
			name: "Photo 4",
			url: "assets/images/sq-10.jpg"
		},
		{
			name: "Photo 5",
			url: "assets/images/sq-11.jpg"
		},
		{
			name: "Photo 6",
			url: "assets/images/sq-12.jpg"
		}
	];
	tickets = [
		{
			img: "assets/images/face-1.jpg",
			name: "Mike Dake",
			text: "Excerpt pipe is used.",
			date: new Date("07/12/2017"),
			isOpen: true
		},
		{
			img: "assets/images/face-5.jpg",
			name: "Jhone Doe",
			text: "My dashboard is not working.",
			date: new Date("07/7/2017"),
			isOpen: false
		},
		{
			img: "assets/images/face-3.jpg",
			name: "Jhonson lee",
			text: "Fix stock issue",
			date: new Date("04/10/2017"),
			isOpen: false
		},
		{
			img: "assets/images/face-4.jpg",
			name: "Mikie Jyni",
			text: "Renew my subscription.",
			date: new Date("07/7/2017"),
			isOpen: false
		}
	];
	// users
	users = [
		{
			name: "Snow Benton",
			membership: "Paid Member",
			phone: "+1 (956) 486-2327",
			photo: "assets/images/face-4.jpg",
			address: "329 Dictum Court, Minnesota",
			registered: "2016-07-09"
		},
		{
			name: "Kay Sellers",
			membership: "Paid Member",
			phone: "+1 (929) 406-3172",
			photo: "assets/images/face-2.jpg",
			address: "893 Garden Place, American Samoa",
			registered: "2017-02-16"
		}
	];

	projects = [
		{
			name: "User Story",
			user: "Watson Joyce",
			progress: 100,
			leader: "Snow Benton"
		},
		{
			name: "Design Data Model",
			user: "Morris Adams",
			progress: 30,
			leader: "Watson Joyce"
		},
		{
			name: "Develop CR Algorithm",
			user: "Jhone Doe",
			progress: 70,
			leader: "Ada Kidd"
		},
		{
			name: "Payment Module",
			user: "Ada Kidd",
			progress: 50,
			leader: "Snow Benton"
		},
		{
			name: "Discount Module",
			user: "Workman Floyd",
			progress: 50,
			leader: "Robert Middleton"
		}
	];

	shCreate: boolean;
	shSearch: boolean;
	consult_prima: boolean;

	constructor(
		public r: Router,
		public dialog: MatDialog,
		private store: Store<fromReducer.DashboardState>,
		private typeService: MainProductServices,
		private permits: AccessMaping) {
		this.items$ = this.store.select(fromReducer.getItems);
		this.matrices$ = this.store.select(fromReducer.getMatrices);
		this.matrices$.subscribe(m => {
			this.matList = m;
			this.baseMatriz = m.filter(b => b.isActive === true && b.type === "BASE").length;
			this.baseMatrizTotal = m.filter(b => b.type === "BASE").length;
			this.specialMatriz = m.filter(s => s.isActive === true && s.type !== "BASE").length;
			this.specialMatrizTotal = m.filter(s => s.type !== "BASE").length;
		});
		this.items$.subscribe(x => {
			this.feeList = x;
			this.baseFee = x.filter(b => b.state === true && b.type === "BASE").length;
			this.baseFeeTotal = x.filter(b => b.type === "BASE").length;
			this.specialFee = x.filter(s => s.state === true && s.type !== "BASE").length;
			this.specialFeeTotal = x.filter(s => s.type !== "BASE").length;
		});

		if (this.typeService.getMainProduct() != null) {
			this.tarifario = this.typeService.getMainProduct();
		} else {
			this.tarifario = "SOAT";
		}
	}

	openFeePicker(isbase: boolean) {
		const dialogRef = this.dialog.open(FeePickerDialogComponent, {
			width: "810px",
			disableClose: true,
			autoFocus: false,
			data: { feeList: this.feeList.filter(x => x.state === true && x.type === "BASE"), isbase: isbase }
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
			}
		});
	}

	openMatrizPicker(isbase: boolean, type: string) {
		const dialogRef = this.dialog.open(MatrizPickerDialogComponent, {
			width: "810px",
			disableClose: true,
			autoFocus: false,
			data: { matList: this.matList.filter(x => x.isActive === true && x.type === "BASE"), isbase: isbase, type: type }
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
			}
		});
	}

	goSOAT(isNew: boolean) {
		if (isNew) {
			this.r.navigate(["/fee/manage"]);
		} else {
			this.r.navigate(["/fee/list"]);
		}
	}

	goSCTR(isNew: boolean) {
		if (isNew) {
			this.r.navigate(["/matriz/list-special"]);
		} else {
			this.r.navigate(["/matriz/list"]);
		}
	}

	goSOATChannel(choose: boolean) {
		this.r.navigate(["/fee/listspecial"]);
	}

	goSOATSpecial(choose: boolean) {
		this.r.navigate(["/fee/specialchannel"]);
	}

	goSCTRSpecial(choose: boolean) {
		this.r.navigate(["/matriz/specialchannel"]);
	}

	goChannelGroup() {
		this.r.navigate(["/manage-channels"]);
	}

	goChannelRestriction() {
		this.r.navigate(["/channel-restriction"]);
	}

	ngOnInit() {
		this.shCreate = this.permits.ShouldDo(AppModules.fee, EActions.create);
		this.shSearch = this.permits.ShouldDo(AppModules.fee, EActions.search);
		this.consult_prima = this.shSearch && !this.shCreate;
		if (this.consult_prima) {
			this.r.navigate(["/fee/search"]);
		}
		this.store.dispatch(new dashboardActions.LoadFee());
		this.store.dispatch(new dashboardActions.LoadMatriz());
	}
}
