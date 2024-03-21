import { Component, Inject, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

@Component({
	selector: "app-range-days",
	templateUrl: "./range-days.component.html",
	styleUrls: ["./range-days.component.scss"]
})
export class RangeDaysComponent implements OnInit {
	form: FormGroup = this.builder.group({
		range: ["[]", Validators.required],
		min: ["", Validators.required],
		max: ["", Validators.required]
	});

	constructor(
		private readonly builder: FormBuilder,
		private readonly dialogRef: MatDialogRef<RangeDaysComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		console.log(data);

		if (!data) {
			return;
		}

		let range = data.split("");
		range = range[0] + range[range.length - 1];
		this.formControl["range"].setValue(range);

		const values = data.split(",");

		this.formControl["min"].setValue(values[0].slice(1));
		this.formControl["max"].setValue(values[1].slice(0, -1));
	}

	ngOnInit() {
	}

	get formControl(): { [key: string]: AbstractControl } {
		return this.form.controls;
	}

	get range(): string[] {
		return this.formControl["range"].value.split("");
	}

	onSubmit(): void {
		const value: string = `${this.range[0]}${this.formControl["min"].value},${this.formControl["max"].value}${this.range[1]}`;
		this.dialogRef.close(value);
	}

	close(): void {
		this.dialogRef.close();
	}
}
