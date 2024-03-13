import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';

import { AppComfirmComponent } from './app-confirm.component';

interface ConfirmData {
	title?: string;
	message?: string;
	showcancel?: boolean;
}

@Injectable()
export class AppConfirmService {
	constructor(private dialog: MatDialog) {}

	public confirm(data: ConfirmData = {}): Observable<boolean> {
		data.title = data.title || 'Confirmar';
		data.message = data.message || 'Esta seguro?';
		data.showcancel = data.showcancel || false;

		let dialogRef: MatDialogRef<AppComfirmComponent>;
		dialogRef = this.dialog.open(AppComfirmComponent, {
			width: '380px',
			disableClose: true,
			data: { title: data.title, message: data.message, showcancel: data.showcancel }
		});
		return dialogRef.afterClosed();
	}
}
