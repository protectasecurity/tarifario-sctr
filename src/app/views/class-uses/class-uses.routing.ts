import { Routes } from "@angular/router";
import { AuthGuard } from "./../../shared/services/auth/auth.guard";

import { ClassUsesComponent } from "./container/tab-uses-class/class-uses.component";
import { UseClassContainerComponent } from "./container/use-class-container/use-class-container.component";

export const ClassUsesRoutes: Routes = [
	{
		path: '',
		component: ClassUsesComponent,
		canActivate: [AuthGuard],
		data: { title: 'Lista de usos y clases', breadcrumb: 'CLASSUSES' }
	}, {
		path: 'create/:data',
		component: UseClassContainerComponent,
		canActivate: [AuthGuard],
		data: { title: 'Asociar uso y clases', breadcrumb: 'Nueva asociacion' }
	}
];
