import { Injectable } from '@angular/core';
import * as d3 from 'd3'
import * as L from 'leaflet'
import * as turf from '@turf/turf'
@Injectable({
  providedIn: 'root'
})
export class MapLoadService {
  public prop1;
  public lyrGrp;
  public markers:L.Layer

  constructor() { }

  // testMethod(map:L.Map){
  //   // this.prop1 = 'test successful'
  //   let bbox = map.getBounds()
  //   // this.createPoly(bbox)
  //   let basePoly = this.createPoly(bbox,map).toGeoJSON()
  //   let posi = turf.bbox(basePoly)

  //   let newpoints = turf.randomPoint(3, {bbox:posi})
  //   this.createMarkers(newpoints)
  //   map.addLayer(this.markers)

  //   // let tmpPoly = d3.polygonHull(points)
  // }

  // createPoly(latLngBounds:L.LatLngBounds, map:L.Map){
  //   let center = latLngBounds.getCenter()
  //   let latlng = []

  //   latlng.push(latLngBounds.getSouthWest())
  //   // return latlng
  //   latlng.push({lat:latLngBounds.getSouth(), lng:center.lng})
  //   latlng.push(latLngBounds.getSouthEast())
  //   latlng.push({lat:center.lat, lng: latLngBounds.getEast()})
  //   latlng.push(latLngBounds.getNorthEast())
  //   latlng.push({lat: latLngBounds.getNorth(), lng: map.getCenter().lng })
  //   latlng.push(latLngBounds.getNorthWest())
  //   latlng.push({lat: map.getCenter().lat, lng: latLngBounds.getWest()})
  //   return new L.Polygon(latlng)
  // }


}
