import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
	selector: 'app-confirm',
	templateUrl: './app-confirm-template.html',
	styleUrls: ['./app-confirm-template.scss']
})
export class AppComfirmComponent {
	constructor(public dialogRef: MatDialogRef<AppComfirmComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}
}
