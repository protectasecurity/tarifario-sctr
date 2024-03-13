import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, ResolveEnd, ResolveStart, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
/* import { TranslateService } from '@ngx-translate/core'; */
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
// import PerfectScrollbar from 'perfect-scrollbar';
import { LayoutService } from '../../../services/layout.service';
import { ThemeService } from '../../../services/theme.service';
import { MainProductServices } from './../../../services/main-product.service';

@Component({
	selector: 'app-admin-layout',
	templateUrl: './admin-layout.template.html'
})
export class AdminLayoutComponent implements OnInit, AfterViewInit {
	public isModuleLoading: Boolean = false;
	private moduleLoaderSub: Subscription;
	private layoutConfSub: Subscription;
	private routerEventSub: Subscription;
	public scrollConfig = {};
	public layoutConf: any = {};

	constructor(private router: Router, public themeService: ThemeService, private layout: LayoutService, private typeService: MainProductServices) {
		// Close sidenav after route change in mobile
		this.routerEventSub = router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((routeChange: NavigationEnd) => {
			this.layout.adjustLayout({ route: routeChange.url });
		});

		// Translator init
		/* 	const browserLang: string = translate.getBrowserLang();
		translate.use(browserLang.match(/en|fr/) ? browserLang : 'en'); */
	}
	ngOnInit() {
		this.layoutConf = this.layout.layoutConf;
		// FOR MODULE LOADER FLAG
		// this.typeService.saveMainProduct("SOAT");
		this.moduleLoaderSub = this.router.events.subscribe(event => {
			if (event instanceof RouteConfigLoadStart || event instanceof ResolveStart) {
				this.isModuleLoading = true;
			}
			if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
				this.isModuleLoading = false;
			}
		});
	}
	@HostListener('window:resize', ['$event'])
	onResize(event) {
		this.layout.adjustLayout(event);
	}

	ngAfterViewInit() {
		// this.layoutConfSub = this.layout.layoutConf$.subscribe(change => {
		//   // this.initBodyPS(change)
		// })
	}

	// initBodyPS(layoutConf:any = {}) {
	//   if(layoutConf.navigationPos === 'side' && layoutConf.topbarFixed) {
	//     if (this.bodyPS) this.bodyPS.destroy();
	//     if (this.headerFixedBodyPS) this.headerFixedBodyPS.destroy();
	//     this.headerFixedBodyPS = new PerfectScrollbar('.rightside-content-hold', {
	//       suppressScrollX: true
	//     });
	//     this.scrollToTop('.rightside-content-hold');
	//   } else {
	//     if (this.bodyPS) this.bodyPS.destroy();
	//     if (this.headerFixedBodyPS) this.headerFixedBodyPS.destroy();
	//     this.bodyPS = new PerfectScrollbar('.main-content-wrap', {
	//       suppressScrollX: true
	//     });
	//     this.scrollToTop('.main-content-wrap');
	//   }
	// }
	scrollToTop(selector: string) {
		if (document) {
			const element = <HTMLElement>document.querySelector(selector);
			element.scrollTop = 0;
		}
	}
	ngOnDestroy() {
		if (this.moduleLoaderSub) {
			this.moduleLoaderSub.unsubscribe();
		}
		if (this.layoutConfSub) {
			this.layoutConfSub.unsubscribe();
		}
		if (this.routerEventSub) {
			this.routerEventSub.unsubscribe();
		}
	}
	closeSidebar() {
		this.layout.publishLayoutChange({
			sidebarStyle: 'closed'
		});
	}
}
