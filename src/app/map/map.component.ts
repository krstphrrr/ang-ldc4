
import { Component, OnInit, AfterViewInit, AfterViewChecked, ViewChild, ElementRef, Renderer2, QueryList, ContentChildren, EventEmitter } from '@angular/core';
import * as L from 'leaflet'
// declare const L:any 
import 'leaflet'
import 'leaflet-easybutton'
import {Map, latLng, Canvas, MapOptions, LeafletEvent, TileLayer} from 'leaflet'
// import  '../../plugins/L.Control.Sidebar.js'
import { ThemePalette } from '@angular/material/core'
import 'leaflet-sidebar-v2'
import { MarkerService } from '../services/marker.service'
// import * as $ from 'jquery';
declare var $: any;
// import {sidebar} from '../../plugins/L.Control.Sidebar.js'
import { Subscription } from 'rxjs'
import { debounceTime, scan, map } from 'rxjs/operators';
import * as d3 from 'd3'
import { socketDataService } from '../services/socketTest.service'
import { wmsService } from '../services/wms.service'

import 'leaflet-draw'
import FreeDraw, {CREATE,EDIT,DELETE, ALL} from 'leaflet-freedraw'
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
      /*
      Constructor subscriptions:
      - baselayer subs: keeps track of changes in baselayer dropdown
      - overlay subs: keeps track of changes in overlay dropdown
      
      */
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

   /* LIFECYCLE HOOKS FOR MAP COMPONENT
   1. ngOnInit
   2. ngAfterViewInit
   3. 

   */
  ngOnInit(){
    /* at initializing page:
    1. set bounding box for map
    2. set default extent
    3. set initial google map tile
    4. get tiles from geoserver (async so pulling them early)
    5. initialize map
    */
    //1.
    let southwest = L.latLng([51.0156176,-69.393794])
    let northeast = L.latLng([27.213765,-131.539653])
    //2.
    this.defaultExtent = L.latLngBounds(southwest,northeast)
    
    this.extentCoords = this.defaultExtent
    //3.
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
    //4.
    this.initMap(this.initLay)

    this.dragTracker = this.wms.getCloseSignal().subscribe((closeSignal:CloseSignal)=>{
      // if(closeSignal.close===true){
      //   this.dragger = false
      // }
      this.draggerClose()
      console.log(closeSignal)
    })


  }

  ngAfterViewInit(){

    /* after the view initializes:
    1. on leaflet map load, add geoserver tile with dataheader points (static)
    2. clears project data for sidebar table ('projects')
    3. clears points currently displayed by finding any point on the layer with a radius of 5 and removing it. 
    4. re-adds all the points from the layer
    5. adds sidebar
    */

    this.mymap.on('load', this.onMapLoad_TEST())
    this.mymap.on('draw:deleted',()=>{
      //  console.log(this.projects)

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
    
    this.drawingControl(this.mymap)

    

  }

  ngAfterViewChecked(){
  }

  ngOnDestroy(){
    if(this.movementSubscription){
      this.movementSubscription.unsubscribe()
    }
  }
  
  /* HELPER FUNCTIONS IN THE ORDER IN WHICH THEY ARE USED (throughout the lifecycle hooks)
  1. getLayers - 
  2. initMap - 
  3. draggerClose
  4. drawingControl
  
  */

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

  private initMap(initLayer:L.TileLayer=null){
    /* 
    1. INITIALIZE MAP
    2. MAP EVENT HANDLERS
    
    */
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

   this.mymap.on('draw:created',(e)=>{
        
        // clear data on map movement
        this.projects = []
        this.dataBus.changeData(this.projects)

        //prep default baselayer (blue datapoints wms layer on init)
        //if the blue points currently visible, removethem
        //if selection rectangle currently visible, remove it
        this.mymap.eachLayer((layer)=>{
          if(layer===this.allPoints){
            this.mymap.removeLayer(layer)
          }
          if(layer===this.rect){
            layer.remove()
          }
        })
        // if there are actual result points on map, do all of this
        if(this.markerLayer){
          // remove old layer
          this.mymap.eachLayer((layer)=>{
            // haha finding which layer has points with a radius of 5
            if(layer._radius===5){
              this.mymap.removeLayer(layer)
            }
          })
          
          let type = e.layerType
          let layer = e.layer
          this.drawnItems.addLayer(layer)
          // console.log(this.drawnItems)
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
          console.log(e)
          this.mymap.eachLayer((layer)=>{
            if(layer._radius===5){
              this.mymap.removeLayer(layer)
            }
          })
          let type = e.layerType
          let layer = e.layer
          console.log(this.drawnItems)
          this.drawnItems.addLayer(layer)
          let drawingBoundingBox = this.drawnItems.toGeoJSON().features[0].geometry.coordinates[0]
          console.log(drawingBoundingBox)
          this.moveEnd.coordsArray(drawingBoundingBox)
          
          if(this.moveEnd.coords!==''){
              // console.log(this.moveEnd.coords)
              /* turf debugging: need points of polygon */
              this.socket.emit('drawing', this.moveEnd.coords)
              this.movementSubscription = this.socket.listen('pointssend')
                .subscribe((data:GeoJsonObject)=>{
                  console.log(data)
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
              console.log(this.projects)
              console.log(this.resultOutput)
              })
          }
      }

  })

    this.allPoints=L.featureGroup()

    
    /* invalidate size debouncemoveend 
       adds a timeout on every moveend-event refetch */
    // this map.on(event, SERVICE.METHOD(EVENT))
    
    
    
    this.mymap.on('movestart', event=>{
      // let bbox = this.mymap.getBounds()
      // let center = this.mymap.getCenter()
      // let zoomE = this.mymap.getZoom()
      // console.log(event)
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



  draggerClose(){
    if(this.dragger==true){
      this.dragger=false
    }
  }
  
  
  // this.newControl.include({
  //   Events:{
  //     CLICK:"click"
  //   }
  // })



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
          console.log(data)
          
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
            console.log(this.projects)
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
  

  

  popupTable(){
    if(this.dragger==false){
      this.dragger = true
    } else {
      this.dragger= false
    }
    console.log('funciona')
  }

}
