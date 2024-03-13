import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ofType } from "@ngrx/effects";
import { ActionsSubject, Store } from "@ngrx/store";
import { AppConfirmService } from "app/shared/services/app-confirm/app-confirm.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AccessMaping, AppModules, EActions } from "../../../../shared/security/access.mapping";
import { Channel } from "../../models/Channels";
import { ManageChannelGroup } from "../../models/ManageChannelGroup";
import { NewAgent } from "../../models/NewAgent";
import * as channelActions from "../../state/actions/channel.actions";
import * as fromReducer from "../../state/reducers";

export class DisplayAgent {
	agents: NewAgent[];
	ids: string;
	descriptions: string;

	static CreateInstance(_agents: NewAgent[]): DisplayAgent {
		const instance = new DisplayAgent();
		instance.agents = _agents;
		instance.ids = this.concatenateIds(_agents);
		instance.descriptions = this.concatenateDescriptions(_agents);
		return instance;
	}

	static concatenateIds(agents: NewAgent[]): string {
		return agents.map(x => x.id).join("");
	}

	static concatenateDescriptions(agents: NewAgent[]): string {
		return agents.map(x => x.description).join(", ");
	}
}

@Component({
	selector: "app-manage-channel-create",
	templateUrl: "./manage-channel-create.component.html",
	styleUrls: ["./manage-channel-create.component.scss"]
})
export class ManageChannelCreateComponent implements OnInit {
	protected ngUnsubscribe: Subject<any> = new Subject<any>();
	channelGroup$: Observable<ManageChannelGroup> = this.store.select(fromReducer.getChannelGroup);
	channelsList: Channel[];

	constructor(
		private store: Store<fromReducer.ChannelState>,
		private activatedRoute: ActivatedRoute,
		private actionsSubject$: ActionsSubject,
		private spinner: NgxSpinnerService,
		private confirmService: AppConfirmService,
		public router: Router,
	) {
	}

	ngOnInit(): void {
		this.triggers();

		const groupId = this.activatedRoute.snapshot.params["groupId"];
		if (groupId) {
			this.store.dispatch(new channelActions.GetChannelGroup(groupId));
		} else {
			this.store.dispatch(new channelActions.SetDefaultChannelGroup());
		}
		this.store.dispatch(new channelActions.LoadChannels());
		this.store.select(fromReducer.getChannels).subscribe(list => this.channelsList = list);
	}

	triggers() {
		this.actionsSubject$
			.pipe(takeUntil(this.ngUnsubscribe))
			.pipe(ofType(channelActions.ChannelActionTypes.GetCustomerByName))
			.subscribe(response => {
				this.spinner.show();
			});
		this.actionsSubject$
			.pipe(takeUntil(this.ngUnsubscribe))
			.pipe(ofType(channelActions.ChannelActionTypes.GetCustomerByNameComplete))
			.subscribe(response => {
				this.spinner.hide();
			});
		this.actionsSubject$
			.pipe(takeUntil(this.ngUnsubscribe))
			.pipe(ofType(channelActions.ChannelActionTypes.AddChannelGroupComplete))
			.subscribe(() => {
				this.router.navigate(["/manage-channels"]);
			});
	}


	addGroupChannel(event: any): void {
		const manageChannelGroup: ManageChannelGroup = ManageChannelGroup.CreateInstance(event.grupoDescripcion, event.manageChannel);

		const filtered = (this.channelsList.filter(d => d["description"] === event.grupoDescripcion));
		if (filtered.length > 0) {
			this.confirmService.confirm({
				title: "Error",
				message: "La descripción ingresada ya existe",
				showcancel: false
			});
			return;
		}
		/* else {
			const newList = [];
			let newListElements = '';
			let existListElements = '';
			let equal: boolean = false;

			for (let index = 0; index < manageChannelGroup.channels.length; index++) {
				const a = manageChannelGroup.channels[index];
				newList.push(a.agents.map(n => n.id).join(""));
			}
			newListElements = newList.sort().join();

			for (let index = 0; index < this.channelsList.length; index++) {
				const c = this.channelsList[index];
				const list = [];
				existListElements = '';
				for (let idx1 = 0; idx1 < c["channels"].length; idx1++) {
					const a = c["channels"][idx1];
					list.push(a.agents.map(n => n.id).join(""));
				}
				existListElements = list.sort().join();
				if (existListElements === newListElements) {
					equal = true;
					break;
				}
			}
			if (equal) {
				this.confirmService.confirm({
					title: "Error",
					message: "Ya existe un grupo de canal con el mismo detalle de canales",
					showcancel: false
				});
				return;
			}
		} */
		this.confirmService
			.confirm({
				title: "Confirmación",
				message: "¿Está seguro de guardar el grupo de canal?",
				showcancel: true
			})
			.subscribe(x => {
				if (x === true) {
					this.store.dispatch(new channelActions.AddChannelGroup(manageChannelGroup));
				}
			});
	}

	updateGroupChannel(event: any): void {
		this.confirmService
			.confirm({
				title: "Confirmación",
				message: "¿Está seguro de editar el grupo de canal?",
				showcancel: true
			})
			.subscribe(x => {
				if (x === true) {
					const manageChannelGroup: ManageChannelGroup = ManageChannelGroup.CreateInstance(event.grupoDescripcion, event.manageChannel, event.id);
					const filtered = (this.channelsList.filter(d => d["description"] === event.grupoDescripcion));
					if (filtered.length > 0 && filtered[0].id !== event.id) {
						this.confirmService.confirm({
							title: "Error",
							message: "El canal o la descripción ingresada ya existe",
							showcancel: false
						});
						return;
					}
					/* 	else {
							const newList = [];
							let equal: boolean = false;
							manageChannelGroup.channels.forEach(a => {
								newList.push(a.agents.map(n => n.id).join(""));
							});
							this.channelsList.forEach(c => {
								const list = [];
								let count = 0;
								c["channels"].forEach(a => {
									list.push(a.agents.map(n => n.id).join(""));
								});

								newList.forEach(chk => {
									if (list.filter(e => e === chk).length > 0) {
										count++;
									}
								});

								if (count === list.length) {
									if (!equal) {
										equal = event.id === c.id ? false : true;
									}
								}
							});
							if (equal) {
								this.confirmService.confirm({
									title: "Error",
									message: "Ya existe un grupo de canal con el mismo detalle de canales",
									showcancel: false
								});
								return;
							}
						} */
					this.store.dispatch(new channelActions.UpdateChannelGroup(manageChannelGroup));
					/* 	this.confirmService
							.confirm({
								title: "Confirmación",
								message: "¿Está seguro de guardar el grupo de canal?",
								showcancel: true
							})
							.subscribe(x => {
								if (x === true) {
									this.store.dispatch(new channelActions.UpdateChannelGroup(manageChannelGroup));
								}
							}); */
				}
			});
	}
}
