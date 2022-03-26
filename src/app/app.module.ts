import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {BerryListComponent} from './berry-list/berry-list.component';
import {BerrySummaryComponent} from './berry-summary/berry-summary.component';
import {FirstBerryComponent} from './first-berry/first-berry.component';
import {BASE_PATH, MemberberryServerApiModule} from "@memberberry-npm/memberberry-api-angular";
import {environment} from "../environments/environment";
import {HttpClientModule} from "@angular/common/http";
import {NewBerryComponent} from './new-berry/new-berry.component';
import {FormsModule} from "@angular/forms";
import {UpdateBerryComponent} from './update-berry/update-berry.component';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'https://sso.guengel.ch/auth/',
        realm: 'memberberry',
        clientId: 'memberberry-web-ui'
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html'
      }
    });
}

@NgModule({
  declarations: [
    AppComponent,
    BerryListComponent,
    BerrySummaryComponent,
    FirstBerryComponent,
    NewBerryComponent,
    UpdateBerryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    KeycloakAngularModule,
    NgbModule,
    HttpClientModule,
    MemberberryServerApiModule,
    FormsModule,
  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: initializeKeycloak,
    multi: true,
    deps: [KeycloakService]
  },
    {provide: BASE_PATH, useValue: environment.serverUrl}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
