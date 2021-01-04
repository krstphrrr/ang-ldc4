import { Component, Inject, ViewChild } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import {DOCUMENT} from '@angular/common'
import { MatMenu } from '@angular/material/menu';

@Component({
  selector: 'app-logout-component',
  templateUrl: './logout-component.component.html',
  styleUrls: ['./logout-component.component.css'],

})
export class LogoutComponentComponent{
  @ViewChild(MatMenu, {static: true}) menu: MatMenu;

  constructor(@Inject(DOCUMENT) private doc: Document, public auth: AuthService) { }

  logout(): void {
    this.auth.logout({ returnTo: this.doc.location.origin })
  }

}
