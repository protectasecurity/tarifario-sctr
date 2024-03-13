import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { RiskGroupInMemoryProvider } from 'app/shared/inmemory-db/risk-group-in-memory.provider';
import { MaterialModule } from 'app/shared/modules/material.module';
import { RiskGroupService } from 'app/shared/services/risk-group/risk-group.service';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SharedModule } from '../../shared/shared.module';
import { MatrizService } from "../matriz/services/matriz.service";
import { FeeService } from './../fee/fee.service';
import { DashboardEffects } from './_state/effects/dashboard.effects';
import { reducers } from './_state/reducers';
import { FeePickerDialogComponent } from './components/fee-picker-dialog/fee-picker-dialog';
import { MatrizPickerDialogComponent } from './components/matriz-picker-dialog/matriz-picker-dialog.component';
import { DashboardComponent } from './container/dashboard.component';
import { DashboardRoutes } from './dashboard.routing';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		FlexLayoutModule,
		ChartsModule,
		NgxDatatableModule,
		SharedModule,
		RouterModule.forChild(DashboardRoutes),
		StoreModule.forFeature('dashboard', reducers),
		EffectsModule.forFeature([DashboardEffects])
	],
	providers: [RiskGroupService, RiskGroupInMemoryProvider, FeeService, MatrizService],
	declarations: [DashboardComponent /* FeePickerDialogComponent */],
	entryComponents: [
		/* FeePickerDialogComponent */
	],
	exports: []
})
export class DashboardModule {}
