import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet'
// @import "~leaflet/dist/leaflet.css";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: [
    './map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  private mymap;

  constructor() { }

  ngOnInit() {
  }


  ngAfterViewInit():void{
    this.initMap()
  }

  private initMap(): void {
    this.mymap = L.map('map', {
      center: [ 32.344147, -106.758442 ],
      zoom: 10
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 13,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    })
    tiles.addTo(this.mymap);

    let testControl = L.Control.extend({
      options: {
        position: "bottomleft"
      },

      onAdd: function (map) {
        return L.DomUtil.create('div', 'custom-item')
      },
      // setContent: function(content){
      //   this.getContainer().innerHTML = content
      // }
    })

    

    L.testControl = function(options){
      return new L.TestControl(options)
    }

    L.testControl({position:'bottomleft'}).addTo(this.mymap)


    
    
    
  }

  

}
