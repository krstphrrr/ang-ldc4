import { Component, OnInit } from '@angular/core';
import { wmsService } from '../../services/wms.service'

@Component({
  selector: 'app-overlays',
  templateUrl: './overlays.component.html',
  styleUrls: ['./overlays.component.css']
})
export class OverlaysComponent implements OnInit {
  selectedValue = ''
  layers = [
    'US States',
    'US Counties',
    'Management Agency',
    'LRR/MLRA',
    'STATSGO',
    'HUC-6',
    'HUC-8'
  ]


  constructor(
    private wms: wmsService
  ) { }

  ngOnInit(): void {
  }

  sendOverlay(layer:string){
    /* gets dropdown choice and sends it to wms service
     */
    
    this.wms.sendOverlaylayer(layer)
  }

}
