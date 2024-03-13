import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Class } from "../../../../shared/models/class.model";
import { UseClass } from "../../../../shared/models/use-class.model";
import { Use } from "../../../../shared/models/use.model";
import { AppConfirmService } from "../../../../shared/services/app-confirm/app-confirm.service";

@Component({
	selector: "app-use-class-detail",
	templateUrl: "./use-class-detail.component.html",
	styleUrls: ["./use-class-detail.component.scss"]
})
export class UseClassDetailComponent implements OnInit {
	@Input()
	uses: Use[];
	@Input()
	classes: Class[];
	@Input()
	data: UseClass[];
	@Output()
	updateSave: EventEmitter<UseClass> = new EventEmitter<UseClass>();
	selectedUse = new FormControl('', Validators.required);
	selectedClass = new FormControl('', Validators.required);
	constructor(public router: Router, private confirmService: AppConfirmService) {}

	ngOnInit() {}

	save() {
			const use: Use = this.selectedUse.value;
			const clazz: Class = this.selectedClass.value;
			const useClass =  UseClass.CreateInstance(use, clazz);
			const existe: boolean = this.data.find(useClas => useClas.clazz.id === clazz.id && useClas.use.id === use.id) !== undefined;
			if (existe) {
				this.confirmService.confirm({
					title: 'Información',
					message: `La relación uso ${use.description} y clase ${clazz.description} ya se encuentra registrada.`,
					showcancel: false
				});
			} else {
				this.updateSave.emit(useClass);
			}
	}

	isDisabled(): boolean {
		return  this.selectedUse.value === '' || this.selectedClass.value === '';
	}
}
