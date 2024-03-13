import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Router, NavigationEnd } from '@angular/router';

@Component({
	selector: 'app-notifications',
	templateUrl: './notifications.component.html'
})
export class NotificationsComponent implements OnInit {
	@Input() notificPanel;
	@Input() tarifarioPanel;
	data: any[];
	visible: boolean = false;

	// Dummy notifications
	notifications = [{
		message: 'New contact added',
		icon: 'assignment_ind',
		time: '1 min ago',
		route: '/inbox',
		color: 'primary'
	}, {
		message: 'New message',
		icon: 'chat',
		time: '4 min ago',
		route: '/chat',
		color: 'accent'
	}, {
		message: 'Server rebooted',
		icon: 'settings_backup_restore',
		time: '12 min ago',
		route: '/charts',
		color: 'warn'
	}];

	switch = [{
		message: 'SOAT',
		icon: 'person_pin',
		time: '',
		route: '/dashboard',
		color: 'primary'
	}, {
		message: 'SCTR',
		icon: 'directions_car',
		time: '',
		route: '/dashboard',
		color: 'primary'
	}];



	constructor(private router: Router) { }

	ngOnInit() {

		this.router.events.subscribe((routeChange) => {
			if (routeChange instanceof NavigationEnd) {
				this.notificPanel.close();
			}
		});
		this.router.events.subscribe((routeChange) => {
			if (routeChange instanceof NavigationEnd) {
				this.tarifarioPanel.close();
			}
		});
	}
	clearAll(e) {
		e.preventDefault();
		this.notifications = [];
	}
}
