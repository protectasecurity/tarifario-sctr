import { Observable } from 'rxjs';
import { Ubigeo } from '../../../views/zones/models/ubigeo.model';
import { Zone } from '../../../views/zones/models/zone.model';

export interface ZoneProvider {
	list(): Observable<Zone[]>;
	listUbigeos(): Observable<Ubigeo[]>;
	updateOrder(valueZone: Zone, afterZone: Zone): void;
	save(value: Zone): void;
	delete(value: Zone): void;
}
