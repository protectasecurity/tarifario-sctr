import { Routes } from '@angular/router';
import { Rols } from "../../shared/security/access.mapping";
import { AuthGuard } from "../../shared/services/auth/auth.guard";
import { RiskGroupContainerComponent } from './container/risk-group-container/risk-group-container.component';
import { RiskGroupListContainerComponent } from './container/risk-group-list-container/risk-group-list-container.component';

export const RiskGroupRoutes: Routes = [
	{
		path: '',
		component: RiskGroupListContainerComponent,
		canActivate: [AuthGuard],
		data: { title: 'Lista de Grupos de Riesgo', breadcrumb: 'GRUPORIESGO', rols: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica, Rols.consultant] }
	},
	{
		path: 'create',
		component: RiskGroupContainerComponent,
		canActivate: [AuthGuard],
		data: { title: 'Nuevo grupo de riesgo', breadcrumb: 'Nuevo grupo de riesgo', rols: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] }
	},
	{
		path: 'edit/:groupId',
		component: RiskGroupContainerComponent,
		canActivate: [AuthGuard],
		data: { title: 'Editar grupo de riesgo', breadcrumb: 'Editar grupo de riesgo', rols: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica, Rols.consultant] }
	},
	{
		path: 'clone/:groupId/:isClone',
		component: RiskGroupContainerComponent,
		canActivate: [AuthGuard],
		data: { title: 'Editar grupo de riesgo', breadcrumb: 'Editar grupo de riesgo', rols: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] }
	}
];
