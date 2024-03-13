import { Injectable } from "@angular/core";
import { KeycloakService } from "keycloak-angular";


export enum Rols {
	tec_admin = 'admin_tecnico',
	consultant = 'viewer_tecnico',
	consult_prima = 'comercial',
	sctr_tecnica = 'SCTR Técnica',
	soat_tecnica = 'SOAT Técnica',
	sctr_comercial = 'SCTR Comercial',
	soat_comercial = 'SOAT Comercial',
	sctr_soat_comercial = 'SCTR+SOAT  Comercial',
	sctr_soat_soporte = 'SCTR+SOAT Soporte',
}

export enum AppModules {
	zone = "Zonas",
	risk_group = "Grupo de Riesgos",
	channels = "Canales",
	channelRestriction = "Channels with restrictions",
	fee = "Tarifario SOAT",
	matriz = "Tarifario SOAT",
}

export enum EActions {
	sort = "Ordenar",
	edit = "Editar",
	delete = "Eliminar",
	changestate = "Spinner Estado",
	create = "Boton Nuevo o Crear",
	modification = "Permitir Modificacion",
	clone = "Clonar",
	export = "Exportar",
	createcampaing = "Crear Campaña",
	search = 'Consultar Primas'
}

interface Permits {
	module: string;
	action: string;
	rol_needed: string[];
}

@Injectable({
	providedIn: "root"
})
export class AccessMaping {

	private acctionPermits: Permits[];

	constructor(private keycloakService: KeycloakService) {
		this.Populate();
	}


	private Populate() {
		this.acctionPermits = [];
		// Zones Permits
		this.acctionPermits.push({ module: AppModules.zone, action: EActions.edit, rol_needed: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] });
		this.acctionPermits.push({ module: AppModules.zone, action: EActions.create, rol_needed: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] });
		this.acctionPermits.push({ module: AppModules.zone, action: EActions.delete, rol_needed: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] });
		this.acctionPermits.push({ module: AppModules.zone, action: EActions.modification, rol_needed: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] });
		this.acctionPermits.push({ module: AppModules.zone, action: EActions.changestate, rol_needed: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] });
		this.acctionPermits.push({ module: AppModules.zone, action: EActions.sort, rol_needed: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] });

		// Channels Permits
		this.acctionPermits.push({ module: AppModules.channels, action: EActions.edit, rol_needed: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] });
		this.acctionPermits.push({ module: AppModules.channels, action: EActions.create, rol_needed: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] });
		this.acctionPermits.push({ module: AppModules.channels, action: EActions.delete, rol_needed: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] });
		this.acctionPermits.push({ module: AppModules.channels, action: EActions.modification, rol_needed: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] });
		this.acctionPermits.push({ module: AppModules.channels, action: EActions.changestate, rol_needed: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] });

		// Channels with restrictions Permits
		this.acctionPermits.push({ module: AppModules.channelRestriction, action: EActions.edit, rol_needed: [Rols.tec_admin, Rols.soat_tecnica] });
		this.acctionPermits.push({ module: AppModules.channelRestriction, action: EActions.create, rol_needed: [Rols.tec_admin, Rols.soat_tecnica] });
		this.acctionPermits.push({ module: AppModules.channelRestriction, action: EActions.delete, rol_needed: [Rols.tec_admin, Rols.soat_tecnica] });
		this.acctionPermits.push({ module: AppModules.channelRestriction, action: EActions.modification, rol_needed: [Rols.tec_admin, Rols.soat_tecnica] });
		this.acctionPermits.push({ module: AppModules.channelRestriction, action: EActions.changestate, rol_needed: [Rols.tec_admin, Rols.soat_tecnica] });

		// Risk Group
		this.acctionPermits.push({ module: AppModules.risk_group, action: EActions.edit, rol_needed: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] });
		this.acctionPermits.push({ module: AppModules.risk_group, action: EActions.create, rol_needed: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] });
		this.acctionPermits.push({ module: AppModules.risk_group, action: EActions.delete, rol_needed: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] });
		this.acctionPermits.push({ module: AppModules.risk_group, action: EActions.modification, rol_needed: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] });
		this.acctionPermits.push({ module: AppModules.risk_group, action: EActions.changestate, rol_needed: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] });
		this.acctionPermits.push({ module: AppModules.risk_group, action: EActions.sort, rol_needed: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] });
		this.acctionPermits.push({ module: AppModules.risk_group, action: EActions.clone, rol_needed: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] });

		// Soat Tarifarios
		this.acctionPermits.push({ module: AppModules.fee, action: EActions.create, rol_needed: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] });
		this.acctionPermits.push({ module: AppModules.fee, action: EActions.changestate, rol_needed: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] });
		this.acctionPermits.push({ module: AppModules.fee, action: EActions.delete, rol_needed: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] });
		this.acctionPermits.push({ module: AppModules.fee, action: EActions.clone, rol_needed: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] });
		this.acctionPermits.push({ module: AppModules.fee, action: EActions.createcampaing, rol_needed: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] });
		this.acctionPermits.push({ module: AppModules.fee, action: EActions.modification, rol_needed: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] });
		this.acctionPermits.push({
			module: AppModules.fee, action: EActions.search, rol_needed: [Rols.tec_admin, Rols.soat_tecnica, Rols.consult_prima
				, Rols.sctr_comercial, Rols.soat_comercial, Rols.sctr_soat_comercial, Rols.sctr_soat_soporte]
		});

		// Soat Matriz
		this.acctionPermits.push({ module: AppModules.matriz, action: EActions.create, rol_needed: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] });
		this.acctionPermits.push({ module: AppModules.matriz, action: EActions.changestate, rol_needed: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] });
		this.acctionPermits.push({ module: AppModules.matriz, action: EActions.delete, rol_needed: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] });
		this.acctionPermits.push({ module: AppModules.matriz, action: EActions.clone, rol_needed: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] });
		this.acctionPermits.push({ module: AppModules.matriz, action: EActions.createcampaing, rol_needed: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] });
		this.acctionPermits.push({ module: AppModules.matriz, action: EActions.modification, rol_needed: [Rols.tec_admin, Rols.soat_tecnica, Rols.sctr_tecnica] });

	}


	public ShouldDo(pmodule: AppModules, paction: EActions): boolean {
		const permit = this.acctionPermits.filter(f => f.action === paction && f.module === pmodule);
		let granted: boolean = false;
		permit[0].rol_needed.forEach(value => {
			if (this.keycloakService.isUserInRole(value)) {
				granted = true;
			}
		});
		return granted;
	}


}
