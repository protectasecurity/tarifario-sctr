import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource } from "@angular/material";
import * as moment from "moment";
import { AppConfirmService } from "../../../../shared/services/app-confirm/app-confirm.service";

export interface Distribution {
	item: string;
	cost: number;
}

@Component({
	selector: "app-matriz-startend-dialog",
	templateUrl: "./matriz-startend-dialog.component.html",
	styleUrls: ["./matriz-startend-dialog.component.scss"]
})
export class MatrizStartendDialogComponent implements OnInit {
	minDate = moment();
	maxDate = null;
	dataActual: Distribution[] = [];
	discount = "";
	commission = "";
	distribution = "";
	channelGroup: any;
	directos: false;
	dataSource: MatTableDataSource<Distribution>;
	displayedColumns: string[] = [
		"rol",
		"distribucion"
	];

	effectDate = null;
	endDate = null;

	constructor(@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<MatrizStartendDialogComponent>,
		private confirmService: AppConfirmService) {

		this.effectDate = data.channel.startDate;
		this.minDate = data.minDate ? data.minDate : moment();
		this.endDate = data.channel.endDate;
		this.discount = data.channel.discount ? data.channel.discount : "";
		this.commission = data.channel.commission ? data.channel.commission : "";
		this.distribution = data.channel.distribution ? data.channel.distribution : "";
		this.channelGroup = data.channel.channelGroup;

		let roles = [];
		let direct = false;
		let onlyDirect = false;
		data.channel.channelGroup.channels.forEach(c => {
			const pre = [];

			c.agents.forEach(a => {
				let types = "";
				switch (a.typeCore) {
					case 6:
						types = "CORREDOR";
						break;
					case 8:
						direct = true;
						break;
					case 10:
					case 11:
						types = "INTERMEDIARIO";
						break;
					case 97:
						types = "PUNTO DE VENTA";
						break;
				}
				if (types !== "") {
					pre.push(types);
				}
			});
			if (pre.length === 1) {
				const result = roles.find(f => f === pre[0]);
				if (!result) {
					roles.push(pre[0]);
				}
			} else if (pre.length === 2) {
				if (pre[0] === pre[1]) {
					const result1 = roles.filter(f => f === pre[0]);
					if (result1.length === 0 && roles.length === 0) {
						roles = roles.concat(pre);
					} else if (result1.length === 1) {
						this.confirmService.confirm({ title: "Error", message: "Canal no valido.", showcancel: false });
						return;
					} else if (result1.length === 2) {
					}
				} else {
					const first = roles.filter(f => f === pre[0]);
					const second = roles.filter(f => f === pre[1]);
					if (first.length === 0 && second.length === 0) {
						roles = roles.concat(pre);
					} else if (first.length === 1 && second.length === 1) {
					} else if ((first.length === 0 && second.length === 1) || (first.length === 1 && second.length === 0) && roles.length > 1) {
						this.confirmService.confirm({ title: "Error", message: "Cannal no valido.", showcancel: false });
						return;
					}
				}
			} else {
				if (roles.length === 0) {
					roles = roles.concat(pre);
				}
				if (pre.length === 0 && direct && c.agents.length === 1) {
					onlyDirect = true;
				}
			}
		});


		this.directos = onlyDirect;


		this.distribution === "" ?
			roles.length === 1 ?
				this.dataActual.push({ cost: 100, item: roles[0] }) :
				roles.forEach(r => this.dataActual.push({ cost: 0, item: r })) :
			roles.length === 1 ?
				this.dataActual.push({ cost: Number(this.distribution), item: roles[0] }) :
				roles.forEach((r, i) => this.dataActual.push({ cost: Number(this.distribution.split("/")[i]), item: r }));

	}


	ngOnInit(): void {
		this.dataSource = new MatTableDataSource(this.dataActual);
	}

	getTotalCost() {
		return this.directos ? 100 : this.dataActual.map(t => t.cost).reduce((acc, value) => acc + value, 0);
	}

	save() {
		if (this.getTotalCost() > 100) {
			this.confirmService.confirm({ title: "Error", message: "La distribución no puede ser superior a 100.", showcancel: false });
			return;
		}

		const aa = this.dataActual.map(b => b.cost).join("/");

		if (this.dataActual.length === 1) {
			this.channelGroup.channels.forEach(c => {
				c.agents.forEach(a => {
					switch (a.typeCore) {
						case 6:
							// types = "CORREDOR";
							a["distribution"] = this.dataActual[0].cost;
							break;
						case 10:
						case 11:
							// types = "INTERMEDIARIO";
							a["distribution"] = this.dataActual[0].cost;
							break;
						case 97:
							// types = "PUNTO DE VENTA";
							a["distribution"] = this.dataActual[0].cost;
							break;
					}
				});
			});
		} else if (this.dataActual.length === 2) {
			if (this.dataActual[0].item !== this.dataActual[1].item) {
				this.dataActual.forEach((d, i) => this.channelGroup.channels.forEach(c => {
					c.agents.forEach(a => {
						switch (a.typeCore) {
							case 6:
								if ("CORREDOR" === d.item) {
									a["distribution"] = this.dataActual[i].cost;
								}
								break;
							case 10:
							case 11:
								if ("INTERMEDIARIO" === d.item) {
									a["distribution"] = this.dataActual[i].cost;
								}
								break;
							case 97:
								if ("PUNTO DE VENTA" === d.item) {
									a["distribution"] = this.dataActual[i].cost;
								}
								break;
						}
					});
				}));
			} else {
				this.dataActual.forEach((d, i) => this.channelGroup.channels.forEach(c => {
					c.agents.forEach((a, j) => {
						if (i === j) {
							switch (a.typeCore) {
								case 6:
									if ("CORREDOR" === d.item) {
										a["distribution"] = this.dataActual[i].cost;
									}
									break;
								case 10:
								case 11:
									if ("INTERMEDIARIO" === d.item) {
										a["distribution"] = this.dataActual[i].cost;
									}
									break;
								case 97:
									if ("PUNTO DE VENTA" === d.item) {
										a["distribution"] = this.dataActual[i].cost;
									}
									break;
							}
						}
					});
				}));
			}
		} else if (this.dataActual.length > 2) {
			this.dataActual.forEach((d, i) => this.channelGroup.channels.forEach(c => {
				c.agents.forEach((a, j) => {
					if (i === j) {
						switch (a.typeCore) {
							case 6:
								if ("CORREDOR" === d.item) {
									a["distribution"] = this.dataActual[i].cost;
								}
								break;
							case 10:
							case 11:
								if ("INTERMEDIARIO" === d.item) {
									a["distribution"] = this.dataActual[i].cost;
								}
								break;
							case 97:
								if ("PUNTO DE VENTA" === d.item) {
									a["distribution"] = this.dataActual[i].cost;
								}
								break;
						}
					}
				});
			}));
		}

		const dd = {
			start: this.effectDate, end: this.endDate, commission: this.commission,
			discount: this.discount, distrubition: aa, channelGroup: this.channelGroup
		};

		this.dialogRef.close(dd);
	}

	close() {
		this.dialogRef.close();
	}

}
