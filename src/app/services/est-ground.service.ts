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
export class EstGroundService {

  ecoid_data:String
  sendMessage(ecoid: String){
    this.ecoid_data = ecoid
  }


  constructor(private http: HttpClient) { }
  ecoid:string;
  url:string 
  getdata(message: string)
  {
    this.ecoid = message
    this.url = "https://api.landscapedatacommons.org/api/geoindicators?EcologicalSiteId=".concat(this.ecoid)
    return this.http.get<any[]>(this.url);
  }






}

