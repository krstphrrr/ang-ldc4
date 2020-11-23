import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { map, single } from 'rxjs/operators';
import { DataHeader } from '../map/models/dataHeader.model'
import { GeoIndicators } from '../map/models/geoIndicators.models'
import * as L from 'leaflet'
import { socketDataService } from './socketTest.service'

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  //marker array to inject anywhere
  markers;

  public lyrGrp:L.FeatureGroup;
  public tmpData;

  loadedPoints = [];

  constructor(
    private http: HttpClient
  ){ }

  createMarkers(geojsonObj){
    let m = {
          radius:5, 
          fillColor:"cyan",
          color:"black", 
          weight:.5, 
          opacity:1, 
          fillOpacity:.8
            }           
    this.lyrGrp = L.featureGroup()
    // using supplied geojson, create featuregroup full of markers
    L.geoJSON((geojsonObj),{
          pointToLayer: (feature,latlng)=>{
            // console.log(feature)
            let label = 
              String("ID: ") + String(feature.id) +"<br>"+
              String("Public: ")+ String(feature.properties.isPublic)+"<br>"+
              String("Project: ")+ String(feature.properties.source)+"<br>"
            switch(feature.properties.Public){
              case true:
                m.fillOpacity = 1;
                break;
              case false:
                m.fillOpacity = .4;
                break;
            }
            return L.circleMarker(latlng,m).bindTooltip(label,{opacity:0.5})
          }
        }).addTo(this.lyrGrp)
      this.markers = this.lyrGrp
  }

  noMarkers(){
    if(this.markers!=undefined){
      this.markers = undefined
    } else {
      console.log('markers is still undefined')
    }
  }
}
