import { Routes } from '@angular/router';
import { Rols } from '../../shared/security/access.mapping';
import { AuthGuard } from '../../shared/services/auth/auth.guard';
import { ManageRestrictionComponent } from './container/manage-restriction/manage-restriction.component';
import { ManageSingleChannelComponent } from './container/manage-single-channel/manage-single-channel.component';


export const ChannelRestrictionRoutes: Routes = [
	{
		path: '',
		component: ManageSingleChannelComponent,
		canActivate: [AuthGuard],
		data: { title: 'Lista de Canales', breadcrumb: 'Gestionar Canales', rols: [Rols.tec_admin, Rols.soat_tecnica, Rols.consultant] }
	},
	{
		path: 'channel/restrictions',
		component: ManageRestrictionComponent,
		canActivate: [AuthGuard],
		data: { title: 'Restricciones', breadcrumb: 'Restricciones', rols: [Rols.tec_admin, Rols.soat_tecnica, Rols.consultant] }
	}
];
