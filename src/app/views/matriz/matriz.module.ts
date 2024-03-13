import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material";
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from "@angular/material-moment-adapter";
import { RouterModule } from "@angular/router";
import { HotTableModule } from "@handsontable/angular";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { FileUploadModule } from "ng2-file-upload";
import { DropDownSearchModule } from "../../shared/modules/dropdown-search.module";
import { MaterialModule } from "../../shared/modules/material.module";
import { FileExportService } from "../../shared/services/file.export.service";
/* import { ChannelChildDialogComponent } from "../fee/components/channel-child-dialog/channel-child-dialog"; */
import { ManageChannelCreatePopupComponent } from "../manage-channel/container/manage-channel-create-popup/manage-channel-create-popup.component";
import { ManageChannelCreatePopupTkComponent } from "../manage-channel/container/manage-channel-create-popup/manage-channel-create-popup.tk.component";
import { ManageChannelModule } from "../manage-channel/manage-channel.module";
import { ZoneService } from "../zones/zone.service";
import { EffectDateComponent } from "./components/effectdate-confirm/effectdate-confirm.component";
import { EffectDateService } from "./components/effectdate-confirm/effectdate-confirm.service";
import { MatrizChannelAssociateComponent } from "./components/matriz-channel-associate/matriz-channel-associate.component";
import { MatrizChannelListComponent } from "./components/matriz-channel-list/matriz-channel-list.component";
import { MatrizPickElementsComponent } from "./components/matriz-pick-elements/matriz-pick-elements.component";
import { MatrizStartendDialogComponent } from "./components/matriz-startend-dialog/matriz-startend-dialog.component";
import { MatrizCreateContainerComponent } from "./container/matriz-create-container/matriz-create-container.component";
import { MatrizListContainerComponent } from "./container/matriz-list-container/matriz-list-container.component";
import { MatrizSearchComponent } from "./container/matriz-search/matriz-search.component";
import { MatrizRoutes } from "./matriz.routing";
import { MatrizService } from "./services/matriz.service";
import { MatrizEffects } from "./state/effects/matriz.effects";
import { reducers } from "./state/reducers";

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
		DropDownSearchModule,
		ManageChannelModule,
		HotTableModule.forRoot(),
		RouterModule.forChild(MatrizRoutes),
		StoreModule.forFeature("matriz", reducers),
		EffectsModule.forFeature([MatrizEffects])
	],
	providers: [
		{
			provide: MAT_DATE_LOCALE,
			useValue: "es-ES"
		},
		{
			provide: DateAdapter,
			useClass: MomentDateAdapter,
			deps: [MAT_DATE_LOCALE]
		},
		{
			provide: MAT_DATE_FORMATS,
			useValue: MAT_MOMENT_DATE_FORMATS
		},
		MatrizService,
		ZoneService,
		FileExportService,
		EffectDateService
	],
	declarations: [
		MatrizListContainerComponent,
		MatrizCreateContainerComponent,
		MatrizPickElementsComponent,
		EffectDateComponent,
		MatrizChannelAssociateComponent,
		MatrizChannelListComponent,
		MatrizStartendDialogComponent,
		MatrizSearchComponent,
		/* ChannelChildDialogComponent */
	],
	entryComponents: [
		MatrizPickElementsComponent,
		EffectDateComponent,
		ManageChannelCreatePopupTkComponent,
		MatrizChannelAssociateComponent,
		MatrizChannelListComponent,
		MatrizStartendDialogComponent,
		/* ChannelChildDialogComponent */
	]
})


export class MatrizModule {

}
