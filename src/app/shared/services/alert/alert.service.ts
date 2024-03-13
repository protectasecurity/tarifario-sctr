import { Injectable } from '@angular/core';
import { Alert, IAlert } from '../../models/alert.model';

@Injectable()
export class AlertService {
	private alerts: IAlert[];

	constructor() {
		this.alerts = [];
		this.set();
	}

	push(title: string, message: string, type: string) {
		const alert = new Alert();
		alert.title = title;
		alert.message = message;
		alert.type = type;
		this.alerts.push(alert);
		this.set();
	}

	all(): IAlert[] {
		this.get();
		return this.alerts;
	}

	clear() {
		this.alerts = [];
		this.set();
	}

	private set(): void {
		try {
			localStorage.setItem('ALERTS', JSON.stringify(this.alerts));
		} catch (e) {
			console.error('Error saving to localStorage', e);
		}
	}

	private get() {
		try {
			this.alerts = JSON.parse(localStorage.getItem('ALERTS'));
		} catch (e) {
			console.error('Error getting data from localStorage', e);
		}
	}
}
