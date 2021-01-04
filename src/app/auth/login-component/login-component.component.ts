import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';


@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css']
})
export class LoginComponentComponent{

  constructor(public auth:AuthService) { }

  login(): void {

    this.auth.loginWithRedirect();
  }

}
