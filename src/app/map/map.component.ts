import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet'
// import { PanelComponent } from './map/controls/panel/panel/panel.component'

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: [
    './map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  private mymap;
  public isCollapsed = false;
  


  constructor() { }

  ngOnInit() {
  }


  ngAfterViewInit():void{
    this.initMap()
  }

  private initMap(): void {
    this.mymap = L.map('map', {
      minZoom: 3,
      maxZoom: 19,
      inertiaDeceleration: 1000,
      attributionControl: false,
      worldCopyJump: true,
      // maxBounds: [[115,-240],[-115,240]],
      center: [ 32.344147, -106.758442 ],
      zoom: 10,
      zoomControl:false
    });

    // 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    const tiles = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3']
    })
    tiles.addTo(this.mymap);

    var googleTerrain = L.tileLayer('https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3']
    });

    

    
    
    
  }

  

}
