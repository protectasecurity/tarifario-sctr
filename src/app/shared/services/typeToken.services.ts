import { Injectable } from "@angular/core";

@Injectable()
export class TypeTokenServices{

	getToken(): string {
		return window.localStorage['typeToken'];
	}

	saveToken(token: string) {
		window.localStorage['typeToken'] = token;
	}
}
