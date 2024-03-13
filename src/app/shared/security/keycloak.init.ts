import { environment } from "environments/environment";
import { KeycloakService } from "keycloak-angular";


export function initializer(keycloak: KeycloakService): () => Promise<any> {
	return (): Promise<any> => {
		return new Promise(async (resolve, reject) => {
			try {
				await keycloak.init({
					config: {
						url: environment.keyCloakUrl,
						realm: "soat",
						clientId: "soat-frontend"
					},
					initOptions: {
						onLoad: "login-required",
						checkLoginIframe: false
					},
				});
				resolve();
			} catch (error) {
				reject(error);
			}
		});
	};
}
