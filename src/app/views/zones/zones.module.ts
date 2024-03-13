import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatPaginatorIntl } from '@angular/material';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { getEsPaginatorIntl } from '../../shared/helpers/es-paginator-intl';
import { MaterialModule } from '../../shared/modules/material.module';
import { FileExportService } from "../../shared/services/file.export.service";
import { ZonesEffects } from './_state/effects/zones.effects';
import { reducers } from './_state/reducers';
import { ZonesCreateDetailComponent } from './components/zones-create-detail/zones-create-detail.component';
import { ZonesListComponent } from './components/zones-list/zones-list.component';
import { ZoneModalComponent } from './components/zones-create-popup-detail/zone-modal';
import { ZonesCreateComponent } from './container/zones-create/zones-create.component';
import { ZonesComponent } from "./container/zones/zones.component";
import { ZoneService } from './zone.service';
import { ZonesRoutes } from './zones.routing';

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
		RouterModule.forChild(ZonesRoutes),
		StoreModule.forFeature('zones', reducers),
		EffectsModule.forFeature([ZonesEffects])
	],
	providers: [
		{
			provide: MAT_DATE_LOCALE,
			useValue: 'es-ES'
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
		{
			provide: MatPaginatorIntl,
			useValue: getEsPaginatorIntl()
		},
		ZoneService,
		FileExportService
	],
	declarations: [ZonesListComponent, ZoneModalComponent, ZonesCreateComponent, ZonesCreateDetailComponent, ZonesComponent],
	entryComponents: [ZoneModalComponent]
})
export class ZonesModule {}
