import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import * as L from 'leaflet'
import { MapIconOptions } from './data/map-icon'
import { MarkerService } from './marker.service'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { reduce } from 'rxjs/operators';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: [
    './map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, AfterViewChecked {
  private mymap;
  public isCollapsed = false;
  public mrkr=false;
  public lyrGrp;
  
  


  constructor(
    private markers:MarkerService
    ) { }

  ngOnInit() {
    
  }


  ngAfterViewInit():void{
    this.initMap()
    this.showMarkers()
  }

  ngAfterViewChecked():void {
    
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

  showMarkers() {
    
      const n: number = this.markers.markers.length;
      let i: number;
      let m: L.circleMarker;

      let x: number;
      let y: number;
      this.lyrGrp = L.featureGroup()
    for (i = 0; i < n; ++i) {

      x = this.markers.markers[i].lat;
      y = this.markers.markers[i].long;
      
      m = L.circleMarker([x,y],{
        radius:5,
        fillColor:"magenta",
        color:"yellow",
        weight:2,
        opacity:1,
        fillOpacity:.8
      }).addTo(this.lyrGrp) 
    }
  }

  addMarks(){
    const geobounds = this.lyrGrp.addTo(this.mymap)
    this.mrkr = true
    if(this.lyrGrp){
       this.mymap.fitBounds(this.lyrGrp.getBounds())
      //  this.mymap.setZoom(25)
    }

  }

  removeMarks(){
    this.mymap.removeLayer(this.lyrGrp)
    this.mrkr = false
  }
}
