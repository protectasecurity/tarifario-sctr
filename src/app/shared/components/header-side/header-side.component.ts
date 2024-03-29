import { Component, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from '../../services/layout.service';
import { ThemeService } from '../../services/theme.service';

@Component({
	selector: 'app-header-side',
	templateUrl: './header-side.template.html'
})
export class HeaderSideComponent implements OnInit {
	// @Input() notificPanel;
	@Input() tarifarioPanel;
	currentLang = 'en';
	public availableLangs = [
		{
			name: 'English',
			code: 'en'
		},
		{
			name: 'Spanish',
			code: 'es'
		}
	];
	public egretThemes;
	public layoutConf: any;
	constructor(private themeService: ThemeService, private layout: LayoutService, public translate: TranslateService, private renderer: Renderer2) {}
	ngOnInit() {
		this.egretThemes = this.themeService.egretThemes;
		this.layoutConf = this.layout.layoutConf;
		this.translate.use(this.currentLang);
	}
	setLang(e) {
		this.translate.use(this.currentLang);
	}
	changeTheme(theme) {
		this.themeService.changeTheme(this.renderer, theme);
	}
	// toggleNotific() {
	// 	this.notificPanel.toggle();
	// }
	toggleTarifario(){
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

	toggleCollapse() {
		// compact --> full
		if (this.layoutConf.sidebarStyle === 'compact') {
			return this.layout.publishLayoutChange(
				{
					sidebarStyle: 'full'
				},
				{ transitionClass: true }
			);
		}

		// * --> compact
		this.layout.publishLayoutChange(
			{
				sidebarStyle: 'compact'
			},
			{ transitionClass: true }
		);
	}
}
