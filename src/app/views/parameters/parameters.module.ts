import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatPaginatorIntl } from "@angular/material";
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from "@angular/material-moment-adapter";
import { RouterModule } from "@angular/router";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { FileUploadModule } from "ng2-file-upload";
import { getEsPaginatorIntl } from "../../shared/helpers/es-paginator-intl";
import { MaterialModule } from "../../shared/modules/material.module";
import { ParametersRoutes } from "../parameters/parameters.routing";
import { ParametersListComponent } from "./components/parameters-list/parameters-list.component";
import { ParametersModalComponent } from "./components/parameters-modal/parameters-modal";
import { ParametersComponent } from "./container/parameters/parameters.component";
import { ParametersService } from "./services/parameters.service";
import { ParameterEffects } from "./state/parameter/parameter.effects";
import { reducers } from "./state/reducers";
import { ParametersOrderComponent } from "./components/parameters-order/parameters-order.component";

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
		RouterModule.forChild(ParametersRoutes),
		StoreModule.forFeature("parametros", reducers),
		EffectsModule.forFeature([ParameterEffects])
	],
	providers: [
		ParametersService
	],
	declarations: [
		ParametersComponent,
		ParametersModalComponent,
		ParametersListComponent,
		ParametersOrderComponent
	],
	entryComponents: [ParametersModalComponent, ParametersOrderComponent]

})
export class ParametersModule {
}
