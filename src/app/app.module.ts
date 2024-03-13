import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from "@angular/common/http";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GestureConfig } from "@angular/material";
import { BrowserModule, HAMMER_GESTURE_CONFIG } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { InMemoryWebApiModule } from "angular-in-memory-web-api";
import { KeycloakService } from "keycloak-angular";
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { NgxSpinnerModule } from "ngx-spinner";
import { environment } from "../environments/environment";
import { AppEffects } from "./_state/effects/app.effects";
import { metaReducers, reducers } from "./_state/reducers";
import { AppComponent } from "./app.component";
import { rootRouterConfig } from "./app.routing";
import { MainProductServices } from './shared/services/main.product.service';

import { InMemoryDataService } from "./shared/inmemory-db/inmemory-db.service";
import { MaterialModule } from "./shared/modules/material.module";
import { initializer } from "./shared/security/keycloak.init";
import { AuthGuard } from "./shared/services/auth/auth.guard";

import { SharedModule } from "./shared/shared.module";
import { TokenInterceptor } from "./token.interceptor";
import { FeePickerDialogComponent } from "./views/dashboard/components/fee-picker-dialog/fee-picker-dialog";
import { MatrizPickerDialogComponent } from "./views/dashboard/components/matriz-picker-dialog/matriz-picker-dialog.component";
import { ChannelChildDialogComponent } from "./views/fee/components/channel-child-dialog/channel-child-dialog";
import { ChannelChildFeeDialogComponent } from "./views/fee/components/channel-child-fee-dialog/channel-child-fee-dialog";
import { StartEndDateDialogComponent } from "./views/fee/components/startenddate-dialog/startenddate-dialog";

export function HttpLoaderFactory(httpClient: HttpClient) {
	return new TranslateHttpLoader(httpClient);
}

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
	suppressScrollX: true
};

@NgModule({
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		SharedModule,
		HttpClientModule,
		PerfectScrollbarModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		}),
		InMemoryWebApiModule.forRoot(InMemoryDataService, { passThruUnknownUrl: true }),
		RouterModule.forRoot(rootRouterConfig, { useHash: false }),
		MaterialModule,
		NgxSpinnerModule,
		StoreModule.forRoot(reducers, { metaReducers }),
		EffectsModule.forRoot([AppEffects]),
		!environment.production ? StoreDevtoolsModule.instrument() : []
	],
	declarations: [
		AppComponent,
		FeePickerDialogComponent,
		MatrizPickerDialogComponent,
		StartEndDateDialogComponent,
		ChannelChildDialogComponent,
		ChannelChildFeeDialogComponent
	],
	entryComponents: [
		FeePickerDialogComponent,
		MatrizPickerDialogComponent,
		StartEndDateDialogComponent,
		ChannelChildDialogComponent,
		ChannelChildFeeDialogComponent
	],
	providers: [
		MainProductServices,
		KeycloakService,
		AuthGuard,
		{
			provide: APP_INITIALIZER,
			useFactory: initializer,
			deps: [KeycloakService],
			multi: true
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: TokenInterceptor,
			multi: true
		},
		{ provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
		{ provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG }
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
