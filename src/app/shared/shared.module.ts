import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import {
	MatButtonModule,
	MatCardModule,
	MatCheckboxModule,
	MatDialogModule,
	MatGridListModule,
	MatIconModule,
	MatListModule,
	MatMenuModule,
	MatOptionModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatRadioModule,
	MatRippleModule,
	MatSelectModule,
	MatSidenavModule,
	MatSnackBarModule,
	MatSortModule,
	MatTableModule,
	MatToolbarModule,
	MatTooltipModule
} from '@angular/material';

// ONLY REQUIRED FOR **SIDE** NAVIGATION LAYOUT
import { HeaderSideComponent } from './components/header-side/header-side.component';
import { SidebarSideComponent } from './components/sidebar-side/sidebar-side.component';

// ONLY REQUIRED FOR **TOP** NAVIGATION LAYOUT
import { HeaderTopComponent } from './components/header-top/header-top.component';
import { SidebarTopComponent } from './components/sidebar-top/sidebar-top.component';

// ALL TIME REQUIRED
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { AdminLayoutComponent } from './components/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './components/layouts/auth-layout/auth-layout.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { TarifariosComponent } from "./components/tarifarios/tarifarios.component";
import { AppComfirmComponent } from './services/app-confirm/app-confirm.component';
import { AppLoaderComponent } from './services/app-loader/app-loader.component';

// DIRECTIVES
import { DropdownAnchorDirective } from './directives/dropdown-anchor.directive';
import { DropdownLinkDirective } from './directives/dropdown-link.directive';
import { AppDropdownDirective } from './directives/dropdown.directive';
import { EgretSideNavToggleDirective } from './directives/egret-side-nav-toggle.directive';
import { FontSizeDirective } from './directives/font-size.directive';
import { ScrollToDirective } from './directives/scroll-to.directive';

// PIPES
import { ExcerptPipe } from './pipes/excerpt.pipe';
import { GetValueByKeyPipe } from './pipes/get-value-by-key.pipe';
import { RelativeTimePipe } from './pipes/relative-time.pipe';

// SERVICES
import { DecimalNumberDirective } from './directives/decimal-number-directive';
import { DisableControlDirective } from './directives/disable-control-directive';
import { OnlyNumberDirective } from './directives/only-number.directive';

import { AppConfirmService } from './services/app-confirm/app-confirm.service';
import { AppLoaderService } from './services/app-loader/app-loader.service';
import { AuthGuard } from './services/auth/auth.guard';
import { LayoutService } from './services/layout.service';
import { MainProductServices } from './services/main-product.service';
import { NavigationService } from './services/navigation.service';
import { RoutePartsService } from './services/route-parts.service';
import { ThemeService } from './services/theme.service';
const classesToInclude = [
	HeaderTopComponent,
	SidebarTopComponent,
	SidenavComponent,
	NotificationsComponent,
	TarifariosComponent,
	SidebarSideComponent,
	HeaderSideComponent,
	AdminLayoutComponent,
	AuthLayoutComponent,
	BreadcrumbComponent,
	AppComfirmComponent,
	AppLoaderComponent,
	FontSizeDirective,
	ScrollToDirective,
	AppDropdownDirective,
	DropdownAnchorDirective,
	DropdownLinkDirective,
	EgretSideNavToggleDirective,
	OnlyNumberDirective,
	DecimalNumberDirective,
	RelativeTimePipe,
	ExcerptPipe,
	GetValueByKeyPipe,
	DisableControlDirective
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		FlexLayoutModule,
		TranslateModule,
		MatSidenavModule,
		MatListModule,
		MatTooltipModule,
		MatOptionModule,
		MatSelectModule,
		MatMenuModule,
		MatSnackBarModule,
		MatGridListModule,
		MatToolbarModule,
		MatIconModule,
		MatButtonModule,
		MatRadioModule,
		MatCheckboxModule,
		MatCardModule,
		MatProgressSpinnerModule,
		MatRippleModule,
		MatDialogModule,
		PerfectScrollbarModule,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule
	],
	entryComponents: [AppComfirmComponent, AppLoaderComponent],
	providers: [
		ThemeService,
		LayoutService,
		MainProductServices,
		NavigationService,
		RoutePartsService,
		AuthGuard,
		AppConfirmService,
		AppLoaderService
	],
	declarations: [classesToInclude],
	exports: [classesToInclude]
})
export class SharedModule { }
