import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HotTableModule } from "@handsontable/angular";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { SubscriptionsRoutingModule } from "./subscriptions-routing.module";

import { MaterialModule } from "app/shared/modules/material.module";
import { SubscriptionsComponent } from "app/views/subscriptions/container/subscriptions.component";
import { AgencyComponent } from "./components/agency/agency.component";
import { CommissionsComponent } from "./components/commissions/commissions.component";
import { DataCorrectionComponent } from "./components/data-correction/data-correction.component";
import { DeclarationTypesComponent } from "./components/declaration-types/declaration-types.component";
import { DelimitationComponent } from "./components/delimitation/delimitation.component";
import { MinimumPremiumComponent } from "./components/minimum-premium/minimum-premium.component";
import { MovementsComponent } from "./components/movements/movements.component";
import { RateAdjustmentComponent } from "./components/rate-adjustment/rate-adjustment.component";
import { RatesComponent } from "./components/rates/rates.component";
import { RetroactivityComponent } from "./components/retroactivity/retroactivity.component";

@NgModule({
	declarations: [
		SubscriptionsComponent,
		RatesComponent,
		RateAdjustmentComponent,
		MinimumPremiumComponent,
		RetroactivityComponent,
		DeclarationTypesComponent,
		MovementsComponent,
		DataCorrectionComponent,
		CommissionsComponent,
		AgencyComponent,
		DelimitationComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,
		SubscriptionsRoutingModule,
		MaterialModule,
		HotTableModule,
		FlexLayoutModule,
		NgxDatatableModule
	]
})
export class SubscriptionsModule {
}
