import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  public markers: {lat: number, long: number}[];  
   // Map markers (relevance depends on map center)
  // length: number = this.markers.length

  constructor()
  {
    // some map markers
    this.markers = [
      { lat: 32.117475, long: -106.982117   },
      { lat: 32.424022, long: -107.440796 },
      { lat: 33.568861 , long: -107.677002 },
      { lat: 32.405473, long: -106.369629 },
      { lat: 32.008076, long: -106.869507 },
      { lat: 32.308027, long: -106.688232 }
    ];
  }
}
