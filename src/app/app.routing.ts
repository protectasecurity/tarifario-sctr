import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './shared/components/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './shared/services/auth/auth.guard';

export const rootRouterConfig: Routes = [
	{
		path: '',
		redirectTo: 'dashboard',
		pathMatch: 'full'
	},
	{
		path: '',
		component: AdminLayoutComponent,
		children: [
			{
				path: 'dashboard',
				loadChildren: './views/dashboard/dashboard.module#DashboardModule',
				data: { title: 'Inicio', breadcrumb: 'INICIO' }
			},
			{
				path: 'fee',
				loadChildren: './views/fee/fee.module#FeeModule',
				data: { title: 'Tarifario', breadcrumb: 'Tarifario' }
			},
			{
				path: 'matriz',
				loadChildren: './views/matriz/matriz.module#MatrizModule',
				data: { title: 'Tarifario', breadcrumb: 'Tarifario' }
			},
			{
				path: 'risk-group',
				loadChildren: './views/risk-group/risk-group.module#RiskGroupModule',
				data: { title: 'Grupos de riesgo', breadcrumb: 'Grupos de Riesgo' }
			},
			{
				path: 'zones',
				loadChildren: './views/zones/zones.module#ZonesModule',
				data: { title: 'Lista de zonas', breadcrumb: 'Zonas' }
			},
			{
				path: 'parameters',
				loadChildren: './views/parameters/parameters.module#ParametersModule',
				data: { title: 'Lista de parametros', breadcrumb: 'Parametros' }
			},
			{
				path: 'class-uses',
				loadChildren: './views/class-uses/class-uses.module#ClassUsesModule',
				data: { title: 'Lista de clases a uso', breadcrumb: 'Clases a uso' }
			},
			{
				path: 'manage-channels',
				loadChildren: './views/manage-channel/manage-channel.module#ManageChannelModule',
				data: { title: 'Lista de Canales', breadcrumb: 'Gestionar Canales' }
			},
			{
				path: 'channel-restriction',
				loadChildren: './views/channel-restriction/channel-restriction.module#ChannelRestrictionModule',
				data: { title: 'Lista de Canales con restricciones', breadcrumb: 'Gestionar Canales con restricciones' }
			},
			/* {
				path: 'ktzones',
				loadChildren: './views/kt-zones/kt-zones.module#KtZonesModule',
				data: { title: 'Lista de zonas', breadcrumb: 'Zonas' }
			}, */
			{
				path: 'actividades',
				loadChildren: './views/actividades/actividades.module#ActividadesModule',
				data: { title: 'Lista de Actividades', breadcrumb: 'Gestionar Actividades' }
			}
		]
	},
	{
		path: '**',
		redirectTo: 'sessions/404'
	}
];
