import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AgencyComponent } from "app/views/subscriptions/components/agency/agency.component";
import { CommissionsComponent } from "app/views/subscriptions/components/commissions/commissions.component";
import { DataCorrectionComponent } from "app/views/subscriptions/components/data-correction/data-correction.component";
import { DeclarationTypesComponent } from "app/views/subscriptions/components/declaration-types/declaration-types.component";
import { DelimitationComponent } from "app/views/subscriptions/components/delimitation/delimitation.component";
import { MinimumPremiumComponent } from "app/views/subscriptions/components/minimum-premium/minimum-premium.component";
import { MovementsComponent } from "app/views/subscriptions/components/movements/movements.component";
import { RateAdjustmentComponent } from "app/views/subscriptions/components/rate-adjustment/rate-adjustment.component";

import { RatesComponent } from "app/views/subscriptions/components/rates/rates.component";
import { RetroactivityComponent } from "app/views/subscriptions/components/retroactivity/retroactivity.component";
import { SubscriptionsComponent } from "app/views/subscriptions/container/subscriptions.component";

const routes: Routes = [
	{
		path: "",
		component: SubscriptionsComponent,
		children: [
			{
				path: "tasas",
				component: RatesComponent
			},
			{
				path: "ajuste-tasas",
				component: RateAdjustmentComponent
			},
			{
				path: "prima-minima",
				component: MinimumPremiumComponent
			},
			{
				path: "retroactividad",
				component: RetroactivityComponent
			},
			{
				path: "tipos-declaracion",
				component: DeclarationTypesComponent
			},
			{
				path: "movimientos",
				component: MovementsComponent
			},
			{
				path: "correccion-datos",
				component: DataCorrectionComponent
			},
			{
				path: "comisiones",
				component: CommissionsComponent
			},
			{
				path: "agenciamiento",
				component: AgencyComponent
			},
			{
				path: "delimitacion",
				component: DelimitationComponent
			},
			{
				path: "**",
				redirectTo: "tasas",
				pathMatch: "full"
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SubscriptionsRoutingModule {
}
