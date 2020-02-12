import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import * as L from 'leaflet'
// import { MapIconOptions } from './data/map-icon'
import { MarkerService } from './marker.service'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { reduce } from 'rxjs/operators';
import * as d3 from 'd3'
import { socketDataService } from '../learn/socketTest.service'
import { wmsService } from '../map/controls/wms.service'
// import * as PIXI from 'pixi.js'
// import 'leaflet-pixi-overlay'
// import {pixiOverlay} from 'leaflet'
import {IGeoJson} from './models/geojsonint.model'

import 'leaflet-draw'
import { GeoJsonObject } from 'geojson';



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
  public lyrGrp
  public tmpPoints;
  public theSubscription;
  public myCanvas:L.Canvas;
  public Public = true;
  
  
  


  constructor(
    private markers: MarkerService,
    private socket: socketDataService,
    private wms: wmsService
    ) {
      
     }

  ngOnInit() {
    /*
      marker service could load 
      an onInit function with basic
      public markers:
      this.marker.fetchInitPoints() etc.
    */
  }


  ngAfterViewInit():void{
    console.log('ngAfterViewInit')
    /*
     mapinitiation should happen after 
     View components are initialized. 
    */
    this.initMap()
    /* 
      markers could also be loaded here AND THEN added to map
      this.markers.fetchInitPoints() 
    */ 
    
  }

  ngAfterViewChecked(){
    
  }


  private initMap(){
    // trying out d3 stuff
    // let topoSVG = d3
    //   .select(this.mymap.getPanes().overlayPane)
    //   .append("svg")
    //   .attr("id", "topoSVG")
    
    this.mymap = L.map('map', {
      maxZoom: 15,
      inertiaDeceleration: 1000,
      attributionControl: false,
      worldCopyJump: true,
      center: [ 32.344147, -106.758442 ],
      zoom: 10,
      minZoom:7,
      zoomControl:false,
      preferCanvas:true,
      /* initial layer */
      layers:[this.wms.googleSatellite]
    });
    /* invalidate size debouncemoveend 
       adds a timeout on every moveend-event refetch */
    this.mymap.invalidateSize({
      debounceMoveend:true
    })

    /* ..drawing logic >> probably could be contained inside service
       open an empty featuregroup to insert drawing into*/
    let drawnItems = new L.FeatureGroup()
    /* drawing control + options */
    let drawControl = new L.Control.Draw({
      draw:{
        polyline: false,
        polygon:{
          allowIntersection:false,
          // showArea:true,
          repeatMode:true
        },
        circle:false,
        marker:false,
        rectangle:false,
        circlemarker:false
      },
      edit:{
        // use empty featuregroup layer
        featureGroup:drawnItems
      }
    })
    this.mymap.addControl(drawControl)
    /* add featuregroup layer into map layers!
       this featuregroup still needs a layer */
    this.mymap.addLayer(drawnItems)
    /* on map drawing created:
       clear surrounding points, unsubscribe from 
       other observers, refetch  */
    this.mymap.on('draw:created', (e)=> {
      //adding a drawing to featuregroup layer
      drawnItems.addLayer(e.layer);
      // bounds within drawn polygon
      let bbox =e.layer.getBounds()
      console.log(bbox)
      let topos = {
        bounds:{
          _southWest:{
            lng:bbox._southWest.lng,
            lat:bbox._southWest.lat
          },
          _northEast:{
            lng:bbox._northEast.lng,
            lat:bbox._northEast.lat
          }
        }
      }
      console.log('sending bounds...', topos)
      this.socket.emit('poly', topos)
      this.socket.listen('something').subscribe(data=>{
        console.log(data)
      })
      
     
      // this.theSubscription = this.socket.listen('polygon_receive').subscribe((data:GeoJsonObject)=>{
      //   console.log("received geojson..", data)
      //   // clearing layergroup to avoid mem leak
      //   if(this.lyrGrp===undefined){
      //     //
      //   } else{
      //     this.lyrGrp.clearLayers()
      //     this.lyrGrp.addTo(this.mymap)
      //   }
      //   this.myCanvas = L.canvas({padding:0.1})
      //   console.log(data, this.Public,"on drag end")
        
        
      //   let m = {
      //     radius:5, 
      //     fillColor:"white",
      //     color:"yellow", 
      //     weight:2, 
      //     opacity:1, 
      //     fillOpacity:.8
      //   }           
      //   this.lyrGrp = L.featureGroup()
      //     L.geoJSON((data),{
            
      //       pointToLayer: (feature,latlng)=>{
              
      //         let label = 
      //           String("ID: ") + String(feature.id) +"<br>"+
      //           String("Public: ")+ String(feature.properties.Public)+"<br>"
      //           switch(feature.properties.Public){
      //             case true:
      //               m.fillColor = "#80bfff";
      //               break;
      //             case false:
      //               m.fillColor = "magenta";
      //               break;
      //           }
      //         return L.circleMarker(latlng,m).bindTooltip(label,{opacity:0.7})
      //       }
      //     }).addTo(this.lyrGrp)
      //     this.lyrGrp.addTo(this.mymap)
      // })
      
  });

    let baseMaps = {
      'Hybrid':this.wms.googleHybrid,
      'Streets': this.wms.googleStreet,
      'Satellite': this.wms.googleSatellite,
      'Terrain': this.wms.googleTerrain
    }
    let overlays = {
      'surf': this.wms.surf,
      'mlra': this.wms.mlra,
      'counties':this.wms.counties,
      'states': this.wms.states,
      'drawn Items':drawnItems
    }

    L.control.layers(baseMaps, overlays, {collapsed:true}).addTo(this.mymap)



    this.mymap.on('load', (event)=>{
      let bbox =this.mymap.getBounds()
      let topos = {
        bounds:{
          _southWest:{
            lng:bbox._southWest.lng,
            lat:bbox._southWest.lat
          },
          _northEast:{
            lng:bbox._northEast.lng,
            lat:bbox._northEast.lat
          }
        }
      }
      this.socket.emit('fetchpoints', topos)
      this.socket.listen('pointssend').subscribe(data=>{
        console.log(data, "FROM onLOAD")
      })
    })


    // 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    const tiles = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3']
    })
    tiles.addTo(this.mymap);



    this.mymap.on("dragend", (event)=>{
      if(this.myCanvas!==undefined){
        //
      }
      if(this.theSubscription && !this.theSubscription.closed){
        this.theSubscription.unsubscribe()
      }
      
      let bbox =this.mymap.getBounds()
      let points:[number,number][] = [[bbox._northEast.lng, bbox._northEast.lat], [bbox._southWest.lng, bbox._northEast.lat], [bbox._southWest.lng, bbox._southWest.lat], [bbox._northEast.lng, bbox._southWest.lat]]
      
      
      let topos = {
        bounds:{
          _southWest:{
            lng:bbox._southWest.lng,
            lat:bbox._southWest.lat
          },
          _northEast:{
            lng:bbox._northEast.lng,
            lat:bbox._northEast.lat
          }
        }
      }
      
      // let tmpPoly = d3.polygonHull(points)
      // let tmpTopo = this.mymap.getPanes()
      // this.tmpPoints = tmpPoly
   
      this.socket.emit('fetchpoints', topos)
      
     
      this.theSubscription = this.socket.listen('pointssend').subscribe((data:GeoJsonObject)=>{

        // clearing layergroup to avoid mem leak
        if(this.lyrGrp===undefined){
          //
        } else{
          this.lyrGrp.clearLayers()
          this.lyrGrp.addTo(this.mymap)
        }
        this.myCanvas = L.canvas({padding:0.1})
        console.log(data, this.Public,"on drag end")
        
        
        let m = {
          radius:5, 
          fillColor:"white",
          color:"yellow", 
          weight:2, 
          opacity:1, 
          fillOpacity:.8
        }           
        this.lyrGrp = L.featureGroup()
          L.geoJSON((data),{
            
            pointToLayer: (feature,latlng)=>{
              
              let label = 
                String("ID: ") + String(feature.id) +"<br>"+
                String("Public: ")+ String(feature.properties.Public)+"<br>"
                switch(feature.properties.Public){
                  case true:
                    m.fillColor = "#80bfff";
                    break;
                  case false:
                    m.fillColor = "magenta";
                    break;
                }
              return L.circleMarker(latlng,m).bindTooltip(label,{opacity:0.7})
            }
          }).addTo(this.lyrGrp)
          this.lyrGrp.addTo(this.mymap)
      })
    })

    this.mymap.on("zoomend", (event)=>{
      if(this.myCanvas!==undefined){
        //
      }
      if(this.theSubscription && !this.theSubscription.closed){
        this.theSubscription.unsubscribe()
      }
      
      let bbox =this.mymap.getBounds()
      let points:[number,number][] = [[bbox._northEast.lng, bbox._northEast.lat], [bbox._southWest.lng, bbox._northEast.lat], [bbox._southWest.lng, bbox._southWest.lat], [bbox._northEast.lng, bbox._southWest.lat]]
      
      
      let topos = {
        bounds:{
          _southWest:{
            lng:bbox._southWest.lng,
            lat:bbox._southWest.lat
          },
          _northEast:{
            lng:bbox._northEast.lng,
            lat:bbox._northEast.lat
          }
        }
      }
      
      let tmpPoly = d3.polygonHull(points)
      let tmpTopo = this.mymap.getPanes()
      this.tmpPoints = tmpPoly
   
      this.socket.emit('fetchpoints', topos)
      
     
      this.theSubscription = this.socket.listen('pointssend').subscribe((data:GeoJsonObject)=>{

        // clearing layergroup to avoid mem leak
        if(this.lyrGrp===undefined){
          //
        } else{
          this.lyrGrp.clearLayers()
          this.lyrGrp.addTo(this.mymap)
        }
        this.myCanvas = L.canvas({padding:0.1})
        console.log(data, this.Public,"on zoom end")
        
        
        let m = {
          radius:5, 
          fillColor:"white",
          color:"yellow", 
          weight:2, 
          opacity:1, 
          fillOpacity:.8
        }           
        this.lyrGrp = L.featureGroup()
          L.geoJSON(data,{
            
            pointToLayer: (feature,latlng)=>{
              
              let label = 
                String("ID: ") + String(feature.id) +"<br>"+
                String("Public: ")+ String(feature.properties.Public)+"<br>"
                switch(feature.properties.Public){
                  case true:
                    m.fillColor = "#80bfff";
                    break;
                  case false:
                    m.fillColor = "magenta";
                    break;
                }
              return L.circleMarker(latlng,m).bindTooltip(label,{opacity:0.7})
            }
          }).addTo(this.lyrGrp)
          this.lyrGrp.addTo(this.mymap)
      })
    })
  }

  ngOnDestroy(){
    this.theSubscription.unsubscribe()
  }

  showMarkers() {
    // clearing layergroup to avoid mem leak
    if(this.lyrGrp===undefined){
      //
    } else{
      this.lyrGrp.clearLayers()
      this.lyrGrp.addTo(this.mymap)
    }
    let bbox =this.mymap.getBounds()
    let points:[number,number][] = [[bbox._northEast.lng, bbox._northEast.lat], [bbox._southWest.lng, bbox._northEast.lat], [bbox._southWest.lng, bbox._southWest.lat], [bbox._northEast.lng, bbox._southWest.lat]]
     // use the size of county in a spatial query to create the buffer distance 
      //where to offset the point within.
      // jitter only with authorized token, actual 

      // divide the workload with jacob

      // connection string postgres for sarah for dima stuff
      // brandon needs a table from horizontal flux data
      // horizontal flux needs coords but ericha etc. need to get it in
      //
     
















      //
    let topos = {
      bounds:{
        _southWest:{
          lng:bbox._southWest.lng,
          lat:bbox._southWest.lat
        },
        _northEast:{
          lng:bbox._northEast.lng,
          lat:bbox._northEast.lat
        }
      }
    }
    
    let tmpPoly = d3.polygonHull(points)
    let tmpTopo = this.mymap.getPanes()
    this.tmpPoints = tmpPoly
    // topos['public'] = true
    
    if(this.Public===false){
      topos['public'] = true
      // send where true 
      // change to true
      this.socket.emit('onpublic', topos)
      this.Public=true

    } else {
      topos['public'] = false
      // remove where true
      // change to false
      this.socket.emit('onpublic', topos)
      this.Public=false
    }


    // this.socket.emit('onpublic', topos)
    
   
    // this.theSubscription = this.socket.listen('pointssend').subscribe(data=>{
    //   if(this.lyrGrp===undefined){
    //     console.log('SOMEHTING')
    //   } else{
    //     this.lyrGrp.clearLayers()
    //     this.lyrGrp.addTo(this.mymap)
    //   }
    //   this.myCanvas = L.canvas({padding:0.1})
    //   console.log(data)
      
      
    //   let m = {
    //     radius:5, 
    //     fillColor:"white",
    //     color:"yellow", 
    //     weight:2, 
    //     opacity:1, 
    //     fillOpacity:.8
    //   }           
    //   this.lyrGrp = L.featureGroup()
    //     L.geoJSON(data,{
          
    //       pointToLayer: (feature,latlng)=>{
            
    //         let label = 
    //           String("ID: ") + String(feature.id) +"<br>"+
    //           String("Public: ")+ String(feature.properties.Public)+"<br>"
    //           switch(feature.properties.Public){
    //             case true:
    //               m.fillColor = "#80bfff";
    //               break;
    //             case false:
    //               m.fillColor = "magenta";
    //               break;
    //           }
    //         return L.circleMarker(latlng,m).bindTooltip(label,{opacity:0.7})
    //       },
    //       renderer: this.myCanvas
    //     }).addTo(this.lyrGrp)
    //     this.lyrGrp.addTo(this.mymap)
    // })
  }
  

  addMarks(){
    
    // const geobounds = this.lyrGrp.addTo(this.mymap)
    // this.mrkr = true
    
    // if(this.lyrGrp){
    //    this.mymap.fitBounds(this.lyrGrp.getBounds())
    //   //  this.mymap.setZoom(25)
    // }

  }

  removeMarks(){
    // this.mymap.removeLayer(this.lyrGrp)
    // this.mrkr = false
  }
}
