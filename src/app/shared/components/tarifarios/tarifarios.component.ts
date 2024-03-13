import { Component, Input, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { MainProductServices } from "../../services/main-product.service";
import { KeycloakService } from 'keycloak-angular';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
	selector: 'app-tarifarios',
	templateUrl: './tarifarios.component.html'
})

export class TarifariosComponent implements OnInit {

	@Input() tarifarioPanel;
	data: any[];
	visible: boolean = false;

	tarifario = [{
		message: 'Tarifario SCTR',
		type: 'SCTR',
		icon: 'person_pin',
		time: '',
		route: '/dashboard',
		color: 'primary'
	}, {
		message: 'Tarifario SOAT',
		type: 'SOAT',
		icon: 'directions_car',
		time: '',
		route: '/dashboard',
		color: 'primary'
	}];

	constructor(private router: Router, private typeService: MainProductServices, private keycloakService: KeycloakService) {
		this.Populate();
	}

	ngOnInit(): void {
		this.router.events.subscribe((routeChange) => {
			if (routeChange instanceof NavigationEnd) {
				this.tarifarioPanel.close();
			}
		});
	}

	togglrTarifario(change: any) {
		this.typeService.saveMainProduct(change);
		if (window.location.pathname === "/dashboard") {
			window.location.reload();
		} else {
			this.router.navigate(["/dashboard"]);
		}
	}

	private Populate() {
		const roles: string[] = this.keycloakService.getUserRoles();
		let accessSOAT = false;
		let accessSCTR = false;
		if (roles.length > 0) {
			roles.forEach(rol => {
				if (rol.search('SCTR') !== -1 || rol.search('tecnico') !== -1) {
					accessSCTR = true;
				}
				if (rol.search('SOAT') !== -1 || rol.search('tecnico') !== -1) {
					accessSOAT = true;
				}
			});
			if (accessSOAT === false) {
				this.tarifario.splice(1, 1);
			}
			if (accessSCTR === false) {
				this.tarifario.splice(0, 1);
			}
		}
	}
}
