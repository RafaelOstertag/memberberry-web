import {Component, OnInit} from '@angular/core';
import {KeycloakService} from "keycloak-angular";
import {KeycloakProfile} from "keycloak-js";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public isLoggedIn: boolean = false
  public isMenuCollapsed: boolean = true
  public userProfile: KeycloakProfile | null = null

  constructor(private readonly keycloak: KeycloakService) {
  }

  public async ngOnInit() {
    this.isLoggedIn = await this.keycloak.isLoggedIn()

    if (!this.isLoggedIn) {
      await this.keycloak.login()
      this.userProfile = await this.keycloak.loadUserProfile()
    }
  }
}
