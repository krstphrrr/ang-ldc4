import { Injectable } from '@angular/core';
import * as L from 'leaflet'
import { wmsService } from '../../services/wms.service'

@Injectable({
  providedIn: 'root'
})
export class CustomControlService {

  constructor(
    private wms: wmsService,
  ) { }
  

  public newControl () {
    let baseMaps = {
      'Hybrid':this.wms.googleHybrid,
      'Streets': this.wms.googleStreet,
      'Satellite': this.wms.googleSatellite,
      'Terrain': this.wms.googleTerrain
    }
    let overlays = {
      'surf': this.wms.surf,
      'mlra': this.wms.mlra,
      'counties':this.wms.counties,
      'states': this.wms.states
    }
    
    return L.control.layers(baseMaps, overlays)
  }
}
