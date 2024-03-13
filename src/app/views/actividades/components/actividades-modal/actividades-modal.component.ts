import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Actividades } from "../../models/Actividades";

@Component({
  selector: 'app-actividades-modal',
  templateUrl: './actividades-modal.component.html',
  styleUrls: ['./actividades-modal.component.scss']
})
export class ActividadesDialogComponent implements OnInit {

	actividadesOptions: FormGroup;
	newActivicty: Actividades;
	DATA_PROVIDER: any[] = [];

  constructor(private fb: FormBuilder,
							@Inject(MAT_DIALOG_DATA) public data: any,
							private dialogRef: MatDialogRef<Actividades>) { }

  ngOnInit() {
  	this.buildForm();
  	this.DATA_PROVIDER = [{
  		ciu: 510,
  		name: "Actividad#1",
  		delimiter: false,
  		gestionable: true,
		},{
			ciu: 511,
			name: "Actividad#11",
			delimiter: true,
			gestionable: false,
		},{
			ciu: 512,
			name: "Actividad#12",
			delimiter: false,
			gestionable: true,
		},{
			ciu: 513,
			name: "Actividad#13",
			delimiter: false,
			gestionable: true,
		},{
			ciu: 514,
			name: "Actividad#14",
			delimiter: false,
			gestionable: false,
		},{
			ciu: 515,
			name: "Actividad#15",
			delimiter: true,
			gestionable: true,
		}]
  }

	buildForm() {
		this.actividadesOptions = this.fb.group({
			actividadFilter: ['', [Validators.required]]
		});
	}

	save(){

		// this.newActivicty = Actividades.CreateInstance(
		// 	this.actividadesOptions.value.actividadFilter.name,
		// 	this.actividadesOptions.value.actividadFilter.ciu,
		// 	null,
		// 	this.actividadesOptions.value.actividadFilter.delimiter,
		// 	this.actividadesOptions.value.actividadFilter.gestionable,
		// );
		//
		// this.dialogRef.close(this.newActivicty);
	}

}
