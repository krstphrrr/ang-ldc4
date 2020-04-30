import { Component, EventEmitter, Output } from '@angular/core';

import { Router } from '@angular/router'
import {LayerService} from '../services/layer.service'
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {
  @Output() featureSelected = new EventEmitter<string>()
  isCollapsed: boolean = true;


  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  constructor(
    private router:Router,
    private layerServ: LayerService
    ) { }

  onSelect(feature:string){
      if(feature==="map"){
        this.layerServ.checkLayer(feature)

      }
      this.featureSelected.emit(feature)
      // if (feature==='map'){
      //   console.log('es map')
      //   this.router.navigate(['/'])
      // }
  }


}
