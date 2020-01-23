import { Component, OnInit, AfterViewInit } from '@angular/core';
import  { defaults as defaultControls, Control } from 'ol/control'

import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'


@Component({
  selector: 'app-map-ol',
  templateUrl: './map-ol.component.html',
  styleUrls: ['./map-ol.component.css']
})
export class MapOlComponent implements OnInit, AfterViewInit {

  map:Map;
  ngAfterViewInit(){
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        })
      ],
      view: new View({
        projection: 'EPSG:4326',
        center: [-106.758442, 32.344147],
        zoom: 11
      })
    })
  }

  constructor() { }

  ngOnInit() {
  }

}
