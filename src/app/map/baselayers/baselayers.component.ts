import { Component, OnInit } from '@angular/core';
import { wmsService } from '../../services/wms.service'

/*
1. set options in an object list
2. send to a service that is aware of changes
3, retrieve from the service to be added to map!
*/

@Component({
  selector: 'app-baselayers',
  templateUrl: './baselayers.component.html',
  styleUrls: ['./baselayers.component.css']
})
export class BaselayersComponent implements OnInit {

  layers = [
    'Google Hybrid',
    'Google Terrain',
    'Google Street',
    'Google Satellite'
  ]

  constructor(
    private wms: wmsService
  ) {

   }

  ngOnInit() {
  }

  sendContent(layer:string){
    /* gets dropdown choice and sends it to wms service
     */
    this.wms.sendBaselayer(layer)
  }

}
