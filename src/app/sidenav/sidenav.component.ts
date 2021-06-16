import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { LayerService } from '../services/layer.service';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  @Output() featureSelected = new EventEmitter<string>()
  @Output() closeSidenav = new EventEmitter<void>()

  constructor(
    private layerServ: LayerService,
    public auth: AuthService,
    public util: UtilitiesService,
  ) { }

  ngOnInit(): void {
  }

  onClose(){
    this.closeSidenav.emit()
  }

  onSelect(feature:string){
    if(feature==="map"){
      this.layerServ.checkLayer(feature)

    }
    
    this.featureSelected.emit(feature)
    this.onClose()
    // if (feature==='map'){
    //   console.log('es map')
    //   this.router.navigate(['/'])
    // }
}
}
