import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MaterialModule } from 'app/shared/modules/material.module';
import { FileExportService } from 'app/shared/services/file.export.service';
import { SharedModule } from 'app/shared/shared.module';
import { ClassInMemoryProvider } from '../../shared/inmemory-db/class-in-memory.provider';
import { PersonTypeInMemoryProvider } from '../../shared/inmemory-db/person-type-in-memory.provider';
import { RiskGroupInMemoryProvider } from '../../shared/inmemory-db/risk-group-in-memory.provider';
import { DropDownSearchModule } from '../../shared/modules/dropdown-search.module';
import { AlertService } from '../../shared/services/alert/alert.service';
import { BrandService } from '../../shared/services/brand/brand.service';
import { ClassService } from '../../shared/services/class/class.service';
import { PersonTypeService } from '../../shared/services/person-type/person-type.service';
import { RiskGroupService } from '../../shared/services/risk-group/risk-group.service';
import { UseClassService } from "../../shared/services/use-class/use-class.service";
import { UseService } from '../../shared/services/use/use.service';
import { ModelService } from './../../shared/services/model/model.service';
import { FeeService } from './../fee/fee.service';
import { RiskEffects } from './_state/effects/risk.effects';
import { reducers } from './_state/reducers';
import { BrandModelPickerDialogComponent } from './components/brandmodel-picker-dialog/brandmodel-picker-dialog';
import { RiskGroupDetailComponent } from './components/risk-group-detail/risk-group-detail.component';
import { RiskGroupOptionsHeaderComponent } from './components/risk-group-options-header/risk-group-options-header.component';
import { RiskGroupContainerComponent } from './container/risk-group-container/risk-group-container.component';
import { RiskGroupListContainerComponent } from './container/risk-group-list-container/risk-group-list-container.component';
import { RiskGroupOptionsComponent } from './container/risk-group-options/risk-group-options.component';
import { RiskGroupModalComponent } from './risk-group-modal/risk-group-modal';
import { RiskGroupRoutes } from './risk-group.routing';
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgxDatatableModule,
		FlexLayoutModule,
		RouterModule.forChild(RiskGroupRoutes),
		DragDropModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		StoreModule.forFeature('risk', reducers),
		EffectsModule.forFeature([RiskEffects]),
		DropDownSearchModule,
		SharedModule
	],
	providers: [
		UseService,
		BrandService,
		ModelService,
		RiskGroupService,
		FeeService,
		RiskGroupInMemoryProvider,
		AlertService,
		ClassService,
		ClassInMemoryProvider,
		PersonTypeService,
		PersonTypeInMemoryProvider,
		FileExportService,
		UseClassService
	],
	declarations: [
		RiskGroupContainerComponent,
		RiskGroupListContainerComponent,
		RiskGroupModalComponent,
		BrandModelPickerDialogComponent,
		RiskGroupOptionsComponent,
		RiskGroupOptionsHeaderComponent,
		RiskGroupDetailComponent
	],
	entryComponents: [RiskGroupModalComponent, BrandModelPickerDialogComponent, RiskGroupOptionsComponent]
})
export class RiskGroupModule { }
