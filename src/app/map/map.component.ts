
import { Component, OnInit, AfterViewInit, AfterViewChecked, ViewChild } from '@angular/core';
import * as L from 'leaflet'
import {Map, latLng, Canvas, MapOptions, LeafletEvent, TileLayer} from 'leaflet'

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
  public mymap
  


  public isCollapsed = false;
  public mrkr=false;
  public markerLayer
  public tmpPoints;
  public moveSubs;
  public myCanvas:Canvas;
  public Public = true;
  public mapContainer;
    

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

   

    handleMapMoveEnd(){

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
    this.initMap()
    
    console.log(this.mymap.eachLayer(i=>{return i}),"pop")
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
    let blank = new L.TileLayer('')
    

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
    let mappy = this.mymap
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
        // .property("data-toggle", "dropdown")
        .html('<span id="baselayerListHeader">Change Baselayer</span><i class="fas fa-caret-down"></i>')
        .on("click", function() { if(d3.select("#baselayerListDropdown").style("display") == "none") {d3.select("#baselayerListDropdown").style("display", "inline-block");} else {d3.select("#baselayerListDropdown").style("display", "none");} });;
   

    d3.select("#baselayerSelect")
      .append("div")
      .attr("id", "baselayerListDropdown")
      .attr("class", "layerListDropdown")
      .on("mouseleave", function() { d3.select(this).style("display", "none") });
    
      console.log(layerNames.baseLayers.values, "es mappy")
    
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
        let layerDivs:any = d3.select("#baselayerListDropdown").selectAll("div");
          
        layerDivs._groups[0].forEach(function(tmpLayer) {
          if(d3.select(tmpLayer).select("span").style("visibility") == "visible") {
            d3.select(tmpLayer).select("span").style("visibility", "hidden");
            mappy.removeLayer(layerNames.baseLayers.values[d3.select(tmpLayer).property("value")]);
          }
        });
    
        //***Add new layer
        d3.select(tmpDiv).select("span").style("visibility", "visible");
        mappy.addLayer(layerNames.baseLayers.values[tmpDiv.value]);
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


  private initMap(){
   
    this.mymap = L.map('map', {
      maxZoom: 15,
      inertiaDeceleration: 1000,
      attributionControl: false,
      worldCopyJump: true,
      center:[32.344147, -106.758442],
      zoom: 10,
      minZoom:5,
      zoomControl:false,
      preferCanvas:true,
      /* initial layer */
      layers:[this.wms.googleSatellite]
    });
    /* invalidate size debouncemoveend 
       adds a timeout on every moveend-event refetch */
    this.mymap.on('dragend', event=>{
      
      
      let bbox = this.mymap.getBounds()
      this.moveEnd.boundsUtil(bbox)
      if(this.mymap.getZoom()<=13){
        // unsubscribes , no mem leak
        if(this.moveSubs && !this.moveSubs.closed){
          this.moveSubs.unsubscribe()
        }
        // destroys old markerLayer
        if(this.markerLayer!=undefined){
          // console.log(this.markerLayer, "not undefined")
          this.mymap.removeLayer(this.markerLayer)
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
              this.markerLayer.addTo(this.mymap)
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
          this.mymap.removeLayer(this.markerLayer)
        } else{
          console.log(this.markerLayer, "undefined!!! above 9")
        }
        console.log('below nine')
      }
    })

    

    
  }

  ngOnDestroy(){
    this.eventSubject.unsubscribe()
  }

}
