import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";

import { RouterModule } from "@angular/router";
import { HotTableModule } from "@handsontable/angular";

import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { DropDownSearchModule } from "app/shared/modules/dropdown-search.module";
import { UseService } from "app/shared/services/use/use.service";
import { SharedModule } from "app/shared/shared.module";
import { FileUploadModule } from "ng2-file-upload/ng2-file-upload";
import { ClassInMemoryProvider } from "../../shared/inmemory-db/class-in-memory.provider";
import { PersonTypeInMemoryProvider } from "../../shared/inmemory-db/person-type-in-memory.provider";
import { RiskGroupInMemoryProvider } from "../../shared/inmemory-db/risk-group-in-memory.provider";

import { MaterialModule } from "../../shared/modules/material.module";
import { BrandService } from "../../shared/services/brand/brand.service";
import { ClassService } from "../../shared/services/class/class.service";
import { FileExportService } from "../../shared/services/file.export.service";
import { ModelService } from "../../shared/services/model/model.service";
import { PersonTypeService } from "../../shared/services/person-type/person-type.service";
import { RiskGroupService } from "../../shared/services/risk-group/risk-group.service";
import { UseClassService } from "../../shared/services/use-class/use-class.service";
import { ManageChannelCreatePopupComponent } from "../manage-channel/container/manage-channel-create-popup/manage-channel-create-popup.component";
import { ManageChannelModule } from "../manage-channel/manage-channel.module";
import { ZoneService } from "./../zones/zone.service";
import { FeeEffects } from "./_state/effects/fee.effects";
import { reducers } from "./_state/reducers";
import { ChannelListDialogComponent } from "./components/channel-list-dialog/channel-list-dialog";
/* import { ChannelChildDialogComponent } from "./components/channel-child-dialog/channel-child-dialog"; */
import { EffectDateComponent } from "./components/effectdate-confirm/effectdate-confirm.component";
import { EffectDateService } from "./components/effectdate-confirm/effectdate-confirm.service";
import { FeeAssociateChannelDialogComponent } from "./components/fee-associate-channel-dialog/fee-associate-channel-dialog";
import { FeeChildDialogComponent } from "./components/fee-child-dialog/fee-child-dialog";
import { FeeMasiveComponent } from "./components/fee-masive/fee-masive.component";
import { FeeMasiveService } from "./components/fee-masive/fee-masive.service";

import { RiskGroupPickerDialogComponent } from "./components/riskgroup-picker-dialog/riskgroup-picker-dialog";
import { ZonePickerDialogComponent } from "./components/zone-picker-dialog/zone-picker-dialog";

import { FeeCreateContainerComponent } from "./container/fee-create-container/fee-create-container.component";
import { FeeListContainerComponent } from "./container/fee-list-container/fee-list-container.component";
import { FeeListSpecialContainerComponent } from "./container/fee-list-special-container/fee-list-special-container.component";
import { FeeSearchComponent } from "./container/fee-search/fee-search.component";

import { FeeRoutes } from "./fee.routing";
import { FeeService } from "./fee.service";


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
		RouterModule.forChild(FeeRoutes),
		HotTableModule.forRoot(),
		StoreModule.forFeature("fee", reducers),
		EffectsModule.forFeature([FeeEffects]),
		DropDownSearchModule,
		SharedModule,
		ManageChannelModule


	],

	providers: [
		FileExportService,
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
		FeeService,
		RiskGroupService,
		RiskGroupInMemoryProvider,
		ZoneService,
		UseService,
		EffectDateService,
		FeeMasiveService,
		PersonTypeService,
		PersonTypeInMemoryProvider,
		ClassService,
		ClassInMemoryProvider,
		BrandService,
		ModelService,
		UseClassService
	],
	declarations: [
		FeeListContainerComponent,
		FeeListSpecialContainerComponent,
		FeeCreateContainerComponent,
		ZonePickerDialogComponent,
		FeeAssociateChannelDialogComponent,
		RiskGroupPickerDialogComponent,
		EffectDateComponent,
		ChannelListDialogComponent,
		FeeSearchComponent,
		FeeChildDialogComponent,
		FeeMasiveComponent,
		/* ChannelChildDialogComponent */
	],
	entryComponents: [
		ChannelListDialogComponent,
		RiskGroupPickerDialogComponent,
		ZonePickerDialogComponent,
		FeeAssociateChannelDialogComponent,
		EffectDateComponent,
		ManageChannelCreatePopupComponent,
		FeeChildDialogComponent,
		FeeMasiveComponent,
		/* ChannelChildDialogComponent */
	]
})
export class FeeModule {
}
