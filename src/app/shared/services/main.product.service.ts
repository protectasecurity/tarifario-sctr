import { Injectable } from '@angular/core';

@Injectable()
export class MainProductServices {

	getMainProduct(): string {
		return window.localStorage['typeToken'] ? window.localStorage['typeToken'] : 'SOAT';
	}

	saveMainProduct(token: string) {
		window.localStorage['typeToken'] = token;
	}
}
