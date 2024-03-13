import { Directive, Host, OnDestroy, OnInit, Optional, Self } from '@angular/core';
import { MediaChange } from '@angular/flex-layout';
import { MatSidenav } from '@angular/material';
import { Subscription } from 'rxjs';

@Directive({
	selector: '[EgretSideNavToggle]'
})
export class EgretSideNavToggleDirective implements OnInit, OnDestroy {
	isMobile;
	screenSizeWatcher: Subscription;
	constructor(@Host() @Self() @Optional() public sideNav: MatSidenav) {}

	ngOnInit() {
		this.initSideNav();
	}

	ngOnDestroy() {
		if (this.screenSizeWatcher) {
			this.screenSizeWatcher.unsubscribe();
		}
	}

	updateSidenav() {}
	initSideNav() {}
}
