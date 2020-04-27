import { Injectable } from '@angular/core';
import * as d3 from 'd3'
import * as L from 'leaflet'
@Injectable({
  providedIn: 'root'
})
export class MapLoadService {
  public prop1;

  constructor() { }

  testMethod(map:L.Map){
    this.prop1 = 'test successful'
    console.log(this.prop1)
  }
}
