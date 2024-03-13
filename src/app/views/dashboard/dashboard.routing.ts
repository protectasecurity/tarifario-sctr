import { Routes } from '@angular/router';
import { AuthGuard } from './../../shared/services/auth/auth.guard';

import { DashboardComponent } from './container/dashboard.component';

export const DashboardRoutes: Routes = [{ path: '', component: DashboardComponent, canActivate: [AuthGuard], data: { title: 'Dashboard' } }];
