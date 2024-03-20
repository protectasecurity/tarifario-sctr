import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material";

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
		private readonly dialogRef: MatDialogRef<RangeDaysComponent>
	) {
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
		this.dialogRef.close(this.form.getRawValue());
	}

	close(): void {
		this.dialogRef.close();
	}
}
