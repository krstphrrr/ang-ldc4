import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router'
import {LayerService} from '../services/layer.service'
import { AboutSelService } from '../services/about-sel.service'
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {
  @Output() featureSelected = new EventEmitter<string>()
  isCollapsed: boolean = true;
  whichPage;


  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  constructor(
    private router:Router,
    private layerServ: LayerService,
    public auth: AuthService,
    public about: AboutSelService
    ) {

     }

  onSelect(feature:string){
      if(feature==="map"){
        this.layerServ.checkLayer(feature)

      }
      if(feature==="about"){
        this.about.saveOption(feature)
      }
      if(feature==="partners"){
        this.about.saveOption(feature)
      }
      this.featureSelected.emit(feature)
      // if (feature==='map'){
      //   console.log('es map')
      //   this.router.navigate(['/'])
      // }
  }


}
