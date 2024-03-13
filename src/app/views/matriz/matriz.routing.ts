import { Routes } from "@angular/router";
import { Rols } from "../../shared/security/access.mapping";
import { MatrizCreateContainerComponent } from "./container/matriz-create-container/matriz-create-container.component";
import { MatrizListContainerComponent } from "./container/matriz-list-container/matriz-list-container.component";
import { MatrizSearchComponent } from "./container/matriz-search/matriz-search.component";


export const MatrizRoutes: Routes = [
	{
		path: 'list',
		component: MatrizListContainerComponent,
		data: { title: 'Lista de Tarifas SCTR', breadcrumb: 'Lista de tarifas SCTR' }
	},
	{
		path: 'search',
		component: MatrizSearchComponent,
		data: { title: 'Lista de tarifas de canal SCTR', breadcrumb: 'Lista de tarifas de canal SCTR'}
	},
	{
		path: 'list-special',
		component: MatrizListContainerComponent,
		data: { title: 'Lista de Tarifas SCTR', breadcrumb: 'Lista de tarifas SCTR' }
	},
	{
		path: 'manage',
		component: MatrizCreateContainerComponent,
		data: { title: 'Nueva Tarifa SCTR', breadcrumb: 'Nueva Tarifa SCTR' }
	},
	{
		path: 'details/:Id',
		component: MatrizCreateContainerComponent,
		data: { title: 'Editar Tarifa SCTR', breadcrumb: 'Editar Tarifa SCTR' }
	},
	{
		path: 'specialchannel',
		component: MatrizCreateContainerComponent,
		data: { title: 'Nueva tarifa SCTR - Campaña', breadcrumb: 'Nueva tarifa de campaña SCTR' }
	},
	{
		path: 'managecampaign',
		component: MatrizCreateContainerComponent,
		data: { title: 'Nueva tarifa SCTR - Campaña', breadcrumb: 'Nueva tarifa de campaña SCTR' }
	},
	{
		path: 'campaign/:Id',
		component: MatrizCreateContainerComponent,
		data: { title: 'Nueva tarifa de canal SCTR', breadcrumb: 'Nueva Tarifa de canal SCTR' }
	},
	{
		path: 'basechannel/:Id',
		component: MatrizCreateContainerComponent,
		data: { title: 'Nueva tarifa de canal SCTR', breadcrumb: 'Nueva Tarifa de canal SCTR' }
	},
	{
		path: 'basespecialchannel/:Id',
		component: MatrizCreateContainerComponent,
		data: { title: 'Nueva tarifa de canal SCTR', breadcrumb: 'Nueva Tarifa de canal SCTR' }
	},
	{
		path: 'clone/:Id',
		component: MatrizCreateContainerComponent,
		data: { title: 'Nueva tarifa de canal SCTR', breadcrumb: 'Nueva Tarifa de canal SCTR' }
	},
];
