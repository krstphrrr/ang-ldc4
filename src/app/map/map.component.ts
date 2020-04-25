
import { Component, OnInit, AfterViewInit, AfterViewChecked, ViewChild, ElementRef, Renderer2, Directive } from '@angular/core';
import * as L from 'leaflet'
import {Map, latLng, Canvas, MapOptions, LeafletEvent, TileLayer} from 'leaflet'
// import  '../../plugins/L.Control.Sidebar.js'
import 'leaflet-easybutton'
import 'leaflet-sidebar-v2'
import { MarkerService } from '../services/marker.service'
// import * as $ from 'jquery';
declare var $: any;
import { Subject } from 'rxjs';
import { debounceTime, scan } from 'rxjs/operators';
import * as d3 from 'd3'
import { socketDataService } from '../services/socketTest.service'
import { wmsService } from '../services/wms.service'
import { CustomControlService } from '../map/controls/custom-control.service'

import {IGeoJson} from './models/geojsonint.model'

import 'leaflet-draw'
import { GeoJsonObject } from 'geojson';
import { PanelComponent } from './controls/panel/panel/panel.component';
import { MoveEndService } from '../services/move-end.service'
import { CdkDrag, DragDrop } from '@angular/cdk/drag-drop';
import * as turf from '@turf/turf'
import {LayerService} from '../services/layer.service'

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
// @Directive({
//   selector: '[cdkDrag]'
// })
export class MapComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('container') 
  private test2Div: ElementRef;
  @ViewChild('pane_container') 
  private paneDiv: ElementRef;
  // private mymap;

  public mymap
  public ctlSidebar;
  public initLayers;
  


  public isCollapsed = false;
  public mrkr=false;
  public markerLayer
  public tmpPoints;
  public moveSubs;
  public myCanvas:Canvas;
  public Public = true;
  public mapContainer;

  public drawnItems;

  public tmpName;
  public infoObj = {"tl_2017_us_state_wgs84": "US States", "tl_2017_us_county_wgs84": "US Counties", "surface_mgt_agency_wgs84": "Management Agency", "mlra_v42_wgs84": "LRR/MLRA", "statsgo_wgs84": "STATSGO", "wbdhu6_wgs84": "HUC-6", "wbdhu8_wgs84": "HUC-8"};
  public infoIDField = {"tl_2017_us_state_wgs84": "name", "tl_2017_us_county_wgs84": "name", "surface_mgt_agency_wgs84": "admin_agen", "mlra_v42_wgs84": "mlra_name", "statsgo_wgs84": "mukey", "wbdhu6_wgs84": "name", "wbdhu8_wgs84": "name"};
  public sat;
  public terr;
  public hy;
  public st;
  public layerCheck;
  public resultOutput;
  // @ViewChild(PanelComponent) panel;

  // new rsjx subject to observe
  eventSubject = new Subject<string>()

  constructor(
    private dragdrop:DragDrop,
    private el:ElementRef,
    private renderer: Renderer2,
    private markers: MarkerService,
    private socket: socketDataService,
    private wms: wmsService,
    private layerServ: LayerService,
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
   this.getLayers2('sat')
   this.getLayers2('st')
   this.getLayers2('terr')
   this.getLayers2('hy')
   this.layerCheck = this.layerServ.layer
  
  }
  getLayers2(which=null){
    if(which==='sat'){
      this.wms.getLayers(which)
      .subscribe(lays => this.sat = lays)
    } else if(which=='st'){
      this.wms.getLayers(which)
      .subscribe(lays => this.st = lays)
    } else if(which=='terr'){
      this.wms.getLayers(which)
      .subscribe(lays => this.terr = lays)
    } else if (which=='hy'){
      this.wms.getLayers(which)
      .subscribe(lays => this.hy = lays)
    }
    
  }

  drawingControl(mapObject){
    let drawnItems = new L.FeatureGroup()
    /* drawing control + options */
    let drawControl = new L.Control.Draw({
      draw:{
        polyline: false,
        polygon:{
          allowIntersection:false,
          // showArea:true,
          repeatMode:false
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
    this.drawnItems = drawnItems
    mapObject.addControl(drawControl)
    let container = drawControl.getContainer()
    // console.log(drawnItems)
    let child_div = document.getElementById('drawingDiv')
    // function setParent(el:HTMLElement, newParent:HTMLElement){
    //   Object.defineProperty(newParent, 'appendChild',{

    //   })
    //   newParent.appendChild(el)
    // }
    // setParent(container, child_div)
    mapObject.addLayer(drawnItems)
  }


  ngAfterViewInit():void{
    this.initMap()
    this.ctlSidebar = L.control.sidebar({
      autopan:true,
      closeButton:true,
      container:'sidebar',
      position:'left'
    })
     .addTo(this.mymap)
    this.drawingControl(this.mymap)

    let states = this.wms.states
    let counties = this.wms.counties
    let surf = this.wms.surf
    let mlra = this.wms.mlra
    let statsgo = this.wms.statsgo
    let huc6 = this.wms.huc6
    let huc8 = this.wms.huc8
    let blank = new L.TileLayer('')

    // let layerNames = this.markerLayer
    let overlayID = d3.keys(this.infoObj);
    let opaVar = [states, counties, surf, mlra, statsgo, huc6, huc8];
    let baselayers = {"Google Terrain": this.terr, "Google Hybrid": this.hy, "Google Satellite": this.sat, "Google Street": this.st, "None": blank};
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

    d3.select("#pane_container")
        .insert("div", ":first-child")
        .attr("id", "mapTools")
        .append("div")
        .attr("id", "baselayerSelect")
        .attr("class", "layerList")
        .append("div")
        .attr("id", "baselayerList")
        .attr("class", "cl_select")
        .property("title", "Click to change map baselayer")
        .property("data-toggle", "dropdown")
        .html('<span id="baselayerListHeader">Change Baselayer</span><i class="fas fa-caret-down fa-pull-right"></i>')
        .on("click", function() { 
          if(d3.select("#baselayerListDropdown")
            .style("display") == "none") {
              d3.select("#baselayerListDropdown")
                .style("display", "inline-block");
              } else {
                d3.select("#baselayerListDropdown")
                  .style("display", "none");} 
                });;
   

    d3.select("#baselayerSelect")
      .append("div")
      .attr("id", "baselayerListDropdown")
      .attr("class", "layerListDropdown")
      .on("mouseleave", function() { 
        d3.select(this)
          .style("display", "none") 
        });
    
    // console.log(layerNames.baseLayers.keys,layerNames.baseLayers.values, "es mappy")
    let layerCheck = this.layerCheck
    if(layerCheck && layerCheck===true){
      console.log('layercheck:true')
      mappy.addLayer(this.hy)
    }
    layerCheck = false
    d3.select("#baselayerListDropdown").selectAll("div")
    .data(layerNames.baseLayers.keys)
    .enter()
      .append("div")
      .attr("class", "layerName")
      .text((d:any)=> { return d; })
      .property("value", (d,i)=>{ return i; })
      .property("title", function(d) { return d; })
      .on("click", function() { changeBaselayer(this); })
      .append("span")
      .attr("class", "fas fa-check fa-pull-right activeOverlay")
      .style("visibility", function(d,i) { if(i == 1) {return "visible";} else {return "hidden";} });
      if(layerCheck!==true){
        console.log('layercheck:false')
        mappy.addLayer(this.hy)
      }
      
      function changeBaselayer(tmpDiv) {
        //***Remove old layer
        let layerDivs:any = d3.select("#baselayerListDropdown").selectAll("div");
        // mappy.addLayer(hylayer)
        layerDivs.nodes().forEach(function(tmpLayer) {
          // layerVar = false
          
          if(d3.select(tmpLayer).select("span").style("visibility") == "visible") {
            d3.select(tmpLayer).select("span").style("visibility", "hidden");
            mappy.removeLayer(layerNames.baseLayers.values[d3.select(tmpLayer).property("value")]);
          }
        });
    
        //***Add new layer
        d3.select(tmpDiv).select("span").style("visibility", "visible");
        mappy.addLayer(layerNames.baseLayers.values[tmpDiv.value]);
        layerNames.baseLayers.values[tmpDiv.value].bringToFront();       
      }
      ///////////////////////////////
    d3.select("leaflet-sidebar-content")
    .insert("div", ": first-child")
    .attr("id", "drawingDiv")
      /////////////////////////////////
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
    


    /*Overlay changing function: needs to add legend div somewhere*/
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
      //******Set z-indexes of moveable divs so that clicked one is always on top
    d3.selectAll("#legendDiv,#infoDiv,#locateDiv,#filterDiv,#pointDiv,#downloadDiv")
      .on("mousedown", function() { setZ(this); });


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
      setZ(d3.select(`#${tmpDiv}Div`).node()[0]);
    }
  }
  function setZ(tmpWin) {
    if (d3.select("#map")) {
      d3.selectAll("#legendDiv,#infoDiv,#locateDiv,#filterDiv,#pointDiv,#downloadDiv")
        .style("z-index", function() { 
          if(d3.select(this).style("opacity") == '1') {
            return 1001;
          } else {
            return 7500;
          }
        }); 
      d3.select(tmpWin).style("z-index", 1002);
    }
  }

  //******Adjust div position to ensure that it isn't overflowing window
function resizePanels() {
  let mapRect = document.getElementById("container").getBoundingClientRect()
  // var bodyRect = document.body.getBoundingClientRect();
  var tmpWindows = ["infoDiv", "legendDiv"];
        
  tmpWindows.forEach(function(win) {
    var winRect = document.getElementById(win).getBoundingClientRect();
    if(winRect.bottom > mapRect.bottom) {
      d3.select("#" + win).style("top", mapRect.height - winRect.height + "px");
    }
    if(winRect.right > mapRect.right) {
      d3.select("#" + win).style("left", mapRect.width - winRect.width + "px");
    }
  });
  d3.select("#legendImgDiv").style("min-width", "0px").style("width", "auto");
  var legRect = document.getElementById("legendImgDiv").getBoundingClientRect();
  d3.select("#legendImgDiv").style("min-width", legRect.width + "px");
}


     //******Make div for legend
     
    //  let newDiv = this.renderer.createElement('div')

    //  this.renderer.addClass(newDiv,'legend')
    //  this.renderer.addClass(newDiv,'gradDown')
    //  this.renderer.setAttribute(newDiv,'id','legendDiv')
    //  this.renderer.appendChild(this.test2Div.nativeElement, newDiv)
     
    //  this.renderer.appendChild(this.el.nativeElement, newDiv)
 d3.select("#container")
  .append("div")
  .attr("class", "legend gradDown")
  .attr("id", "legendDiv")
  
  
  $('#legendDiv').draggable({containment: "parent", cancel: ".toggle-group,.layerLegend,textarea,button,select,option"});

  d3.select("#legendDiv")
    .append("h4")
    .text("Legend")
    .attr("class", "legTitle")
    .attr("id", "legendTitle")
    .append("span")
    .html('<span class="fas fa-info-circle" data-toggle="tooltip" data-container="body" data-placement="auto" data-html="true" title="<p><u><b>Legend</b></u></p><p>Displays legends for added map layers enabling their interpretation along with control over their transparency.<br><br>Drag and drop layers to change their order on the map.</p>"</span>');

  d3.select("#legendTitle")
    .html(d3.select("#legendTitle").html() + '<div class="exitDiv"><span id="hideLegend" class="fas fa-times-circle" data-toggle="tooltip" data-container="body" data-placement="auto" data-html="true" title="<p>Click to hide window</p>"</span></div>'); 

  d3.select("#hideLegend")
    .on("click", function() {
       toolWindowToggle("legend"); 
       
      });

  d3.select("#legendDiv")
    .append("div")
    .attr("id", "legendDefault")
    .text("Add a map layer to view its legend...");

  d3.select("#legendDiv")
    .append("div")
    .attr("id", "legendImgDiv");

    $("#legendImgDiv").sortable({appendTo: "#legendImgDiv", containment: "#legendImgDiv", cancel: "input,textarea,button,select,option", forcePlaceholderSize: true, placeholder: "sortable-placeholder", helper: "original", tolerance: "pointer", stop: function(event, ui) { reorder(event, ui); }, start: function(event, ui) { helperPlaceholder(event, ui); }});
      //******Change the layer orders after drag and drop
  let infoObj = this.infoObj
  function reorder(tmpEvent, tmpUI) {
    let tmpCnt = tmpEvent.target.children.length;
    let i = 0
    
    for (let child of tmpEvent.target.children) {
      overlays[infoObj[child.id.slice(0,-6)]].setZIndex(tmpCnt - i);
      i += 1;
    }
   }
   //******Style the helper and placeholder when dragging/sorting
   function helperPlaceholder(tmpEvent, tmpUI) {
    d3.select(".ui-sortable-placeholder.sortable-placeholder")
      .style("width", d3.select("#" + tmpUI.item[0].id).style("width"))
      .style("height", "37px");  //.style("background", "rgba(255,255,255,0.25)"); 
    }





    function addLegendImg(tmpName, tmpTitle, tmpLayer, tmpPath) {
      // this.tmpName = tmpName
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
        .on("click", 
          function() { changeCaret(d3.select(this).select("span").node()[0]); 
         })
        .append("div")
        .attr("class", "legendTitle")
        .html('<h6>' + tmpTitle + '</h6><div class="exitDiv"><span class="fas fa-caret-down legendCollapse" title="View legend"></span></div>');
  
  
      function changeCaret(tmpSpan) {
        if(d3.select(tmpSpan).classed("fa-caret-down", true)) {
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
        // var tmpRect = document.getElementById(tmpName + "LegendImg").getBoundingClientRect();
        // console.log(tmpRect)
        // d3.select("#" + tmpName + "LegImgDiv").style("max-height",`${tmpRect.height-67}px`);
        // d3.select("#" + tmpName + "LegImgDiv").style("max-width", `${tmpRect.width}px`);
        d3.select("#" + tmpName + "Legend").style("opacity", "1");     
        }).attr("src", "https://new.landscapedatacommons.org/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=30&HEIGHT=30&LAYER=ldc2:" + tmpName);
      
      d3.select("#" + tmpName + "collapseDiv")
        .append("div")
        .attr("id", tmpName + "LegendSlider")
        .property("title", tmpTitle + " Layer Opacity: " + tmpOpa * 100 + "%");
  
      $("#" + tmpName + "LegendSlider").slider({animate: "fast", min: 0, max: 100, value: tmpOpa * 100, slide: function(event, ui) { layerOpacity(ui, tmpLayer); } });
  
      d3.select("#legendDefault").style("display", "none");
  
      d3.select("#legendImgDiv")
        .style("display", "block");
  
        if(d3.select("#legendDiv").style("opacity") == '0') {
          toolWindowToggle("legend");
        }
  
      resizePanels();
    }

    function remLegendImg(tmpName) {
      d3.select("#" + tmpName + "Legend").remove();
  
      if(d3.select("#legendImgDiv").selectAll("div").nodes().length == 0) {
        d3.select("#legendImgDiv").style("display", "none");
        d3.select("#legendDefault").style("display", "block");
      }
    }

    //******Change transparency of current legend layer
  function layerOpacity(tmpSlider, tmpLayer) {
    var tmpOpacity = tmpSlider.value/100; 
    tmpSlider.title = "Opacity: " + tmpSlider.value + "%"; 
    tmpLayer.setOpacity(tmpOpacity);
  }

   //******Make div for info
  d3.select("#map")
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
    .html('<span class="fas fa-info-circle" data-toggle="tooltip" data-container="body" data-placement="auto" data-html="true" title="<p><u><b>Identify</b></u></p><p>Displays attribute value for visible overlay layers for a clicked point on the map</p>"</span>');
 
  d3.select("#infoTitle")
    .html(d3.select("#infoTitle").html() + '<div class="exitDiv"><span id="hideInfo" class="fas fa-times-circle" data-toggle="tooltip" data-container="body" data-placement="auto" data-html="true" title="<p>Click to hide window</p>"</span></div>'); 

  d3.select("#hideInfo")
    .on("click", function() { toolWindowToggle("info"); });

  d3.select("#infoDiv")
    .append("div")
    .attr("id", "info");


  }

  ngAfterViewChecked(){

  }
  
  private initMap(){
   
    this.mymap = L.map('map', {
      maxZoom: 15,
      // inertiaDeceleration: 1000,
      attributionControl: false,
      worldCopyJump: true,
      center:[32.344147, -106.758442],
      zoom: 10,
      minZoom:5,
      zoomControl:false,
      preferCanvas:true,
      /* initial layer */
      layers:[this.sat]
    });
    /* invalidate size debouncemoveend 
       adds a timeout on every moveend-event refetch */

    this.mymap.on('draw:created',(e)=>{
      // clear topos before drawing
      if(this.moveSubs && !this.moveSubs.closed){
        // this.markerLayer.clearLayers()
        this.moveSubs.unsubscribe()
      }
      /*if layer with points exists, clear and create; else create 
      only handles drawing when its the first thing the user does, 
      before loading any other points.

      
      DRAWING HNDLER NEEDS TO BE A SERVICE
      
      */

      if(this.markerLayer){
      this.markerLayer.clearLayers()
      let type = e.layerType,
      layer = e.layer;
      this.drawnItems.addLayer(layer)
      console.log(this.drawnItems)
      let drawingbb = this.drawnItems.toGeoJSON().features[0].geometry.coordinates[0]
      this.moveEnd.coordsArray(drawingbb)
      if(this.moveEnd.coords!==''){
        let param = {}
          console.log(this.moveEnd.coords, 'vacio')
          this.socket.emit('drawing', this.moveEnd.coords)
          this.moveSubs = this.socket.listen('pointssend')
            .subscribe((data:GeoJsonObject)=>{
              this.resultOutput = ''
              //marker service goes here, which:
              // a. creates a layer full of markers from geojson
              // b. stores layer in the markers property within the service
              
              this.markers.createMarkers(data)
              this.markerLayer = this.markers.markers
              this.markerLayer.addTo(this.mymap)
              this.resultOutput = data['features'].length
          })
      }
      } else {
      // this.mymap.removeLayer(this.markerLayer)
      let type = e.layerType,
      layer = e.layer;
      this.drawnItems.addLayer(layer)
      let drawingbb = this.drawnItems.toGeoJSON().features[0].geometry.coordinates[0]
      this.moveEnd.coordsArray(drawingbb)
      if(this.moveEnd.coords!==''){
          console.log(this.moveEnd.coords)
          /* turf debugging: need points of polygon */
          this.socket.emit('drawing', this.moveEnd.coords)
          this.moveSubs = this.socket.listen('pointssend')
            .subscribe((data:GeoJsonObject)=>{
              this.resultOutput = ''
              //marker service goes here, which:
              // a. creates a layer full of markers from geojson
              // b. stores layer in the markers property within the service
              this.markers.createMarkers(data)
              this.markerLayer = this.markers.markers
              this.markerLayer.addTo(this.mymap)
              this.resultOutput = data['features'].length
              
              // console.log(data['features'].length)
          })
      }
    }
    })
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
          // console.log(this.markerLayer, "undefined!!!")
        }
        if(this.moveEnd.topos){
          
          let param = {}
          param["one"] = 1
          this.moveEnd.topos.params = param
          this.socket.emit('fetchpoints', this.moveEnd.topos)
          this.moveSubs = this.socket.listen('pointssend')
            .subscribe((data:GeoJsonObject)=>{
              this.resultOutput = ''
              //marker service goes here, which:
              // a. creates a layer full of markers from geojson
              // b. stores layer in the markers property within the service
              this.markers.createMarkers(data)
              this.markerLayer = this.markers.markers
              this.markerLayer.addTo(this.mymap)
              this.resultOutput = data['features'].length
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
          // console.log(this.markerLayer, "undefined!!! above 9")
        }
        console.log('below nine')
      }
    })

    

    
  }
  // returnMap(event){
  //  console.log(event)
  //  if(event='map'){
  //   //  this.initMap()
  //  }
  // }

  ngOnDestroy(){
    if(this.moveSubs){
      this.moveSubs.unsubscribe()
    }
    
    this.eventSubject.unsubscribe()
  }

}
