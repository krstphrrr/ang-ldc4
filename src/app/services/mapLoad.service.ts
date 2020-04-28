import { Injectable, ElementRef } from '@angular/core';
import * as d3 from 'd3'
import * as L from 'leaflet'
import * as turf from '@turf/turf'
import { MoveEndService } from '../services/move-end.service'
import { socketDataService } from '../services/socketTest.service'
import { MarkerService } from '../services/marker.service'
import { GeoJsonObject } from 'geojson'
import { SpinnerService } from '../services/spinner.service'

// import {Spinner} from 'spin.js'
@Injectable({
  providedIn: 'root'
})
export class MapLoadService {
  public prop1;
  public lyrGrp;
  public loadingControl;

  // public spinner:Spinner;
  
  public movementSubscription;
  public markerLayer:L.Layer


  constructor(
    private moveEnd:MoveEndService,
    private socket: socketDataService, 
    private markers: MarkerService,
    private spinner: SpinnerService

    // private spinner:Spinner
  ) {
   
   }

  testMethod(map:L.Map){

    let userbounds = map.getBounds()
    let northeast_corner = L.latLng(49.26780455063753,-67.32421875)
    let southwest_corner = L.latLng(24.367113562651262,-127.61718749999999)
    let bbox = L.latLngBounds(northeast_corner,southwest_corner)
    // console.log(bbox)
    this.moveEnd.boundsUtil(bbox)
    if(this.moveEnd.topos){
      this.socket.emit('fetchpoints',this.moveEnd.topos)
      this.movementSubscription = this.socket.listen('pointssend')
        .subscribe((data:GeoJsonObject)=>{
          this.markers.createMarkers(data)
          this.markerLayer = this.markers.markers
          this.markerLayer.addTo(map)

        })
    }
    // while (this.is_drawing===false){
    //   // this.socket.emitcoo
    // }
  }
  


}
