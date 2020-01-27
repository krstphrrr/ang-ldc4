import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayerService {

  constructor() { }

  //***Add in backgrounds
  // const googleHybrid = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
  //   maxZoom: 20,
  //   subdomains:['mt0','mt1','mt2','mt3']
  // });
  // const googleSatellite = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
  //   maxZoom: 20,
  //   subdomains:['mt0','mt1','mt2','mt3']
  // }); 
  // const googleStreet = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
  //   maxZoom: 20,
  //   subdomains:['mt0','mt1','mt2','mt3']
  // });
  // const googleTerrain = L.tileLayer('https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
  //   maxZoom: 20,
  //   subdomains:['mt0','mt1','mt2','mt3']
  // });
}

