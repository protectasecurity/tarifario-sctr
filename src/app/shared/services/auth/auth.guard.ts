import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from "keycloak-angular";

@Injectable()
export class AuthGuard extends KeycloakAuthGuard {
	constructor(protected router: Router, protected keycloakAngular: KeycloakService) {
		super(router, keycloakAngular);
	}


	isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
		return new Promise((resolve, reject) => {
			if (!this.keycloakAngular.isLoggedIn()) {
				this.keycloakAngular.login();
				return;
			}
			const requiredRoles = route.data.rols;
			if (!requiredRoles || requiredRoles.length === 0) {
				return resolve(true);
			} else {

				let granted: boolean = false;
				for (const requiredRole of requiredRoles) {
					if (this.keycloakAngular.isUserInRole(requiredRole)) {
						granted = true;
						break;
					}
				}
				resolve(granted);
			}
		});
	}
}
