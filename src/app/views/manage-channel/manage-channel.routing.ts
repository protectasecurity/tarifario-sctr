import { Routes } from '@angular/router';
import { Rols } from "../../shared/security/access.mapping";
import { AuthGuard } from "../../shared/services/auth/auth.guard";
import { ManageChannelCreateComponent } from './container/manage-channel-create/manage-channel-create.component';
import { ManageChannelComponent } from './container/manage-channel/manage-channel.component';

export const ManageChannelRoutes: Routes = [
	{
		path: '',
		component: ManageChannelComponent,
		canActivate: [AuthGuard],
		data: { title: 'Lista de Canales', breadcrumb: 'Gestionar Canales', rols: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica, Rols.consultant] }
	},
	{
		path: 'create',
		component: ManageChannelCreateComponent,
		canActivate: [AuthGuard],
		data: { title: 'Crear Canales', breadcrumb: 'Gestionar Canales', rols: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] }
	},
	{
		path: 'edit/:groupId',
		component: ManageChannelCreateComponent,
		canActivate: [AuthGuard],
		data: { title: 'Crear Canales', breadcrumb: 'Gestionar Canales', rols: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica, Rols.consultant] }
	}
];
