import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2 } from '@angular/core';
import { getQueryParam } from '../helpers/url.helper';

interface ITheme {
	name: string;
	baseColor?: string;
	isActive?: boolean;
}

@Injectable()
export class ThemeService {
	public egretThemes: ITheme[] = [
		{
			name: 'egret-dark-purple',
			baseColor: '#9c27b0',
			isActive: false
		},
		{
			name: 'egret-dark-pink',
			baseColor: '#e91e63',
			isActive: false
		},
		{
			name: 'egret-blue',
			baseColor: '#247ba0',
			isActive: true
		},
		{
			name: 'egret-indigo',
			baseColor: '#3f51b5',
			isActive: false
		}
	];
	public activatedTheme: ITheme;

	constructor(@Inject(DOCUMENT) private document: Document) {}

	// Invoked in AppComponent and apply 'activatedTheme' on startup
	applyMatTheme(r: Renderer2) {
		/*
		 ****** (SET YOUR DEFAULT THEME HERE) *******
		 * Assign new Theme to activatedTheme
		 */
		// this.activatedTheme = this.egretThemes[0];
		// this.activatedTheme = this.egretThemes[1];
		this.activatedTheme = this.egretThemes[2];
		// this.activatedTheme = this.egretThemes[3];

		// *********** ONLY FOR DEMO **********
		this.setThemeFromQuery();
		// ************************************

		this.changeTheme(r, this.activatedTheme);
	}

	changeTheme(r: Renderer2, theme: ITheme) {
		r.removeClass(this.document.body, this.activatedTheme.name);
		r.addClass(this.document.body, theme.name);
		this.flipActiveFlag(theme);
	}
	flipActiveFlag(theme: ITheme) {
		this.egretThemes.forEach(t => {
			t.isActive = false;
			if (t.name === theme.name) {
				t.isActive = true;
				this.activatedTheme = theme;
			}
		});
	}

	// *********** ONLY FOR DEMO **********
	setThemeFromQuery() {
		const themeStr = getQueryParam('theme');
		try {
			this.activatedTheme = JSON.parse(themeStr);
			this.flipActiveFlag(this.activatedTheme);
		} catch (e) {}
	}
}
