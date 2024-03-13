import { Routes } from '@angular/router';
import { Rols } from "../../shared/security/access.mapping";
import { AuthGuard } from "../../shared/services/auth/auth.guard";
import { FeeCreateContainerComponent } from './container/fee-create-container/fee-create-container.component';
import { FeeListContainerComponent } from './container/fee-list-container/fee-list-container.component';
import { FeeListSpecialContainerComponent } from './container/fee-list-special-container/fee-list-special-container.component';
import { FeeSearchComponent } from './container/fee-search/fee-search.component';

export const FeeRoutes: Routes = [
	{
		path: 'list',
		component: FeeListContainerComponent,
		canActivate: [AuthGuard],
		data: { title: 'Lista de Tarifas SOAT', breadcrumb: 'Lista de tarifas SOAT', rols: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica, Rols.consultant] }
	},
	{
		path: 'manage',
		component: FeeCreateContainerComponent,
		canActivate: [AuthGuard],
		data: { title: 'Nueva Tarifa SOAT', breadcrumb: 'Nueva Tarifa SOAT', rols: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] }
	},
	{
		path: 'details/:Id',
		component: FeeCreateContainerComponent,
		canActivate: [AuthGuard],
		data: { title: 'Editar Tarifa SOAT', breadcrumb: 'Editar Tarifa SOAT', rols: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica, Rols.consultant] }
	},
	{
		path: 'clone/:Id',
		component: FeeCreateContainerComponent,
		canActivate: [AuthGuard],
		data: { title: 'Clonar Tarifa SOAT', breadcrumb: 'Clonar Tarifa SOAT', rols: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] }
	},
	{
		path: 'campaign/:Id',
		component: FeeCreateContainerComponent,
		canActivate: [AuthGuard],
		data: { title: 'Nueva Tarifa SOAT - Campaña', breadcrumb: 'Nueva Tarifa SOAT - Campaña', rols: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] }
	},
	{
		path: 'basechannel/:Id',
		component: FeeCreateContainerComponent,
		canActivate: [AuthGuard],
		data: { title: 'Nueva tarifa de canal SOAT', breadcrumb: 'Nueva Tarifa de canal SOAT', rols: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] }
	},
	{
		path: 'basespecialchannel/:Id',
		component: FeeCreateContainerComponent,
		canActivate: [AuthGuard],
		data: { title: 'Nueva tarifa de canal SOAT', breadcrumb: 'Nueva tarifa de canal SOAT', rols: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] }
	},
	{
		path: 'specialchannel',
		component: FeeCreateContainerComponent,
		canActivate: [AuthGuard],
		data: { title: 'Nueva tarifa SOAT - Campaña', breadcrumb: 'Nueva tarifa de campaña SOAT', rols: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] }
	},
	{
		path: 'managecampaign',
		component: FeeCreateContainerComponent,
		canActivate: [AuthGuard],
		data: { title: 'Nueva tarifa SOAT - Campaña', breadcrumb: 'Nueva tarifa de campaña SOAT', rols: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] }
	},
	{
		path: 'listspecial',
		component: FeeListSpecialContainerComponent,
		canActivate: [AuthGuard],
		data: { title: 'Lista de tarifas de canal SOAT', breadcrumb: 'Lista de tarifas de canal SOAT', rols: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica, Rols.consultant] }
	},
	{
		path: 'search',
		component: FeeSearchComponent,
		canActivate: [AuthGuard],
		data: { title: 'Lista de tarifas de canal SOAT', breadcrumb: 'Lista de tarifas de canal SOAT', rols: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica, Rols.consult_prima, Rols.soat_comercial, Rols.sctr_comercial, Rols.sctr_soat_soporte, Rols.sctr_soat_comercial] }
	}
];
