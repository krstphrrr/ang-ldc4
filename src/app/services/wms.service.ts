import { Injectable } from '@angular/core';
import * as L from 'leaflet'
import {Observable, of, Subject, AsyncSubject} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class wmsService {
    private baselayerTracker = new Subject();
    private overlayTracker = new Subject();
    private dragtracker = new Subject();
    private map2child = new Subject();
  
    public googleHybrid = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3']
    });

    public googleSatellite = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3']
    }); 
    public googleStreet = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3']
    });
    public googleTerrain = L.tileLayer('https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3']
    });

    public counties = L.tileLayer.wms('https://landscapedatacommons.org/geoserver/wms?tiled=true', {
      layers: 'ldc2:tl_2017_us_county_wgs84',
      format: 'image/png',
      transparent: true,
      // tiled: true,
      version: '1.3.0',
      maxZoom: 20
    });

    // public countries = L.tileLayer.wms('https://landscapedatacommons.org/geoserver/wms', {
    //   layers: 'ldc2:countries_wgs84',
    //   format: 'image/png',
    //   transparent: true,
    //   // tiled: true,
    //   version: '1.3.0',
    //   maxZoom: 20
    // });
    public states = L.tileLayer.wms('https://landscapedatacommons.org/geoserver/wms?tiled=true', {
      layers: 'ldc2:tl_2017_us_state_wgs84',
      format: 'image/png',
      transparent: true,
      // tiled: true,
      version: '1.3.0',
      maxZoom: 20
    });



    public surf = L.tileLayer.wms('https://landscapedatacommons.org/geoserver/wms?tiled=true', {
      layers: 'ldc2:surface_mgt_agency_wgs84',
      format: 'image/png',
      transparent: true,
      // tiled: true,
      version: '1.3.0',
      maxZoom: 20
    });

    public mlra = L.tileLayer.wms('https://landscapedatacommons.org/geoserver/wms?tiled=true', {
      layers: 'ldc2:mlra_v42_wgs84',
      format: 'image/png',
      transparent: true,
      // tiled: true,
      version: '1.3.0',
      maxZoom: 20
    });

    public statsgo = L.tileLayer.wms('https://landscapedatacommons.org/geoserver/wms?tiled=true', {
      layers: 'ldc2:statsgo_wgs84',
      format: 'image/png',
      transparent: true,
      // tiled: true,
      version: '1.3.0',
      maxZoom: 20
    });

    public huc6 = L.tileLayer.wms('https://landscapedatacommons.org/geoserver/wms?tiled=true', {
      layers: 'ldc2:wbdhu6_wgs84',
      format: 'image/png',
      transparent: true,
      // tiled: true,
      version: '1.3.0',
      maxZoom: 20
    });

    public huc8 = L.tileLayer.wms('https://landscapedatacommons.org/geoserver/wms?tiled=true', {
      layers: 'ldc2:wbdhu8_wgs84',
      format: 'image/png',
      transparent: true,
      // tiled: true,
      version: '1.3.0',
      maxZoom: 20
    });

    // public geoInd = L.tileLayer.wms('https://landscapedatacommons.org/geoserver/wms', {
    //   layers: 'ldc2:geoIndicators_public',
    //   format: 'image/png',
    //   transparent: true,
    //   // tiled: true,
    //   version: '1.3.0',
    //   maxZoom: 20
    // });

    // public geoSpecies = L.tileLayer.wms('https://landscapedatacommons.org/geoserver/wms', {
    //   layers: 'ldc2:geoSpecies_public',
    //   format: 'image/png',
    //   transparent: true,
    //   // tiled: true,
    //   version: '1.3.0',
    //   maxZoom: 20
    // });



  constructor() { }
  public lays = {'hy':this.googleHybrid,'sat':this.googleSatellite, 'st':this.googleStreet, 'terr':this.googleTerrain}
  getLayers(whichkey=null):Observable<any>{
    return of(this.lays[whichkey])
  }

  // change detection on the baselayer dropdown

  sendBaselayer(content:string){
    this.baselayerTracker.next({data:content})
  }

  getBaselayer():Observable<any>{
    return this.baselayerTracker.asObservable()
  }

  // change detection on the overlay dropdown
  sendOverlaylayer(content:string){
    this.overlayTracker.next({overlay:content})
  }

  getOverlaylayer():Observable<any>{
    return this.overlayTracker.asObservable()
  }

  //change detection on the close button (from the draggable component >>> map )

  sendCloseSignal(){
    this.dragtracker.next({close:true})
  }

  getCloseSignal(){
    return this.dragtracker.asObservable()
  }

  sendOverlay2Child(content){
    this.map2child.next({data:content})
  }

  getOverlayChild(){
    return this.map2child.asObservable()
  }

}

