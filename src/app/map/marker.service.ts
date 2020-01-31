import { Injectable } from '@angular/core';
import { HttpClient, 
         HttpResponse 
        //  HttpErrorResponse
         } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, single } from 'rxjs/operators';
import { DataHeader } from './models/dataHeader.model'
import { GeoIndicators } from './models/geoIndicators.models'
import * as L from 'leaflet'

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  //marker array to inject anywhere
  public markers: {lat: number, long: number}[] =[];
  public lyrGrp:L.featureGroup;

  loadedPoints = [];


  constructor(
    private http: HttpClient
  )


  {
    console.log('this is the service' )
    // console.log(this.markers)
    // some map markers
    // ultimately will be pulled from http/api
    this.markers = [
      // { lat: 32.117475, long: -106.982117 },
      // { lat: 32.424022, long: -107.440796 },
      // { lat: 33.568861 , long: -107.677002 },
      // { lat: 32.405473, long: -106.369629 },
      // { lat: 32.008076, long: -106.869507 },
      // { lat: 32.308027, long: -106.688232 }
    ];
    // this.makePoints()
  
  }
  onFetchPoints(realmap:L.map){
    this.fetchPoints(realmap)

  }

  private fetchPoints(realmap:L.map){
    this.http
      .get<DataHeader[]>('http://localhost:5000/api/plots2')

//////// multiple records
    .pipe(map(
       (responseData)=>{
        const pointArray=[]
        let container;
        for(let i in responseData){
          let singleArray = responseData[i]
          for ( let j in singleArray){
            if(Array.isArray(singleArray[j])){
              let temp = singleArray[j]
              let untemp = {...temp}
              // let obj = Object.assign(key,responseData[key])
              container = untemp
              let coords = container[0].wkbGeometry.coordinates

              pointArray.push({lat: coords[1], long: coords[0]})
              // temp.push(singleArray[j])
            }
          }
        
        }
        return [pointArray]
// ///////////////////single record

//     //   const pointArray = []
//     //   let container;
//     //   for ( const key in responseData ){
//     //     pointArray.push(key)
//     //     // if (responseData.hasOwnProperty(key) && Array.isArray(responseData[key])){
//     //     //   let temp = responseData[key]
//     //     //   let untemp = {...temp}
//     //     //   // let obj = Object.assign(key,responseData[key])
//     //     //   container = untemp
//     //     //   let coords = container[0].wkbGeometry.coordinates

//     //     //   pointArray.push({lat: coords[1], long: coords[0]})
//     //     //     {lat:container.})
//     //     //   for(let i in obj){
            
//     //     //     pointArray.push(obj)
//     //     //   }
//     //       // pointArray.push({...responseData[key], })
//     //       // pointArray.push(responseData[key])
//     //     // }
//     //     // pointArray.
//     //   }
      // return pointArray
      
    }
    ))
    .subscribe(points =>{
      let unpack = points[0]
      for(let point in unpack){
        this.markers.push(unpack[point])
      }
      //// creating marker
      const n: number = this.markers.length;
      let i: number;
      let m: L.circleMarker;

      let x: number;
      let y: number;
      this.lyrGrp = L.featureGroup()
    for (i = 0; i < n; ++i) {

      x = this.markers[i].lat;
      y = this.markers[i].long;
      
      m = L.circleMarker([x,y],{
        radius:5,
        fillColor:"magenta",
        color:"yellow",
        weight:2,
        opacity:1,
        fillOpacity:.8
      }).addTo(this.lyrGrp) 
    }
    realmap.fitBounds(this.lyrGrp.getBounds().pad(Math.sqrt(2)/8))

    this.lyrGrp.addTo(realmap)
    // this.mymap.fitBounds(this.lyrGrp.getBounds())
        // this.markers2 = points
        // console.log(this.markers)
        // console.log(unpack)
        // console.log(points)
      })

  }
  // makePoints(){
  //   this.http.get('http://localhost:5000/api/plots2').subscribe((res:any)=>{
  //     for(const c of res){
  //       const cont = [...c]
  //       console.log(cont)
  //     }
  //   })
  // }


}
