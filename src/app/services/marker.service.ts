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
          fillColor:"blue",
          color:"dark grey", 
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
              String("Public: ")+ String(feature.properties.Public)+"<br>"
            switch(feature.properties.Public){
              case true:
                m.fillOpacity = 1;
                break;
              case false:
                m.fillOpacity = .2;
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


  // onFetchPoints(realmap:L.Map, tmpData){
  //   this.fetchPoints(realmap, tmpData)
    

  // }

  // private fetchPoints(realmap:L.Map, tmpData){

    
    // this.socket.emit('fetchpoints', this.tmpData)
    // const myobservable = this.socket.listen('pointssend', returnPoints)

    // this.http
    //   .get<DataHeader[]>('http://localhost:5000/api/plots2')
    // .pipe(map(
    //    (responseData)=>{

    //     const pointArray=[]
    //     let container;
    //     //// START pipe  loop
    //     for(let i in responseData){
    //       let singleArray = responseData[i]
    //       for ( let j in singleArray){
    //         if(Array.isArray(singleArray[j])){
    //           let temp = singleArray[j]
    //           let untemp = {...temp}
    //           container = untemp
    //           let coords = container[0].wkbGeometry.coordinates
    //           pointArray.push({lat: coords[1], long: coords[0]})
    //         }
    //       }
        
    //     }
    //     return [pointArray]
    //     /// END pipe loop      
    // }
    // ))
//     myobservable
//     .subscribe(points =>{
//       // this.socket.emit('fetchpoints', 'data')
//       console.log(points)
// // typically, once the service receivwes


//     //   let unpack = points[0]
//     //   for(let point in unpack){
//     //     this.markers.push(unpack[point])
//     //   }
//     //   //// creating marker
//     //   const n: number = this.markers.length;
//     //   let i: number;
//     //   let m: L.circleMarker;

//     //   let x: number;
//     //   let y: number;
//     //   this.lyrGrp = L.featureGroup()
//     // for (i = 0; i < n; ++i) {

//     //   x = this.markers[i].lat;
//     //   y = this.markers[i].long;
      
//     //   m = L.circleMarker([x,y],{
//     //     radius:5,
//     //     fillColor:"magenta",
//     //     color:"yellow",
//     //     weight:2,
//     //     opacity:1,
//     //     fillOpacity:.8
//     //   }).addTo(this.lyrGrp) 
//     // }
//     // realmap.fitBounds(this.lyrGrp.getBounds().pad(Math.sqrt(2)/8))

//     // this.lyrGrp.addTo(realmap)
//       })

  // }

  // testFunction(){
  //   this.http.get('http://localhost:5000/api/plots3').subscribe(data=>{
  //     console.log(data)
  //   })
  // }
  // makePoints(){
  //   this.http.get('http://localhost:5000/api/plots2').subscribe((res:any)=>{
  //     for(const c of res){
  //       const cont = [...c]
  //       console.log(cont)
  //     }
  //   })
  // }


}
