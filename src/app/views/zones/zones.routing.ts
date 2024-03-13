import { Routes } from '@angular/router';
import { Rols } from "../../shared/security/access.mapping";
import { AuthGuard } from "../../shared/services/auth/auth.guard";
import { ZonesCreateComponent } from "./container/zones-create/zones-create.component";
import { ZonesComponent } from "./container/zones/zones.component";

export const ZonesRoutes: Routes = [
	{
		path: '',
		component: ZonesComponent,
		canActivate: [AuthGuard],
		data: { title: 'Lista de zonas', breadcrumb: 'ZONAS', rols: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica, Rols.consultant] }
	},
	{
		path: 'create',
		component: ZonesCreateComponent,
		canActivate: [AuthGuard],
		data: { title: 'Definir Zonas', breadcrumb: 'Gestionar Zonas', rols: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] }
	},
	{
		path: 'edit/:zoneId',
		component: ZonesCreateComponent,
		canActivate: [AuthGuard],
		data: { title: 'Definir Zonas', breadcrumb: 'Gestionar Zonas', rols: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica, Rols.consultant] }
	}
];
