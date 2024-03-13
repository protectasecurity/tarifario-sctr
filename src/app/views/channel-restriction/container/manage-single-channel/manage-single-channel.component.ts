import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AccessMaping, AppModules, EActions } from '../../../../shared/security/access.mapping';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { FileExportService } from '../../../../shared/services/file.export.service';
import { TypeTokenServices } from '../../../../shared/services/typeToken.services';
import { CreateChannelDialogComponent } from '../../components/channel/create-channel-dialog/create-channel-dialog.component';
import { Filter } from '../../models/Filter';
import { Restriction } from '../../models/Restriction';
import * as fromAction from '../../state/actions/channel.restriction.actions';
import * as fromReducer from '../../state/reducers';
import { sortArrayByProperty, sortArray } from 'app/shared/helpers/utils';

@Component({
	selector: 'channel-restriction-manage-single-channel',
	templateUrl: './manage-single-channel.component.html',
	styleUrls: ['./manage-single-channel.component.scss']
})
export class ManageSingleChannelComponent implements OnInit {
	shCreate: boolean;
	canChange: boolean;
	canDelete: boolean;
	descriptionFilter = new FormControl();
	filteredValues = Filter.CreateInstance('');
	restrictions: Restriction[] = [];
	restrictions$: Observable<Restriction[]> = this.store.select(fromReducer.getRestrictions);

	constructor(
		private fileExportService: FileExportService,
		private permits: AccessMaping,
		private store: Store<fromReducer.ChannelRestrictionState>,
		private router: Router,
		private confirmService: AppConfirmService,
		private typeTokenServices: TypeTokenServices,
		private dialog: MatDialog) {
		if (this.typeTokenServices.getToken() === 'SCTR') {
			this.router.navigate(['/']);
		}
	}

	ngOnInit() {
		this.store.dispatch(new fromAction.LoadRestrictions());
		this.shCreate = this.permits.ShouldDo(AppModules.channels, EActions.create);
		this.canDelete = !this.permits.ShouldDo(AppModules.channels, EActions.delete);
		this.canChange = !this.permits.ShouldDo(AppModules.channels, EActions.changestate);
		this.setFilter();
		this.restrictions$.subscribe(list => this.restrictions = list);
	}

	setFilter() {
		this.descriptionFilter.valueChanges.subscribe(text => {
			this.filteredValues["description"] = text;
			this.store.dispatch(new fromAction.SetFilter(this.filteredValues));
		});
	}

	constraints(channelId: any) {
		this.router.navigate([`/channel-restriction/constraint/${channelId}`]);
	}

	excelExport(e: Event) {
		e.preventDefault();
		const mHeaderColl = ['CANAL (corredor/comercializador)', 'Uso', 'Clase', 'Fecha Inicial', 'Fecha Final', 'Estado'];
		const listOrd = sortArray(this.restrictions, 'channel.description', 1);
		this.fileExportService.exportRestrictions(listOrd, mHeaderColl);
	}

	openCreateDialog(e: Event) {
		const dialogRef = this.dialog.open(CreateChannelDialogComponent, {
			width: "800px"
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.router.navigate([`/channel-restriction/channel/restrictions`]);
			}
		});
	}

}
