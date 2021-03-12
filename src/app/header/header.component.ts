import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
// import { AuthService } from '../services/auth.service';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router'
import {LayerService} from '../services/layer.service'

import { LogoutComponentComponent} from '../auth/logout-component/logout-component.component'
import { UtilitiesService } from '../services/utilities.service'
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {
  @ViewChild(LogoutComponentComponent) childComponentMenu: LogoutComponentComponent;
  // x
  @Output() featureSelected = new EventEmitter<string>()
  isCollapsed: boolean = true;
  whichPage;
  durationInSeconds = 60;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';


  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  constructor(
    private _snackBar: MatSnackBar,
    private router:Router,
    private layerServ: LayerService,
    public auth: AuthService,
    public util: UtilitiesService,
    // private _snackBar: MatSnackBar,
    ) {
       this.openSnackBar()

     }

  onSelect(feature:string){
      if(feature==="map"){
        this.layerServ.checkLayer(feature)

      }
      if(feature==="about"){
        // console.log(feature)
        this.util.saveOption(feature)
      }
      if(feature==="partners"){
        this.util.saveOption(feature)
      }
      if(feature==="development"){
        this.util.saveOption(feature)
      }
      this.featureSelected.emit(feature)
      // if (feature==='map'){
      //   console.log('es map')
      //   this.router.navigate(['/'])
      // }
  }
  openSnackBar() {
    // under construction banner
    this._snackBar.open('Under construction!🚧', 'Dismiss', {
      duration: this.durationInSeconds*1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }


}
