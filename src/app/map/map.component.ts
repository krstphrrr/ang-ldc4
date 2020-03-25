/// <reference types='leaflet-sidebar-v2' />
import { Component, OnInit, AfterViewInit, AfterViewChecked, ViewChild } from '@angular/core';
// import * as L from 'leaflet'
import {Map, latLng, Canvas, SidebarOptions, MapOptions, LeafletEvent, TileLayer} from 'leaflet'

import { MarkerService } from './marker.service'

import { Subject } from 'rxjs';
import { debounceTime, scan } from 'rxjs/operators';
import * as d3 from 'd3'
import { socketDataService } from '../learn/socketTest.service'
import { wmsService } from '../map/controls/wms.service'
import { CustomControlService } from '../map/controls/custom-control.service'

import {IGeoJson} from './models/geojsonint.model'

import 'leaflet-draw'
import { GeoJsonObject } from 'geojson';
import { PanelComponent } from './controls/panel/panel/panel.component';
import { MoveEndService } from '../map/mapevents/move-end.service'

 /* angular/leaflet typings: */

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: [
    './map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, AfterViewChecked {
  // private mymap;
  public map:Map;
  public options:MapOptions = {
    maxZoom: 15,
    inertiaDeceleration: 1000,
    attributionControl: false,
    worldCopyJump: true,
    center:latLng(32.344147, -106.758442),
    zoom: 10,
    minZoom:5,
    zoomControl:false,
    preferCanvas:true,
    /* initial layer */
    layers:[this.wms.googleSatellite]
  }


  public isCollapsed = false;
  public mrkr=false;
  public markerLayer
  public tmpPoints;
  public moveSubs;
  public myCanvas:Canvas;
  public Public = true;
  public mapContainer;
  
  

  public sidebarOptions: SidebarOptions = {
    position: 'right',
    autopan: true,
    closeButton: true,
    container: "sidebarr",
}
  

  // @ViewChild(PanelComponent) panel;

  // new rsjx subject to observe
  eventSubject = new Subject<string>()

  constructor(
    private markers: MarkerService,
    private socket: socketDataService,
    private wms: wmsService,
    private cust: CustomControlService,
    private moveEnd: MoveEndService
    ) {
      this.eventSubject
     }

     onMapReady(map: Map){
       console.log(this.sidebarOptions, this.options)
      this.map = map;
    } 

    handleMapMoveEnd(map: Map):void{
      
      
      


      let bbox = this.map.getBounds()
      this.moveEnd.boundsUtil(bbox)
      if(this.map.getZoom()<=13){
        // unsubscribes , no mem leak
        if(this.moveSubs && !this.moveSubs.closed){
          this.moveSubs.unsubscribe()
        }
        // destroys old markerLayer
        if(this.markerLayer!=undefined){
          // console.log(this.markerLayer, "not undefined")
          this.map.removeLayer(this.markerLayer)
        } else{
          console.log(this.markerLayer, "undefined!!!")
        }
        if(this.moveEnd.topos){
          
          let param = {}
          param["one"] = 1
          this.moveEnd.topos.params = param
          this.socket.emit('fetchpoints', this.moveEnd.topos)
          this.moveSubs = this.socket.listen('pointssend')
            .subscribe((data:GeoJsonObject)=>{
              //marker service goes here, which:
              // a. creates a layer full of markers from geojson
              // b. stores layer in the markers property within the service
              this.markers.createMarkers(data)
              this.markerLayer = this.markers.markers
              this.markerLayer.addTo(this.map)
          })
        } else {
          console.log('error: cannot define bounds')
        }
      } else {
        if(this.moveSubs && !this.moveSubs.closed){
          this.moveSubs.unsubscribe()
        }
        if(this.markerLayer!=undefined){
          console.log(this.markerLayer, "not undefined above 9")
          this.map.removeLayer(this.markerLayer)
        } else{
          console.log(this.markerLayer, "undefined!!! above 9")
        }
        console.log('below nine')
      }
    }

    handleEvent(eventType: string,evn) {
      this.eventSubject.next(eventType);
      
    }
    

    

  ngOnInit() {
    /*
      marker service could load 
      an onInit function with basic
      public markers:
      this.marker.fetchInitPoints() etc.
    */
    let googleHybrid = this.wms.googleHybrid
    let googleSatellite = this.wms.googleSatellite
    let googleStreet = this.wms.googleStreet
    let googleTerrain = this.wms.googleTerrain

    let states = this.wms.states
    let counties = this.wms.counties
    let surf = this.wms.surf
    let mlra = this.wms.mlra
    let statsgo = this.wms.statsgo
    let huc6 = this.wms.huc6
    let huc8 = this.wms.huc8
    let blank = new TileLayer('')

    let opaVar = [states, counties, surf, mlra, statsgo, huc6, huc8];
    let infoObj = {"tl_2017_us_state_wgs84": "US States", "tl_2017_us_county_wgs84": "US Counties", "surface_mgt_agency_wgs84": "Management Agency", "mlra_v42_wgs84": "LRR/MLRA", "statsgo_wgs84": "STATSGO", "wbdhu6_wgs84": "HUC-6", "wbdhu8_wgs84": "HUC-8"};
    let infoIDField = {"tl_2017_us_state_wgs84": "name", "tl_2017_us_county_wgs84": "name", "surface_mgt_agency_wgs84": "admin_agen", "mlra_v42_wgs84": "mlra_name", "statsgo_wgs84": "mukey", "wbdhu6_wgs84": "name", "wbdhu8_wgs84": "name"};
    let overlayID = d3.keys(infoObj);
    let baselayers = {"Google Terrain": googleTerrain, "Google Hybrid": googleHybrid, "Google Satellite": googleSatellite, "Google Street": googleStreet, "None": blank};
    let overlays = {"US States": states, "US Counties": counties, "Management Agency": surf, "LRR/MLRA": mlra, "STATSGO": statsgo, "HUC-6": huc6, "HUC-8": huc8};
    let overlayTitles = d3.keys(overlays);

    const layerNames:any = {};
    layerNames.baseLayers = baselayers
    // layerNames = {["baseLayers"]: baselayers}; //{"Google Terrain": googleTerrain, "Google Hybrid": googleHybrid, "Google Satellite": googleSatellite, "Google Street": googleStreet, "None": blank};
    
    layerNames.baseLayers.keys = d3.keys(layerNames.baseLayers);
    layerNames.baseLayers.values = d3.values(layerNames.baseLayers);

    layerNames.overlays = {};
    overlayTitles.forEach(function(tmpTitle,i) {
      layerNames.overlays[tmpTitle] = opaVar[i];
    });
    layerNames.overlays.keys = d3.keys(overlays);
    layerNames.overlays.values = d3.values(overlays);

    d3.select("body")
      .insert("div", ":first-child")
      .attr("id", "headerControls"); // header controls

      d3.select("#headerControls")
        .insert("div", ":first-child")
        .attr("id", "mapTools")
        .append("div")
        .attr("id", "baselayerSelect")
        .attr("class", "layerList")
        .append("div")
        .attr("id", "baselayerList")
        .attr("class", "cl_select")
        .property("title", "Click to change map baselayer")
        .html('<span id="baselayerListHeader">Change Baselayer</span><span class="fa fa-caret-down pull-right" style="position:relative;top:3px;"></span>')
        .on("click", function() { if(d3.select("#baselayerListDropdown").style("display") == "none") {d3.select("#baselayerListDropdown").style("display", "inline-block");} else {d3.select("#baselayerListDropdown").style("display", "none");} });;
  

    d3.select("#baselayerSelect")
      .append("div")
      .attr("id", "baselayerListDropdown")
      .attr("class", "layerListDropdown")
      .on("mouseleave", function() { d3.select(this).style("display", "none") });

    d3.select("#baselayerListDropdown").selectAll("div")
    .data(layerNames.baseLayers.keys)
    .enter()
      .append("div")
      .attr("class", "layerName")
      .text((d:any)=> { return d; })
      .property("value", function(d,i) { return i; })
      .property("title", function(d) { return d; })
      .on("click", function() { changeBaselayer(this); })
      .append("span")
      .attr("class", "fa fa-check pull-right activeOverlay")
      .style("visibility", function(d,i) { if(i == 1) {return "visible";} else {return "hidden";} });

      function changeBaselayer(tmpDiv) {
        //***Remove old layer
        var layerDivs:any = d3.select("#baselayerListDropdown").selectAll("div");
          
        layerDivs._groups[0].forEach(function(tmpLayer) {
          if(d3.select(tmpLayer).select("span").style("visibility") == "visible") {
            d3.select(tmpLayer).select("span").style("visibility", "hidden");
            this.map.removeLayer(layerNames.baseLayers.values[d3.select(tmpLayer).property("value")]);
          }
        });
    
        //***Add new layer
        d3.select(tmpDiv).select("span").style("visibility", "visible");
        this.map.addLayer(layerNames.baseLayers.values[tmpDiv.value]);
        layerNames.baseLayers.values[tmpDiv.value].bringToBack();       
      }

      // d3.select("#mapTools")
      // .append("div")
      // .attr("id", "overlaySelect")
      // .attr("class", "layerList")
      // .append("div")
      // .attr("id", "overlayList")
      // .attr("class", "cl_select")
      // .property("title", "Click to select overlay layers to display on map")
      // .html('<span id="overlayListHeader">View Overlay Layers</span><span class="fa fa-caret-down pull-right" style="position:relative;top:3px;"></span>')
      // .on("click", function() { if(d3.select("#overlayListDropdown").style("display") == "none") {d3.select("#overlayListDropdown").style("display", "inline-block");} else {d3.select("#overlayListDropdown").style("display", "none");} });;
    d3.select("#overlaySelect")
      .append("div")
      .attr("id", "overlayListDropdown")
      .attr("class", "layerListDropdown")
      .on("mouseleave", function() { d3.select(this).style("display", "none") });
    
  //  this.onMapReady(this.map)
  //  this.initMap()
  //  this.mymap.addLayer(this.panel.drawnItems)
  }


  ngAfterViewInit():void{
    
  }

  ngAfterViewChecked(){
    
  }
  
  // onMapReady(map:Map){
  //   map.on("dragend", (event)=>{
      
  //     if(this.theSubscription && !this.theSubscription.closed){
  //       this.theSubscription.unsubscribe()
  //     }
      
  //     let bbox = map.getBounds()
  //     console.log()
  //     let points:[number,number][] = [[bbox._northEast.lng, bbox._northEast.lat], [bbox._southWest.lng, bbox._northEast.lat], [bbox._southWest.lng, bbox._southWest.lat], [bbox._northEast.lng, bbox._southWest.lat]]
      
      
  //     let topos = {
  //       bounds:{
  //         _southWest:{
  //           lng:bbox._southWest.lng,
  //           lat:bbox._southWest.lat
  //         },
  //         _northEast:{
  //           lng:bbox._northEast.lng,
  //           lat:bbox._northEast.lat
  //         }
  //       }
  //     }
      
      
   
  //     this.socket.emit('fetchpoints', topos)
      
     
  //     this.theSubscription = this.socket.listen('pointssend')
  //       .subscribe((data:GeoJsonObject)=>{

  //       // clearing layergroup to avoid mem leak
  //       if(this.lyrGrp===undefined){
  //         //
  //       } else{
  //         this.lyrGrp.clearLayers()
  //         this.lyrGrp.addTo(map)
  //       }
  //       // this.myCanvas = L.canvas({padding:0.1})
  //       console.log(data, this.Public,"on drag end")
        
        
  //       // let m = {
  //       //   radius:5, 
  //       //   fillColor:"white",
  //       //   color:"yellow", 
  //       //   weight:2, 
  //       //   opacity:1, 
  //       //   fillOpacity:.8
  //       // }           
  //       // this.lyrGrp = L.featureGroup()
  //       //   L.geoJSON((data),{
            
  //       //     pointToLayer: (feature,latlng)=>{
              
  //       //       let label = 
  //       //         String("ID: ") + String(feature.id) +"<br>"+
  //       //         String("Public: ")+ String(feature.properties.Public)+"<br>"
  //       //         switch(feature.properties.Public){
  //       //           case true:
  //       //             m.fillColor = "#80bfff";
  //       //             break;
  //       //           case false:
  //       //             m.fillColor = "magenta";
  //       //             break;
  //       //         }
  //       //       return L.circleMarker(latlng,m).bindTooltip(label,{opacity:0.7})
  //       //     }
  //       //   }).addTo(this.lyrGrp)
  //       //   this.lyrGrp.addTo(map)
  //     })
  //   })
  // }


  // private initMap(){
  //   // trying out d3 stuff
  //   // let topoSVG = d3
  //   //   .select(this.mymap.getPanes().overlayPane)
  //   //   .append("svg")
  //   //   .attr("id", "topoSVG")
    
  //   this.mymap = L.map('map', {
  //     maxZoom: 15,
  //     inertiaDeceleration: 1000,
  //     attributionControl: false,
  //     worldCopyJump: true,
  //     center: [ 32.344147, -106.758442 ],
  //     zoom: 10,
  //     minZoom:7,
  //     zoomControl:false,
  //     preferCanvas:true,
  //     /* initial layer */
  //     layers:[this.wms.googleSatellite]
  //   });
  //   /* invalidate size debouncemoveend 
  //      adds a timeout on every moveend-event refetch */
  //   this.mymap.invalidateSize({
  //     debounceMoveend:true
  //   })

    
  //   /*filter control test */
  //   // let CustFilter = L.Control.extend({
  //   //   onAdd: (map)=>{
  //   //     let img = L.DomUtil.create('img')
  //   //     // img.appendChild()
  //   //     // img.src = '../../assets/exports/mat_filter.png';
  //   //     // img.style.width = '10px';
  //   //     return img;
  //   //   },
  //   //   onRemove: (map)=>{
  //   //     //
  //   //   }
  //   // })

  //   // let customfilter = (opts)=>{
  //   //   return new CustFilter(opts)
  //   // }

  //   // customfilter({position:'bottomleft'}).addTo(this.mymap)

  //   /* ..drawing logic >> probably could be contained inside service
  //      open an empty featuregroup to insert drawing into*/
  //   // let drawnItems = new L.FeatureGroup()
  //   // /* drawing control + options */
  //   // let drawControl = new L.Control.Draw({
  //   //   draw:{
  //   //     polyline: false,
  //   //     polygon:{
  //   //       allowIntersection:false,
  //   //       // showArea:true,
  //   //       repeatMode:false
  //   //     },
  //   //     circle:false,
  //   //     marker:false,
  //   //     rectangle:false,
  //   //     circlemarker:false
  //   //   },
  //   //   edit:{
  //   //     // use empty featuregroup layer
  //   //     // featureGroup:drawnItems
  //   //   }
  //   // })
  //   // this.mymap.addControl(drawControl)
  //   /* add featuregroup layer into map layers!
  //      the featuregroup itself still needs a layer */
  //   // this.mymap.addLayer(this.panel.drawnItems)
  //   /* on map drawing created:
  //      clear surrounding points, unsubscribe from 
  //      other observers, refetch  */


  //      //////////////////////////////////////////////////////// drawing
  //   // this.mymap.on('draw:created', (e)=> {
  //   //   if(this.panel.drawnItems===undefined){
  //   //     console.log('its still undefined')
  //   //   } else {
  //   //   this.panel.drawnItems.addLayer(e.layer);
  //   //   // bounds within drawn polygon
  //   //   let bbox =e.layer.getBounds()
  //   //   console.log(bbox)
  //   //   let topos = {
  //   //     bounds:{
  //   //       _southWest:{
  //   //         lng:bbox._southWest.lng,
  //   //         lat:bbox._southWest.lat
  //   //       },
  //   //       _northEast:{
  //   //         lng:bbox._northEast.lng,
  //   //         lat:bbox._northEast.lat
  //   //       }
  //   //     }
  //   //   }
  //   //   console.log('sending bounds...', topos)
  //   //   this.socket.emit('poly_bounds_sent', topos)
  //   //   this.socket.listen('poly_geojson_cameback').subscribe(data=>{
  //   //     console.log(data)
  //   //   })
      
     
  //     ////////////////////////////////////////////////////// end drawing
  //     // this.theSubscription = this.socket.listen('polygon_receive').subscribe((data:GeoJsonObject)=>{
  //     //   console.log("received geojson..", data)
  //     //   // clearing layergroup to avoid mem leak
  //     //   if(this.lyrGrp===undefined){
  //     //     //
  //     //   } else{
  //     //     this.lyrGrp.clearLayers()
  //     //     this.lyrGrp.addTo(this.mymap)
  //     //   }
  //     //   this.myCanvas = L.canvas({padding:0.1})
  //     //   console.log(data, this.Public,"on drag end")
        
        
  //     //   let m = {
  //     //     radius:5, 
  //     //     fillColor:"white",
  //     //     color:"yellow", 
  //     //     weight:2, 
  //     //     opacity:1, 
  //     //     fillOpacity:.8
  //     //   }           
  //     //   this.lyrGrp = L.featureGroup()
  //     //     L.geoJSON((data),{
            
  //     //       pointToLayer: (feature,latlng)=>{
              
  //     //         let label = 
  //     //           String("ID: ") + String(feature.id) +"<br>"+
  //     //           String("Public: ")+ String(feature.properties.Public)+"<br>"
  //     //           switch(feature.properties.Public){
  //     //             case true:
  //     //               m.fillColor = "#80bfff";
  //     //               break;
  //     //             case false:
  //     //               m.fillColor = "magenta";
  //     //               break;
  //     //           }
  //     //         return L.circleMarker(latlng,m).bindTooltip(label,{opacity:0.7})
  //     //       }
  //     //     }).addTo(this.lyrGrp)
  //     //     this.lyrGrp.addTo(this.mymap)
  //     // })
  // //   }
  // // });
  
  // // let impCont = this.cust.newControl()
  // // this.map = this.mymap

  // // impCont.addTo(this.map)
  // // this.mapContainer = impCont
  // // console.log(this.mapContainer, 'from map.component')
  // // this.mapContainer = impCont.getContainer()
  // // let whereToPut = document.getElementById('geocoder')
  
  // // function setParent(el, newParent){
  // //   newParent.appendChild(el)
  // // }
  // // setParent(htmlObject,whereToPut)
  // // document.getElementById('geocoder').appendChild(impCont.addTo(this.mymap))
  
 

  //   // let a = document.getElementById('new-parent')



  //   this.mymap.on('load', (event)=>{
  //     let bbox =this.mymap.getBounds()
  //     let topos = {
  //       bounds:{
  //         _southWest:{
  //           lng:bbox._southWest.lng,
  //           lat:bbox._southWest.lat
  //         },
  //         _northEast:{
  //           lng:bbox._northEast.lng,
  //           lat:bbox._northEast.lat
  //         }
  //       }
  //     }
  //     this.socket.emit('fetchpoints', topos)
  //     this.socket.listen('pointssend').subscribe(data=>{
  //       console.log(data, "FROM onLOAD")
  //     })
  //   })


  //   // 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  //   const tiles = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
  //     maxZoom: 20,
  //     subdomains:['mt0','mt1','mt2','mt3']
  //   })
  //   tiles.addTo(this.mymap);



  //   this.mymap.on("dragend", (event)=>{
  //     if(this.myCanvas!==undefined){
  //       //
  //     }
  //     if(this.theSubscription && !this.theSubscription.closed){
  //       this.theSubscription.unsubscribe()
  //     }
      
  //     let bbox =this.mymap.getBounds()
  //     let points:[number,number][] = [[bbox._northEast.lng, bbox._northEast.lat], [bbox._southWest.lng, bbox._northEast.lat], [bbox._southWest.lng, bbox._southWest.lat], [bbox._northEast.lng, bbox._southWest.lat]]
      
      
  //     let topos = {
  //       bounds:{
  //         _southWest:{
  //           lng:bbox._southWest.lng,
  //           lat:bbox._southWest.lat
  //         },
  //         _northEast:{
  //           lng:bbox._northEast.lng,
  //           lat:bbox._northEast.lat
  //         }
  //       }
  //     }
      
  //     // let tmpPoly = d3.polygonHull(points)
  //     // let tmpTopo = this.mymap.getPanes()
  //     // this.tmpPoints = tmpPoly
   
  //     this.socket.emit('fetchpoints', topos)
      
     
  //     this.theSubscription = this.socket.listen('pointssend').subscribe((data:GeoJsonObject)=>{

  //       // clearing layergroup to avoid mem leak
  //       if(this.lyrGrp===undefined){
  //         //
  //       } else{
  //         this.lyrGrp.clearLayers()
  //         this.lyrGrp.addTo(this.mymap)
  //       }
  //       this.myCanvas = L.canvas({padding:0.1})
  //       console.log(data, this.Public,"on drag end")
        
        
  //       let m = {
  //         radius:5, 
  //         fillColor:"white",
  //         color:"yellow", 
  //         weight:2, 
  //         opacity:1, 
  //         fillOpacity:.8
  //       }           
  //       this.lyrGrp = L.featureGroup()
  //         L.geoJSON((data),{
            
  //           pointToLayer: (feature,latlng)=>{
              
  //             let label = 
  //               String("ID: ") + String(feature.id) +"<br>"+
  //               String("Public: ")+ String(feature.properties.Public)+"<br>"
  //               switch(feature.properties.Public){
  //                 case true:
  //                   m.fillColor = "#80bfff";
  //                   break;
  //                 case false:
  //                   m.fillColor = "magenta";
  //                   break;
  //               }
  //             return L.circleMarker(latlng,m).bindTooltip(label,{opacity:0.7})
  //           }
  //         }).addTo(this.lyrGrp)
  //         this.lyrGrp.addTo(this.mymap)
  //     })
  //   })

  //   this.mymap.on("zoomend", (event)=>{
  //     if(this.myCanvas!==undefined){
  //       //
  //     }
  //     if(this.theSubscription && !this.theSubscription.closed){
  //       this.theSubscription.unsubscribe()
  //     }
      
  //     let bbox =this.mymap.getBounds()
  //     let points:[number,number][] = [[bbox._northEast.lng, bbox._northEast.lat], [bbox._southWest.lng, bbox._northEast.lat], [bbox._southWest.lng, bbox._southWest.lat], [bbox._northEast.lng, bbox._southWest.lat]]
      
      
  //     let topos = {
  //       bounds:{
  //         _southWest:{
  //           lng:bbox._southWest.lng,
  //           lat:bbox._southWest.lat
  //         },
  //         _northEast:{
  //           lng:bbox._northEast.lng,
  //           lat:bbox._northEast.lat
  //         }
  //       }
  //     }
      
  //     let tmpPoly = d3.polygonHull(points)
  //     let tmpTopo = this.mymap.getPanes()
  //     this.tmpPoints = tmpPoly
   
  //     this.socket.emit('fetchpoints', topos)
      
     
  //     this.theSubscription = this.socket.listen('pointssend').subscribe((data:GeoJsonObject)=>{

  //       // clearing layergroup to avoid mem leak
  //       if(this.lyrGrp===undefined){
  //         //
  //       } else{
  //         this.lyrGrp.clearLayers()
  //         this.lyrGrp.addTo(this.mymap)
  //       }
  //       this.myCanvas = L.canvas({padding:0.1})
  //       console.log(data, this.Public,"on zoom end")
        
        
  //       let m = {
  //         radius:5, 
  //         fillColor:"white",
  //         color:"yellow", 
  //         weight:2, 
  //         opacity:1, 
  //         fillOpacity:.8
  //       }           
  //       this.lyrGrp = L.featureGroup()
  //         L.geoJSON(data,{
            
  //           pointToLayer: (feature,latlng)=>{
              
  //             let label = 
  //               String("ID: ") + String(feature.id) +"<br>"+
  //               String("Public: ")+ String(feature.properties.Public)+"<br>"
  //               switch(feature.properties.Public){
  //                 case true:
  //                   m.fillColor = "#80bfff";
  //                   break;
  //                 case false:
  //                   m.fillColor = "magenta";
  //                   break;
  //               }
  //             return L.circleMarker(latlng,m).bindTooltip(label,{opacity:0.7})
  //           }
  //         }).addTo(this.lyrGrp)
  //         this.lyrGrp.addTo(this.mymap)
  //     })
  //   })
  // }

  ngOnDestroy(){
    this.eventSubject.unsubscribe()
  }

  // showMarkers() {
  //   // clearing layergroup to avoid mem leak
  //   if(this.lyrGrp===undefined){
  //     //
  //   } else{
  //     this.lyrGrp.clearLayers()
  //     this.lyrGrp.addTo(this.mymap)
  //   }
  //   let bbox =this.mymap.getBounds()
  //   let points:[number,number][] = [[bbox._northEast.lng, bbox._northEast.lat], [bbox._southWest.lng, bbox._northEast.lat], [bbox._southWest.lng, bbox._southWest.lat], [bbox._northEast.lng, bbox._southWest.lat]]
  //    // use the size of county in a spatial query to create the buffer distance 
  //     //where to offset the point within.
  //     // jitter only with authorized token, actual 

  //     // divide the workload with jacob

  //     // connection string postgres for sarah for dima stuff
  //     // brandon needs a table from horizontal flux data
  //     // horizontal flux needs coords but ericha etc. need to get it in
  //     //
     
















  //     //
  //   let topos = {
  //     bounds:{
  //       _southWest:{
  //         lng:bbox._southWest.lng,
  //         lat:bbox._southWest.lat
  //       },
  //       _northEast:{
  //         lng:bbox._northEast.lng,
  //         lat:bbox._northEast.lat
  //       }
  //     }
  //   }
    
  //   let tmpPoly = d3.polygonHull(points)
  //   let tmpTopo = this.mymap.getPanes()
  //   this.tmpPoints = tmpPoly
  //   // topos['public'] = true
    
  //   if(this.Public===false){
  //     topos['public'] = true
  //     // send where true 
  //     // change to true
  //     this.socket.emit('onpublic', topos)
  //     this.Public=true

  //   } else {
  //     topos['public'] = false
  //     // remove where true
  //     // change to false
  //     this.socket.emit('onpublic', topos)
  //     this.Public=false
  //   }


  //   // this.socket.emit('onpublic', topos)
    
   
  //   // this.theSubscription = this.socket.listen('pointssend').subscribe(data=>{
  //   //   if(this.lyrGrp===undefined){
  //   //     console.log('SOMEHTING')
  //   //   } else{
  //   //     this.lyrGrp.clearLayers()
  //   //     this.lyrGrp.addTo(this.mymap)
  //   //   }
  //   //   this.myCanvas = L.canvas({padding:0.1})
  //   //   console.log(data)
      
      
  //   //   let m = {
  //   //     radius:5, 
  //   //     fillColor:"white",
  //   //     color:"yellow", 
  //   //     weight:2, 
  //   //     opacity:1, 
  //   //     fillOpacity:.8
  //   //   }           
  //   //   this.lyrGrp = L.featureGroup()
  //   //     L.geoJSON(data,{
          
  //   //       pointToLayer: (feature,latlng)=>{
            
  //   //         let label = 
  //   //           String("ID: ") + String(feature.id) +"<br>"+
  //   //           String("Public: ")+ String(feature.properties.Public)+"<br>"
  //   //           switch(feature.properties.Public){
  //   //             case true:
  //   //               m.fillColor = "#80bfff";
  //   //               break;
  //   //             case false:
  //   //               m.fillColor = "magenta";
  //   //               break;
  //   //           }
  //   //         return L.circleMarker(latlng,m).bindTooltip(label,{opacity:0.7})
  //   //       },
  //   //       renderer: this.myCanvas
  //   //     }).addTo(this.lyrGrp)
  //   //     this.lyrGrp.addTo(this.mymap)
  //   // })
  // }
  

  // addMarks(){
    
  //   // const geobounds = this.lyrGrp.addTo(this.mymap)
  //   // this.mrkr = true
    
  //   // if(this.lyrGrp){
  //   //    this.mymap.fitBounds(this.lyrGrp.getBounds())
  //   //   //  this.mymap.setZoom(25)
  //   // }

  // }

  // removeMarks(){
  //   // this.mymap.removeLayer(this.lyrGrp)
  //   // this.mrkr = false
  // }
}
