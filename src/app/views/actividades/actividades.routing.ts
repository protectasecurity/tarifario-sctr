import { AuthGuard } from './../../shared/services/auth/auth.guard';
import { Routes } from "@angular/router";
import { ActividadesContainerComponent } from "./container/actividades-container/actividades-container.component";

export const RoutingActividades: Routes = [
	{
		path: '',
		component: ActividadesContainerComponent, canActivate: [AuthGuard],
		data: { title: 'Lista de Actividades Economicas', breadcrumb: 'Gestionar Actividades' }
	}
]
