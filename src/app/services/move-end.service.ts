import { Injectable } from '@angular/core';
import { Map } from 'leaflet'
import { BehaviorSubject, Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MoveEndService {
  private privateCoords = new BehaviorSubject([])
  publicCoords$:Observable<any> = this.privateCoords.asObservable()

  topos;
  coords;

  constructor() {

   }
  boundsUtil(boundsObj){
    const points:[number,number][] = [
      [boundsObj._northEast.lng, boundsObj._northEast.lat], 
      [boundsObj._southWest.lng, boundsObj._northEast.lat], 
      [boundsObj._southWest.lng, boundsObj._southWest.lat], 
      [boundsObj._northEast.lng, boundsObj._southWest.lat]
    ]
      
    const topos = {
        bounds:{
          _southWest:{
            lng:boundsObj._southWest.lng,
            lat:boundsObj._southWest.lat
          },
          _northEast:{
            lng:boundsObj._northEast.lng,
            lat:boundsObj._northEast.lat
          }
        }
      }
      this.topos = topos
  }
  coordsArray(boundsObj){
    this.coords = boundsObj
    this.privateCoords.next(boundsObj)
  }
  clearCoords(){
    this.coords = ''
  }
}
