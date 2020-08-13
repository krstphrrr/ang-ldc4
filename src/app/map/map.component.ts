
import { Component, OnInit, AfterViewInit, AfterViewChecked, ViewChild, ElementRef, Renderer2, QueryList, ContentChildren } from '@angular/core';
import * as L from 'leaflet'
import {Map, latLng, Canvas, MapOptions, LeafletEvent, TileLayer} from 'leaflet'
// import  '../../plugins/L.Control.Sidebar.js'
import { ThemePalette } from '@angular/material/core'
import 'leaflet-sidebar-v2'
import { MarkerService } from '../services/marker.service'
// import * as $ from 'jquery';
declare var $: any;
// import {sidebar} from '../../plugins/L.Control.Sidebar.js'
import { Subscription } from 'rxjs'
import { debounceTime, scan } from 'rxjs/operators';
import * as d3 from 'd3'
import { socketDataService } from '../services/socketTest.service'
import { wmsService } from '../services/wms.service'

import 'leaflet-draw'
import { GeoJsonObject } from 'geojson';
import { PanelComponent } from './controls/panel/panel/panel.component';
import { MoveEndService } from '../services/move-end.service'
import { CustomControlService } from '../services/custom-control.service'
import * as turf from '@turf/turf'
import {LayerService} from '../services/layer.service'
import { MapLoadService } from '../services/mapLoad.service'
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SummaryTableComponent } from './summary-table/summary-table.component'
import { DragpopComponent } from './dragpop/dragpop.component'
// interface Project {
//   project: string;
//   length: string;
// }


interface CloseSignal{
  close:boolean
}


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: [
    './map.component.css']
})

