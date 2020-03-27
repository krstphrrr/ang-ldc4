
import { Component, OnInit, AfterViewInit, AfterViewChecked, ViewChild } from '@angular/core';
import * as L from 'leaflet'
import {Map, latLng, Canvas, MapOptions, LeafletEvent, TileLayer} from 'leaflet'
// import  '../../plugins/L.Control.Sidebar.js'
import 'leaflet-easybutton'
import 'leaflet-sidebar-v2'
import { MarkerService } from './marker.service'
// import * as $ from 'jquery';
declare var $: any;
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

// declare module 'leaflet' {
//   namespace control {
//     function sidebar(options?: any): Control.Sidebar;
//   }
//   namespace Control {
//     interface Sidebar {
//       addTo(map: L.Map): any;
//     }
//   }
// }

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: [
    './map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, AfterViewChecked {
  // private mymap;
  public mymap
  public ctlSidebar;
  public ctlEasybutton
  


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
    console.log()
    this.ctlSidebar = L.control.sidebar({
      autopan:true,
      closeButton:true,
      container:'sidebar',
      position:'left'
    }).addTo(this.mymap)
    // this.ctlEasybutton = L.easyButton('glyphicon-transfer',function(){
    //   this.ctlSidebar.
    // }).addTo(this.mymap)


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

    // d3.select("body")
    //   .insert("div", ":first-child")
    //   .attr("id", "headerControls"); // header controls

    //   d3.select("#headerControls")
    //     .insert("div", ":first-child")
    //     .attr("id", "mapTools")
    //     .append("div")
    //     .attr("id", "baselayerSelect")
    //     .attr("class", "layerList")
    //     .append("div")
    //     .attr("id", "baselayerList")
    //     .attr("class", "cl_select")
    //     .property("title", "Click to change map baselayer")
    //     // .property("data-toggle", "dropdown")
    //     .html('<span id="baselayerListHeader">Change Baselayer</span><i class="fas fa-caret-down fa-pull-right"></i>')
    //     .on("click", function() { if(d3.select("#baselayerListDropdown").style("display") == "none") {d3.select("#baselayerListDropdown").style("display", "inline-block");} else {d3.select("#baselayerListDropdown").style("display", "none");} });;
   

    // d3.select("#baselayerSelect")
    //   .append("div")
    //   .attr("id", "baselayerListDropdown")
    //   .attr("class", "layerListDropdown")
    //   .on("mouseleave", function() { d3.select(this).style("display", "none") });
    
    //   console.log(layerNames.baseLayers.values, "es mappy")
    
    // d3.select("#baselayerListDropdown").selectAll("div")
    // .data(layerNames.baseLayers.keys)
    // .enter()
    //   .append("div")
    //   .attr("class", "layerName")
    //   .text((d:any)=> { return d; })
    //   .property("value", function(d,i) { return i; })
    //   .property("title", function(d) { return d; })
    //   .on("click", function() { changeBaselayer(this); })
    //   .append("span")
    //   .attr("class", "fas fa-check fa-pull-right activeOverlay")
    //   .style("visibility", function(d,i) { if(i == 1) {return "visible";} else {return "hidden";} });

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

    d3.select("#mapTools")
      .append("div")
      .attr("id", "overlaySelect")
      .attr("class", "layerList")
      .append("div")
      .attr("id", "overlayList")
      .attr("class", "cl_select")
      .property("title", "Click to select overlay layers to display on map")
      .html('<span id="overlayListHeader">View Overlay Layers</span><span class="fas fa-caret-down fa-pull-right" style="position:relative;top:3px;"></span>')
      .on("click", function() { if(d3.select("#overlayListDropdown").style("display") == "none") {d3.select("#overlayListDropdown").style("display", "inline-block");} else {d3.select("#overlayListDropdown").style("display", "none");} });;
    d3.select("#overlaySelect")
      .append("div")
      .attr("id", "overlayListDropdown")
      .attr("class", "layerListDropdown")
      .on("mouseleave", function() { d3.select(this).style("display", "none") });

    //******Add overlay options
  d3.select("#overlayListDropdown").selectAll("div")
    .data(layerNames.overlays.keys)
    .enter()
    .append("div")
    .attr("id", function(d,i) { return "layerToggleDiv" + i; })
    .attr("class", "layerName")
    .text((d:any)=>{ return d; })
    .property("value", function(d,i) { return i; })
    .property("title", function(d) { return d; })
    .property("name", function(d,i) { return overlayID[i]; })
    .on("click", function() { changeOverlay(this); })
    .append("span")
    .attr("class", "fa fa-check pull-right activeOverlay")
    .style("visibility", "hidden"); //function(d) { if(d == "US States") { map.addLayer(states); return "visible"; } else { return "hidden"; } });
    
    function changeOverlay(tmpDiv) {
      if(d3.select(tmpDiv).select("span").style("visibility") == "hidden") {
        d3.select(tmpDiv).select("span").style("visibility", "visible");
        mappy.addLayer(layerNames.overlays.values[tmpDiv.value]);
        // check4Json();
        layerNames.overlays.values[tmpDiv.value].bringToFront();
        // geoInd.bringToFront();
        addLegendImg(tmpDiv.name, tmpDiv.title, layerNames.overlays.values[tmpDiv.value], ["overlays",tmpDiv.title]);
      } 
      else {
        d3.select(tmpDiv).select("span").style("visibility", "hidden");
        // removeTopo(topos[d3.select(tmpDiv).property("name")]);
        mappy.removeLayer(layerNames.overlays.values[tmpDiv.value]);
        remLegendImg(tmpDiv.name);
      }
      //check4Json();
    }

    //******Function to toggle tool windows
  var toggleWords = {"legend":"Legend", "info":"Identify", "locate": "Locate", "filter": "Filter"}
  const toolWindowToggle = function (tmpDiv) {
    if (d3.select("#" + tmpDiv + "Div").style("opacity") == "1") {
      d3.select("#" + tmpDiv + "Div").transition().style("opacity", "0").style("visibility", "hidden");
      d3.select("#hc" + tmpDiv.charAt(0).toUpperCase() + tmpDiv.slice(1) + "Div").property("title", "Click to show " + toggleWords[tmpDiv] + " window");
    }
    else {
      d3.select("#" + tmpDiv + "Div").transition().duration(250).ease(d3.easeCubic).style("opacity", "1").style("display", "block").style("visibility", "visible").on("end", resizePanels);            
      d3.select("#hc" + tmpDiv.charAt(0).toUpperCase() + tmpDiv.slice(1) + "Div").property("title", "Click to hide " + toggleWords[tmpDiv] + " window");
      // setZ(d3.select("#" + tmpDiv + "Div")._groups[0][0]);
    }
  }
  function setZ(tmpWin) {
    if (d3.select("#map").classed("introjs-showElement") == false) {
      d3.selectAll("#legendDiv,#infoDiv,#locateDiv,#filterDiv,#pointDiv,#downloadDiv").style("z-index", function() { if(d3.select(this).style("opacity") == '1') {return 1001;} else {return 7500;} }); 
      d3.select(tmpWin).style("z-index", 1002);
    }
  }

  //******Adjust div position to ensure that it isn't overflowing window
function resizePanels() {
  var bodyRect = document.body.getBoundingClientRect();
  var tmpWindows = ["infoDiv", "legendDiv"];
        
  tmpWindows.forEach(function(win) {
    var winRect = document.getElementById(win).getBoundingClientRect();
    if(winRect.bottom > bodyRect.bottom) {
      d3.select("#" + win).style("top", bodyRect.height - winRect.height + "px");
    }
    if(winRect.right > bodyRect.right) {
      d3.select("#" + win).style("left", bodyRect.width - winRect.width + "px");
    }
  });
  d3.select("#legendImgDiv").style("min-width", "0px").style("width", "auto");
  var legRect = document.getElementById("legendImgDiv").getBoundingClientRect();
  d3.select("#legendImgDiv").style("min-width", legRect.width + "px");
}


     //******Make div for legend
  d3.select("body")
  .append("div")
  .attr("class", "legend gradDown")
  .attr("id", "legendDiv");

  $('#legendDiv').draggable({containment: "html", cancel: ".toggle-group,.layerLegend,textarea,button,select,option"});

  d3.select("#legendDiv")
    .append("h4")
    .text("Legend")
    .attr("class", "legTitle")
    .attr("id", "legendTitle")
    .append("span")
    .html('<span class="fa fa-info-circle" data-toggle="tooltip" data-container="body" data-placement="auto" data-html="true" title="<p><u><b>Legend</b></u></p><p>Displays legends for added map layers enabling their interpretation along with control over their transparency.<br><br>Drag and drop layers to change their order on the map.</p>"</span>');

  d3.select("#legendTitle")
    .html(d3.select("#legendTitle").html() + '<div class="exitDiv"><span id="hideLegend" class="fa fa-times-circle" data-toggle="tooltip" data-container="body" data-placement="auto" data-html="true" title="<p>Click to hide window</p>"</span></div>'); 

  d3.select("#hideLegend")
    .on("click", function() { toolWindowToggle("legend"); });

  d3.select("#legendDiv")
    .append("div")
    .attr("id", "legendDefault")
    .text("Add a map layer to view its legend...");

  d3.select("#legendDiv")
    .append("div")
    .attr("id", "legendImgDiv");

    $("#legendImgDiv").sortable({appendTo: "#legendImgDiv", containment: "#legendImgDiv", cancel: "input,textarea,button,select,option", forcePlaceholderSize: true, placeholder: "sortable-placeholder", helper: "original", tolerance: "pointer", stop: function(event, ui) { reorder(event, ui); }, start: function(event, ui) { helperPlaceholder(event, ui); }});
      //******Change the layer orders after drag and drop
  function reorder(tmpEvent, tmpUI) {
    var tmpCnt = tmpEvent.target.children.length;
    var i = 0
    for (let child of tmpEvent.target.children) {
      overlays[infoObj[child.id.slice(0,-6)]].setZIndex(tmpCnt - i);
      i += 1;
    }
 }
   //******Style the helper and placeholder when dragging/sorting
   function helperPlaceholder(tmpEvent, tmpUI) {
    console.log(tmpUI); 
    d3.select(".ui-sortable-placeholder.sortable-placeholder").style("width", d3.select("#" + tmpUI.item[0].id).style("width")).style("height", "37px");  //.style("background", "rgba(255,255,255,0.25)"); 
  }





    function addLegendImg(tmpName, tmpTitle, tmpLayer, tmpPath) {
      if(tmpName.includes("surf") || tmpName.includes("mlra")) {
        var tmpOpa = 0.6;
      }
      else {
        var tmpOpa = 1;
      }
      tmpLayer.setOpacity(tmpOpa);
  
      d3.select("#legendImgDiv")
        .insert("div", ":first-child")
        .attr("id", tmpName + "Legend")
        .attr("value", tmpPath)
        .attr("class", "layerLegend")
        .append("div")
        .attr("id", tmpName + "LegendHeader")
        .attr("data-toggle", "collapse")
        .attr("data-target", "#" + tmpName + "collapseDiv")
        // .on("click", function() { changeCaret(d3.select(this).select("span")._groups[0][0]); })
        .append("div")
        .attr("class", "legendTitle")
        .html('<h6>' + tmpTitle + '</h6><div class="exitDiv"><span class="fa fa-caret-down legendCollapse" title="View legend"></span></div>');
  
  
      function changeCaret(tmpSpan) {
        if(d3.select(tmpSpan).classed("fa-caret-down")) {
          d3.select(tmpSpan).classed("fa-caret-down", false).classed("fa-caret-up", true).property("title", "Hide legend");
        }
        else {
          d3.select(tmpSpan).classed("fa-caret-up", false).classed("fa-caret-down", true).property("title", "View legend");
        }
      }
  
      d3.select("#" + tmpName + "Legend")
        .append("div")
        .attr("id", tmpName + "collapseDiv")
        .attr("class", "collapseDiv collapse")
        .append("div")
        .attr("id", tmpName + "LegImgDiv")
        .attr("class","legImgDiv")
        .append("img")
        .attr("id", tmpName + "LegendImg")
        .attr("class", "legendImg")
        .property("title", tmpTitle);
  
      $("#" + tmpName + "collapseDiv").on("shown.bs.collapse", function() { resizePanels(); });
      $("#" + tmpName + "collapseDiv").on("hidden.bs.collapse", function() { resizePanels(); });
  
  
      //***Set div width and offset after the image has been loaded
      $("#" + tmpName + "LegendImg").one("load", function() {
        var tmpRect = document.getElementById(tmpName + "LegendImg").getBoundingClientRect();
        let newmaxheight = tmpRect.height - 67 
        d3.select("#" + tmpName + "LegImgDiv").style("max-height", newmaxheight);
        // d3.select("#" + tmpName + "LegImgDiv").style({"max-width": tmpRect.width + "px"});

        d3.select("#" + tmpName + "Legend").style("opacity", "1");     
      }).attr("src", "https://landscapedatacommons.org/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=30&HEIGHT=30&LAYER=ldc:" + tmpName);
  
      d3.select("#" + tmpName + "collapseDiv")
        .append("div")
        .attr("id", tmpName + "LegendSlider")
        .property("title", tmpTitle + " Layer Opacity: " + tmpOpa * 100 + "%");
  
      $("#" + tmpName + "LegendSlider").slider({animate: "fast", min: 0, max: 100, value: tmpOpa * 100, slide: function(event, ui) { layerOpacity(ui, tmpLayer); } });
  
      d3.select("#legendDefault").style("display", "none");
  
      d3.select("#legendImgDiv")
        .style("display", "block");
  
      // if(d3.select("#legendDiv").style("opacity") == 0) {
      //   toolWindowToggle("legend");
      // }
  
      resizePanels();
    }

    function remLegendImg(tmpName) {
      d3.select("#" + tmpName + "Legend").remove();
  
      // if(d3.select("#legendImgDiv").selectAll("div")._groups[0].length == 0) {
      //   d3.select("#legendImgDiv").style("display", "none");
      //   d3.select("#legendDefault").style("display", "block");
      // }
    }

    //******Change transparency of current legend layer
  function layerOpacity(tmpSlider, tmpLayer) {
    var tmpOpacity = tmpSlider.value/100; 
    tmpSlider.title = "Opacity: " + tmpSlider.value + "%"; 
    tmpLayer.setOpacity(tmpOpacity);
  }

   //******Make div for info
  d3.select("body")
    .append("div")
    .attr("class", "legend gradDown")
    .attr("id", "infoDiv");

  $('#infoDiv').draggable({containment: "html", cancel: ".toggle-group,input,textarea,button,select,option"});

  d3.select("#infoDiv")
    .append("h4")
    .text("Identify")
    .attr("class", "legTitle")
    .attr("id", "infoTitle")
    .append("span")
    .html('<span class="fa fa-info-circle" data-toggle="tooltip" data-container="body" data-placement="auto" data-html="true" title="<p><u><b>Identify</b></u></p><p>Displays attribute value for visible overlay layers for a clicked point on the map</p>"</span>');
 
  d3.select("#infoTitle")
    .html(d3.select("#infoTitle").html() + '<div class="exitDiv"><span id="hideInfo" class="fa fa-times-circle" data-toggle="tooltip" data-container="body" data-placement="auto" data-html="true" title="<p>Click to hide window</p>"</span></div>'); 

  d3.select("#hideInfo")
    .on("click", function() { toolWindowToggle("info"); });

  d3.select("#infoDiv")
    .append("div")
    .attr("id", "info");


 
    

    
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
