import { Component, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Router } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import { KeycloakService } from "keycloak-angular";
import { Subscription } from 'rxjs';
import { environment } from "../../../../environments/environment";
import { NavigationService } from '../../../shared/services/navigation.service';
import { ThemeService } from '../../../shared/services/theme.service';
import { LayoutService } from '../../services/layout.service';
import { MainProductServices } from '../../services/main-product.service';

@Component({
	selector: 'app-header-top',
	templateUrl: './header-top.component.html'
})
export class HeaderTopComponent implements OnInit, OnDestroy {
	layoutConf: any;
	menuItems: any;
	menuItemSub: Subscription;
	egretThemes: any[] = [];
	typeTarif: string = "SOAT";
	currentLang = 'en';
	availableLangs = [
		{
			name: 'English',
			code: 'en'
		},
		{
			name: 'Spanish',
			code: 'es'
		}
	];
	@Input() notificPanel;
	@Input() tarifarioPanel;

	constructor(
		private layout: LayoutService,
		private navService: NavigationService,
		public themeService: ThemeService,
		public translate: TranslateService,
		private renderer: Renderer2,
		public r: Router,
		private typeService: MainProductServices,
		private keycloakService: KeycloakService
	) { }

	ngOnInit() {
		if (this.typeService.getMainProduct() != null) {
			this.typeTarif = (this.typeService.getMainProduct() === 'SCTR') ? 'SCTR' : 'SOAT';
		}
		this.layoutConf = this.layout.layoutConf;
		this.egretThemes = this.themeService.egretThemes;
		this.menuItemSub = this.navService.menuItems$.subscribe(res => {
			res = res.filter(item => item.type !== 'icon' && item.type !== 'separator');
			const limit = 6;
			const mainItems: any[] = res.slice(0, limit);
			if (res.length <= limit) {
				return (this.menuItems = mainItems);
			}
			const subItems: any[] = res.slice(limit, res.length - 1);
			mainItems.push({
				name: 'More',
				type: 'dropDown',
				tooltip: 'More',
				icon: 'more_horiz',
				sub: subItems
			});
			this.menuItems = mainItems;
		});
	}
	ngOnDestroy() {
		this.menuItemSub.unsubscribe();
	}
	/* setLang() {
		this.translate.use(this.currentLang);
	} */
	changeTheme(theme) {
		this.themeService.changeTheme(this.renderer, theme);
	}
	togglrTarifario(change: any) {
		if (change === "SOAT") {
			this.typeService.saveMainProduct("SOAT");
		} else {
			this.typeService.saveMainProduct("SCTR");
		}
		if (window.location.pathname === "/dashboard") {
			window.location.reload();
		} else {
			this.r.navigate(["/dashboard"]);
		}

	}

	goInicio() {
		this.r.navigate(["/dashboard"]);
	}

	toggleNotific() {
		this.notificPanel.toggle();
	}
	toggleNotificSw() {
		this.tarifarioPanel.toggle();
	}
	toggleSidenav() {
		if (this.layoutConf.sidebarStyle === 'closed') {
			return this.layout.publishLayoutChange({
				sidebarStyle: 'full'
			});
		}
		this.layout.publishLayoutChange({
			sidebarStyle: 'closed'
		});
	}

	logout() {
		this.keycloakService.logout();
	}
}