export class MapComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ContentChildren( DragpopComponent, { descendants: true } ) dragHandles: QueryList<DragpopComponent>;
  
  @ViewChild('container') 
  private test2Div: ElementRef;
  @ViewChild('pane_container') 
  private paneDiv: ElementRef;
  // private mymap;
  public color: ThemePalette = "accent";
  public checked = false;
  public mymap
  public ctlSidebar;
  public initLayers;

  public isCollapsed = false;
  public mrkr=false;
  public markerLayer
  public tmpPoints;
  public movementSubscription;
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
  public layerList;
  public initLay;
  public layerCheck;
  public resultOutput;

  public allPoints;
  public isLocked;
  public extentCoords;
  public defaultExtent;
  public rect;
  public projects = []; 
  public aim_proj = {};
  public lmf_proj = {};
  public dragger = false;
  public baselayerSubscription:Subscription;
  public overlaySubscription:Subscription;
  message:string
  public dragTracker:Subscription;

  constructor(
    private el:ElementRef,
    private renderer: Renderer2,
    private markers: MarkerService,
    private socket: socketDataService,
    private wms: wmsService,
    private layerServ: LayerService,
    private moveEnd: MoveEndService,
    private mapLoad: MapLoadService,
    private dataBus: CustomControlService

    ) {
      this.baselayerSubscription = this.wms.getBaselayer().subscribe(dropdownOption=>{
        this.applyBaselayer(dropdownOption.data.value)
      })
      this.overlaySubscription = this.wms.getOverlaylayer().subscribe(dropdownOption=>{
        /* when subscription receives change, 
        1. enable draggable popup (this.dragger = true)
        2. 
         */
        // console.log(this.dragger)
        if(this.dragger==false){
          //sending initial value to child component 
          this.message = dropdownOption.overlay.value
          

          this.dragger=true
        }
        // console.log(`from dropdown to map. you chose: ${dropdownOption.overlay.value}`)
      })

     }

  draggerClose(){
    if(this.dragger==true){
      this.dragger=false
    }
  }
    

  ngOnInit() {
    /* at initializing page:
    1. set bounding box for map
    2. set default extent
    3. set initial google map tile
    4. get tiles from geoserver (async so pulling them early)
    5. initialize map
    */
    let southwest = L.latLng([51.0156176,-69.393794])
    let northeast = L.latLng([27.213765,-131.539653])
    this.defaultExtent = L.latLngBounds(southwest,northeast)
    
    this.extentCoords = this.defaultExtent
    this.initLay = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3']
    }); 
    this.getLayers2('sat')
    this.getLayers2('st')
    this.getLayers2('terr')
    this.getLayers2('hy')
    this.layerList = {
      'hy':this.hy,
      'terr':this.terr,
      'st':this.st,
      'sat':this.sat,
      'ini':this.initLay,
      [Symbol.iterator]:function*(){
        let properties = Object.keys(this);
        for (let i of properties){
          yield [i, this[i]];
        }
      }
    }
    this.layerCheck = this.layerServ.layer
    this.initMap(this.initLay)

    this.dragTracker = this.wms.getCloseSignal().subscribe((closeSignal:CloseSignal)=>{
      // if(closeSignal.close===true){
      //   this.dragger = false
      // }
      this.draggerClose()
      console.log(closeSignal)
    })
    

  }

  onMapLoad_TEST(){
    /*
    this method
    1. gets the static tile served by geoserver showing all the points currently on the dataHeader table
    2. adds it as a layer on the main leaflet map
    3. brings it to the forefront
     */
    this.allPoints = L.tileLayer.wms('https://landscapedatacommons.org/geoserver/wms?tiled=true', {
      layers: 'ldc3:dataHeader',
      format: 'image/png',
      transparent: true,
      // tiled: true,
      version: '1.3.0',
      maxZoom: 20
    });
  
    this.mymap.addLayer(this.allPoints)
    this.mymap.eachLayer((layer)=>{
      if(layer===this.allPoints){
        layer.bringToFront()
      }
    })
    
//     this.moveEnd.boundsUtil(this.extentCoords)
//     let param = {}
//     param['public'] = true
//     this.moveEnd.topos.param = param
//     this.socket.emit('fetchpublic2', this.moveEnd.topos)
//     this.movementSubscription = this.socket.listen('pointssend')
//       .subscribe((data:GeoJsonObject)=>{
        
//         this.markers.createMarkers(data)
//         this.markerLayer = this.markers.markers
//         this.markerLayer.addTo(this.mymap)
//           console.log(data)
//           /// need to extract features for table
//           /// histogram? 
//           /// can udf's in sql have unlimited number of 
//           /// arguments?
//         this.resultOutput = data['features'].length
//       })
  }
  applyBaselayer(choice){
    /* once the a choice has been made on the baselayer dropdown 
    subscription, it is detected and this method fires.
    it takes in a dropdown choice and in turn 
    fires another method that removes all other layers while adding
    the chosen one. 
     */
    switch(choice){
      case 'Google Hybrid':
        this.removeOtherBaselayers('hy')
        break;
      case 'Google Terrain':
        this.removeOtherBaselayers('terr')
        break;
      case 'Google Street':
        this.removeOtherBaselayers('st')
        break;
      case 'Google Satellite':
        this.removeOtherBaselayers('sat')
        break;
    }
  }
  removeOtherBaselayers(selectedBase){
    // removes all layers except chosen one
    for(let option of this.layerList){
      if(option[0]!==selectedBase){
        this.mymap.removeLayer(option[1])
      }
    }
    this.mymap.addLayer(this.layerList[selectedBase])
  }



  ngAfterViewInit():void{

    /* after the view initializes:
    1. on leaflet map load, add geoserver tile with dataheader points (static)
    2. clears project data for sidebar table ('projects')
    3. clears points currently displayed by finding any point on the layer with a radius of 5 and removing it. 
    4. re-adds all the points from the layer
    5. adds sidebar
    */

     this.mymap.on('load', this.onMapLoad_TEST())
     this.mymap.on('draw:deleted',()=>{
       console.log(this.projects)
      this.projects = []
      this.dataBus.changeData(this.projects)
      
      this.mymap.eachLayer((layer)=>{
        if(layer._radius===5){
         this.mymap.removeLayer(layer)
         
        }
      })
      this.mymap.addLayer(this.allPoints)
     })
     
    
    
    this.ctlSidebar = L.control.sidebar({
      autopan:true,
      closeButton:true,
      container:'sidebar',
      position:'left'
    })
     .addTo(this.mymap)

     //
     /*
     1. adds drawing controls.
     2. sets dropdown options
     */
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

    //soon to be deprecated: d3 dom manipulation
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
    .attr("class", "fas fa-check pull-right activeOverlay")
    .style("visibility", "hidden"); //function(d) { if(d == "US States") { map.addLayer(states); return "visible"; } else { return "hidden"; } });
    

     let allPoints = this.allPoints
    /*Overlay changing function: needs to add legend div somewhere*/
    function changeOverlay(tmpDiv) {
      if(d3.select(tmpDiv).select("span").style("visibility") == "hidden") {
        d3.select(tmpDiv).select("span").style("visibility", "visible");
        mappy.addLayer(layerNames.overlays.values[tmpDiv.value]);
        // check4Json();
        layerNames.overlays.values[tmpDiv.value].bringToFront();
        
        allPoints.bringToFront()
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



      d3.select("#pane_container")
    .append("div")
    .attr("class", "filter_array")
    .attr("id", "filters")
    .html()

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
          function() { changeCaret((d3.select(this).select("span").node())); 
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
        }).attr("src", "https://landscapedatacommons.org/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=30&HEIGHT=30&LAYER=ldc2:" + tmpName);
      
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

  toggle(event:MatSlideToggleChange){
    if(this.movementSubscription){
      this.movementSubscription.unsubscribe()
    }
    this.mymap.eachLayer((layer)=>{
      if(layer===this.allPoints){
        this.mymap.removeLayer(layer)
       }
     })
     this.mymap.eachLayer((layer)=>{
      if(layer._radius===5){
        this.mymap.removeLayer(layer)
      }
    })
     
    if(event.checked===true){
      this.projects = []
      this.dataBus.changeData(this.projects)
      console.log('bring publics')

      this.mymap.removeLayer(this.allPoints)
      this.moveEnd.boundsUtil(this.extentCoords)
      let param = {}
      param['public'] = true
      this.moveEnd.topos.param = param
      this.socket.emit('fetchpublic2', this.moveEnd.topos)
      this.movementSubscription = this.socket.listen('pointssend')
        .subscribe((data:GeoJsonObject)=>{
          
          this.markers.createMarkers(data)
          this.markerLayer = this.markers.markers
          this.markerLayer.addTo(this.mymap)
          let set_proj = new Set()
          // let projects = []
          // let aim_proj = {}
          // let lmf_proj = {}

            // console.log(data["features"].filter(item=>item.properties.Project==='AIM').length, "DATA")
            
            // console.log(data["features"].filter(item=>item.properties.Project==='LMF').length, "DATA")
            console.log(this.projects, "antes")
            if(data["features"].filter(item=>item.properties.Project==='AIM').length!==0){
              this.aim_proj["project"] = "AIM"
              this.aim_proj["length"] = data["features"].filter(item=>item.properties.Project==='AIM').length
              this.projects.push(this.aim_proj)
              
            }
            if(data["features"].filter(item=>item.properties.Project==='LMF').length!==0){
              this.lmf_proj["project"] = "LMF"
              this.lmf_proj["length"] = data["features"].filter(item=>item.properties.Project==='LMF').length
              this.projects.push(this.lmf_proj)
            }
            this.dataBus.changeData(this.projects)

            
            // create objects for each proj: {'aim': total} , this obj will then be used to create summary table on the fly
            
            // data["features"].reduce((c,{Project: key})=> (c['properties][key]||0)+1,c['properties'])
          //   for(let i in data['features']){
          //     let each_feature = data['features'][i].properties
              
          //     // console.log()
          //     if(set_proj.has(each_feature['Project'])){
             
          //   } else {
          //     set_proj.add(each_feature["Project"])
              
          //   }
          // }
          //   console.log(set_proj, "SET")
            /// need to extract features for table
            /// histogram? 
            /// can udf's in sql have unlimited number of 
            /// arguments?
          this.resultOutput = data['features'].length
        })
      
    } else {
      this.projects = []
      this.dataBus.changeData(this.projects)
      console.log('no publics')
      
      this.mymap.removeLayer(this.allPoints)
      this.moveEnd.boundsUtil(this.extentCoords)
      let param = {}
      param['public'] = false
      this.moveEnd.topos.param = param
      this.socket.emit('fetchpublic2', this.moveEnd.topos)
      this.movementSubscription = this.socket.listen('pointssend')
        .subscribe((data:GeoJsonObject)=>{
          
          this.markers.createMarkers(data)
          this.markerLayer = this.markers.markers
          this.markerLayer.addTo(this.mymap)
          
            if(data["features"].filter(item=>item.properties.Project==='AIM').length!==0){
              this.aim_proj["project"] = "AIM"
              this.aim_proj["length"] = data["features"].filter(item=>item.properties.Project==='AIM').length
              this.projects.push(this.aim_proj)
              
            }
            if(data["features"].filter(item=>item.properties.Project==='LMF').length!==0){
              this.lmf_proj["project"] = "LMF"
              this.lmf_proj["length"] = data["features"].filter(item=>item.properties.Project==='LMF').length
              this.projects.push(this.lmf_proj)
            }
            this.dataBus.changeData(this.projects)
          this.resultOutput = data['features'].length
        })
    }
  }
  lockExtent(event:MatCheckboxChange){
    
    // if checkbox = checked => getbounds and store them
    if(event.checked===true){
      
      this.extentCoords = this.mymap.getBounds()
      this.rect = L.rectangle(this.extentCoords, {
        color: "#FF5733",
        fillOpacity:0, 
        weight: 5})
      this.rect.addTo(this.mymap)
      console.log('current bounds locked at: ',this.extentCoords.toBBoxString())
      
    } else {

      this.extentCoords = this.defaultExtent
      console.log(this.rect, "RECTANGLE LAYER")
      this.mymap.eachLayer((layer)=>{
        if(layer===this.rect){
          layer.remove()
        }
        })
      console.log('extent returned to: ',this.extentCoords.toBBoxString())
    }
  }
  
  private initMap(initLayer:L.TileLayer=null){
    this.allPoints=L.featureGroup()
    this.mymap = L.map('map', {
      maxZoom: 15,
      inertiaDeceleration: 10000,
      attributionControl: false,
      worldCopyJump: true,
      center:[41.14269416, -108.721814],
      zoom: 5.7,
      zoomDelta:10,
      zoomSnap:0,
      minZoom:5,
      zoomControl:false,
      preferCanvas:true,
      /* initial layer */
      layers:[(initLayer?initLayer:this.sat)]
    })
    /* invalidate size debouncemoveend 
       adds a timeout on every moveend-event refetch */
    // this map.on(event, SERVICE.METHOD(EVENT))
    
    this.mymap.on('draw:created',(e)=>{
      this.projects = []
      this.dataBus.changeData(this.projects)

      this.mymap.eachLayer((layer)=>{
      if(layer===this.allPoints){
        this.mymap.removeLayer(layer)
       }
       if(layer===this.rect){
        layer.remove()
      }
      
     })
     
      // clear topos before drawing
      if(this.movementSubscription && !this.movementSubscription.closed){
        // this.markerLayer.clearLayers()
        this.movementSubscription.unsubscribe()
      }
      /*if layer with points exists, clear and create; else create 
      only handles drawing when its the first thing the user does, 
      before loading any other points.

      
      DRAWING HNDLER NEEDS TO BE A SERVICE
      
      */

      if(this.markerLayer){
      // remove old layer
      this.mymap.eachLayer((layer)=>{
        if(layer._radius===5){
          this.mymap.removeLayer(layer)
        }
      })
      
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
          this.movementSubscription = this.socket.listen('pointssend')
            .subscribe((data:GeoJsonObject)=>{
              this.markers.createMarkers(data)
          this.markerLayer = this.markers.markers
          this.markerLayer.addTo(this.mymap)
          
            if(data["features"].filter(item=>item.properties.Project==='AIM').length!==0){
              this.aim_proj["project"] = "AIM"
              this.aim_proj["length"] = data["features"].filter(item=>item.properties.Project==='AIM').length
              this.projects.push(this.aim_proj)
              
            }
            if(data["features"].filter(item=>item.properties.Project==='LMF').length!==0){
              this.lmf_proj["project"] = "LMF"
              this.lmf_proj["length"] = data["features"].filter(item=>item.properties.Project==='LMF').length
              this.projects.push(this.lmf_proj)
            }
            this.dataBus.changeData(this.projects)
          this.resultOutput = data['features'].length
          
              
          })
      }
      } else {
      // this.mymap.removeLayer(this.markerLayer)
      this.mymap.eachLayer((layer)=>{
        if(layer._radius===5){
          this.mymap.removeLayer(layer)
        }
      })
      let type = e.layerType,
      layer = e.layer;
      this.drawnItems.addLayer(layer)
      let drawingbb = this.drawnItems.toGeoJSON().features[0].geometry.coordinates[0]
      this.moveEnd.coordsArray(drawingbb)
      if(this.moveEnd.coords!==''){
          console.log(this.moveEnd.coords)
          /* turf debugging: need points of polygon */
          this.socket.emit('drawing', this.moveEnd.coords)
          this.movementSubscription = this.socket.listen('pointssend')
            .subscribe((data:GeoJsonObject)=>{
              this.markers.createMarkers(data)
          this.markerLayer = this.markers.markers
          this.markerLayer.addTo(this.mymap)
          
            if(data["features"].filter(item=>item.properties.Project==='AIM').length!==0){
              this.aim_proj["project"] = "AIM"
              this.aim_proj["length"] = data["features"].filter(item=>item.properties.Project==='AIM').length
              this.projects.push(this.aim_proj)
              
            }
            if(data["features"].filter(item=>item.properties.Project==='LMF').length!==0){
              this.lmf_proj["project"] = "LMF"
              this.lmf_proj["length"] = data["features"].filter(item=>item.properties.Project==='LMF').length
              this.projects.push(this.lmf_proj)
            }
            this.dataBus.changeData(this.projects)
          this.resultOutput = data['features'].length
          })
      }
    }

    })
    
    this.mymap.on('movestart', event=>{
      // let bbox = this.mymap.getBounds()
      // let center = this.mymap.getCenter()
      // let zoomE = this.mymap.getZoom()
      // console.log(bbox)
    })



    // this.mymap.on('movestart', event=>{

    //     let bbox = this.mymap.getBounds()
    //     this.moveEnd.boundsUtil(bbox)
    //     this.socket.emit('fetchpoints', this.moveEnd.topos)
    //     this.movementSubscription = this.socket.listen('pointssend')
    //       .subscribe((data:GeoJsonObject)=>{
    //         this.resultOutput = ''
    //         this.resultOutput = data['features'].length
    //       })
          
        
    //   })

    
  }

  ngOnDestroy(){
    if(this.movementSubscription){
      this.movementSubscription.unsubscribe()
    }
    

  }

  popupTable(){
    if(this.dragger==false){
      this.dragger = true
    } else {
      this.dragger= false
    }
    console.log('funciona')
  }

}
