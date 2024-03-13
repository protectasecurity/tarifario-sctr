import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { FileUploadModule } from "ng2-file-upload";
import { MaterialModule } from "../../shared/modules/material.module";
import { RoutingActividades } from "./actividades.routing";
import { ActividadesServices } from "./services/actividades.services";
import { reducers } from "./states/reducers";
import { ActividadesEffects} from "../actividades/states/actividades/actividades.effects";
import { ActividadesContainerComponent } from "./container/actividades-container/actividades-container.component";
import { ActividadesListComponent } from "./components/actividades-list/actividades-list.component";
import { ActividadesDialogComponent } from "./components/actividades-modal/actividades-modal.component";


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		FlexLayoutModule,
		NgxDatatableModule,
		FileUploadModule,
		MaterialModule,
		NgxDatatableModule,
		RouterModule.forChild(RoutingActividades),
		StoreModule.forFeature("actividades",reducers),
		EffectsModule.forFeature([ActividadesEffects])
	],
	declarations:[
		ActividadesContainerComponent,
		ActividadesListComponent,
		ActividadesDialogComponent],
	providers:[
		ActividadesServices,
	],
	entryComponents:[ActividadesDialogComponent]
})

export class ActividadesModule {}
