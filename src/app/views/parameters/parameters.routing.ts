import { Routes } from "@angular/router";
import { ParametersModalComponent } from "./components/parameters-modal/parameters-modal";
import { ParametersComponent } from './container/parameters/parameters.component';

export const ParametersRoutes: Routes = [
	{
		path: '',
		component: ParametersComponent,
		data: { title: 'Lista de parametros', breadcrumb: 'PARAMETROS' }
	},
	{
		path: 'create',
		component: ParametersModalComponent,
		data: { title: 'Crear Parametros', breadcrumb: 'Gestionar Parametros' }
	},
	{
		path: 'edit/:groupId',
		component: ParametersModalComponent,
		data: { title: 'Crear Parametros', breadcrumb: 'Gestionar Parametros' }
	}
];
