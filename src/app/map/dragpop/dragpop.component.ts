import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs'
import { wmsService } from '../../services/wms.service'
interface Overlays{
  name:string;
  open:boolean;
}

@Component({
  selector: 'app-dragpop',
  templateUrl: './dragpop.component.html',
  styleUrls: ['./dragpop.component.css']
})
export class DragpopComponent implements OnInit {
  panelOpenState:boolean
  @Input()message:string
  overlayChoice:Subscription
  overlayArray:Overlays[]
  tempSet:Overlays[]

  constructor(
    private wms: wmsService

  ) {
     
   }

  ngOnInit(){
    this.overlayChoice = this.wms.getOverlaylayer().subscribe(dropdownOption=>{
      console.log('gmmm')
      this.message = dropdownOption.overlay.value
    })

  }

  addNewRow(string){
    switch(string){
      case 'US States':
        console.log(string)
        break;
      case 'US Counties':
       console.log(string)
        break;
    }
    this.tempSet.push({name:string, open:false})
    let newSet = Array.from(new Set(this.tempSet.map(s=>s.name)))
      .map(name =>{
        return{
          name:name,
          open: this.tempSet.find(s=>s.name===name).open
        }
      })
      this.overlayArray = newSet
  }
  closePopup(){
    this.wms.sendCloseSignal()
  }

}
