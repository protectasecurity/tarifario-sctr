import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { FeeMasiveComponent } from './fee-masive.component';

interface ConfirmData {
	title?: string;
	message?: string;
	showcancel?: boolean;
	effecdate?: moment.Moment;
	mindate?: moment.Moment;
	maxdate?: moment.Moment;
}

@Injectable()
export class FeeMasiveService {
	constructor(private dialog: MatDialog) { }

	public confirm(data: ConfirmData = {}): Observable<boolean> {
		data.title = data.title || 'Confirmar';
		data.message = data.message || 'Esta seguro?';
		data.showcancel = data.showcancel || false;

		let dialogRef: MatDialogRef<FeeMasiveComponent>;
		dialogRef = this.dialog.open(FeeMasiveComponent, {
			width: '380px',
			disableClose: true,
			data: {
				title: data.title,
				message: data.message,
				showcancel: data.showcancel,
				effecdate: data.effecdate,
				mindate: data.mindate,
				maxdate: data.maxdate
			}
		});
		return dialogRef.afterClosed();
	}
}
