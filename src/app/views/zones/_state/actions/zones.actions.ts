import { Action } from "@ngrx/store";
import { Ubigeo } from "../../models/ubigeo.model";
import { Zone } from "../../models/zone.model";

export enum ZonesActionTypes {
	Load = "[Zones] Load",
	LoadComplete = "[Zones] Load Complete",
	HandleErrors = "[Zones] HandleErrors",
	LoadLocations = "[Zones] Load Location",
	LoadLocationsComplete = "[Zones] Load Location Complete",
	/* 	CreateZoneInit = '[Zones] Create new Zone',
	CreateZoneComplete = '[Zones] Create new Zone Complete', */
	CreateZoneMasiveInit = "[Zones] Create new Zone Masive",
	CreateZoneMasiveComplete = "[Zones] Create new Zone MasiveComplete",
	UpdateZoneInit = "[Zones] Update Zone",
	UpdateZoneComplete = "[Zones] Update zone Complete",
	DeleteZoneInit = "[Zones] 	Delete Zone",
	DeleteZoneComplete = "[Zones]	Delete zone Complete",
	ReorderZoneInit = "[Zones] Reorder Zone",
	ReorderZoneComplete = "[Zones] Reorder Zone Complete",
	GetZoneById = "[Zones] Get Zone",
	GetZoneByIdComplete = "[Zones] Get Zone Complete",
	SetDefaultZone = '[Zones] Set Default Zone'
}

// Obtener Listado de Zonas
export class Load implements Action {
	readonly type = ZonesActionTypes.Load;

	constructor() {
	}
}

export class LoadComplete implements Action {
	readonly type = ZonesActionTypes.LoadComplete;

	constructor(public payload: Zone[]) {
	}
}

// Obtener Listado de Ubicaciones
export class LoadLocations implements Action {
	readonly type = ZonesActionTypes.LoadLocations;

	constructor() {
	}
}

export class LoadLocationsComplete implements Action {
	readonly type = ZonesActionTypes.LoadLocationsComplete;

	constructor(public payload: Ubigeo[]) {
	}
}

// Crear una nueva zona
/* export class CreateZoneInit implements Action {
	readonly type = ZonesActionTypes.CreateZoneInit;
	constructor(public payload: Zone) {}
}
export class CreateZoneComplete implements Action {
	readonly type = ZonesActionTypes.CreateZoneComplete;
	constructor() {}
} */

// Crear una nueva zona
export class CreateZoneMasiveInit implements Action {
	readonly type = ZonesActionTypes.CreateZoneMasiveInit;

	constructor(public payload: Zone[]) {
	}
}

export class CreateZoneMasiveComplete implements Action {
	readonly type = ZonesActionTypes.CreateZoneMasiveComplete;

	constructor() {
	}
}

// Crear una nueva zona
export class UpdateZoneInit implements Action {
	readonly type = ZonesActionTypes.UpdateZoneInit;
	constructor(public payload: Zone) { }
}

export class UpdateZoneComplete implements Action {
	readonly type = ZonesActionTypes.UpdateZoneComplete;
	constructor() { }
}

export class DeleteZoneInit implements Action {
	readonly type = ZonesActionTypes.DeleteZoneInit;
	constructor(public payload: Zone) { }
}

export class DeleteZoneComplete implements Action {
	readonly type = ZonesActionTypes.DeleteZoneComplete;

	constructor() {
	}
}

// Crear una nueva zona
export class ReorderZoneInit implements Action {
	readonly type = ZonesActionTypes.ReorderZoneInit;

	constructor(public payload: Zone) {
	}
}

export class ReorderZoneComplete implements Action {
	readonly type = ZonesActionTypes.ReorderZoneComplete;

	constructor() {
	}
}

// Gestor de Errores
export class HandledError implements Action {
	readonly type = ZonesActionTypes.HandleErrors;

	constructor(public payload: string) {
	}
}

export class GetZoneById implements Action {
	readonly type = ZonesActionTypes.GetZoneById;

	constructor(public zoneId: string) {
	}
}

export class GetZoneByIdComplete implements Action {
	readonly type = ZonesActionTypes.GetZoneByIdComplete;

	constructor(public payload: Zone) {
	}
}

export class SetDefaultZone implements Action {
	readonly type = ZonesActionTypes.SetDefaultZone;

	constructor() {
	}
}

export type Actions =
	| Load
	| LoadComplete
	| HandledError
	| CreateZoneMasiveInit
	| CreateZoneMasiveComplete
	| HandledError
	| LoadLocations
	| LoadLocationsComplete
	| UpdateZoneInit
	| UpdateZoneComplete
	| ReorderZoneInit
	| ReorderZoneComplete
	| GetZoneById
	| GetZoneByIdComplete
	| DeleteZoneInit
	| DeleteZoneComplete
	| SetDefaultZone;
