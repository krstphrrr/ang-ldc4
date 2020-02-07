import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import * as L from 'leaflet'
// import { MapIconOptions } from './data/map-icon'
import { MarkerService } from './marker.service'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { reduce } from 'rxjs/operators';
import * as d3 from 'd3'
import { socketDataService } from '../learn/socketTest.service'
import * as PIXI from 'pixi.js'
import 'leaflet-pixi-overlay'
import {pixiOverlay} from 'leaflet'
import {IGeoJson} from './models/geojsonint.model'



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
  
  
  


  constructor(
    private markers:MarkerService,
    private socket: socketDataService
    ) {
      
     }

  ngOnInit() {
    // console.log('ngOnInit')
    // // console.log(this.markers.markers)
    // this.markers.onFetchPoints()
    // console.log(this.markers.markers)
  }


  ngAfterViewInit():void{
    console.log('ngAfterViewInit')
    this.initMap()
    // this.showMarkers()
    this.markers.onFetchPoints(this.mymap, 'data')
    
  }

  ngAfterViewChecked():void {
    
  }


  private initMap(): void {
    // let topoSVG = d3
    //   .select(this.mymap.getPanes().overlayPane)
    //   .append("svg")
    //   .attr("id", "topoSVG")
    
    this.mymap = L.map('map', {
      // minZoom: 3,
      maxZoom: 15,
      inertiaDeceleration: 1000,
      attributionControl: false,
      worldCopyJump: true,
      // maxBounds: [[115,-240],[-115,240]],
      center: [ 32.344147, -106.758442 ],
      zoom: 10,
      minZoom:7,
      zoomControl:false,
      preferCanvas:true
    });

    this.mymap.invalidateSize({
      debounceMoveend:true
    })

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

    var googleTerrain = L.tileLayer('https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
      maxZoom: 10,
      subdomains:['mt0','mt1','mt2','mt3']
    });

    this.mymap.on("dragend", (event)=>{
      if(this.myCanvas!==undefined){
        // this.myCanvas.clearLayers()
        console.log('ARGH')
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
      // console.log(bbox)
      // console.log(topos)
      // this.markers.onFetchPoints(this.mymap, topos)
      this.socket.emit('fetchpoints', topos)
      
     
      this.theSubscription = this.socket.listen('pointssend').subscribe(data=>{
        if(this.lyrGrp===undefined){
          console.log('SOMEHTING')
        } else{
          this.lyrGrp.clearLayers()
          this.lyrGrp.addTo(this.mymap)
        }
        this.myCanvas = L.canvas({padding:0.1})
        console.log(data)
        
        
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
            },
            renderer: this.myCanvas
          }).addTo(this.lyrGrp)
          this.lyrGrp.addTo(this.mymap)

          


        // let pixiLayer = (function(){
        //   let firstDraw = true
        //   let colorScale = d3.scaleLinear<string>()
        //   .domain([0,50,100])
        //   .range(
        //     ["#c6233c", "#ffd300", "#008000"]
        //     )
        //   let pixiContainer = new PIXI.Graphics()
        //   return L.pixiOverlay(function(utils){
        //     let container = utils.getContainer()
        //     let renderer = utils.getRenderer()
        //     let project = utils.latLngToLayerPoint
        //     if(firstDraw){
        //       let geojson = data
        //       function drawPoint(color, alpha){

        //         return function(poly){
        //           let coords = project([poly[1],poly[0]])
                
                  
        //           container.beginFill(color, alpha)
        //           container.drawShape(new PIXI.Point(coords.x,coords.y))
        //         }
        //       }
        //       geojson.features.forEach((feature,index)=>{
        //         let alpha, color;
        //         var tint = d3.color(colorScale(Math.random() * 100)).rgb();
        //         color = 256 * (tint.r * 256 + tint.g) + tint.b;
        //         alpha = 0.8;

        //         if (feature.geometry===null)return;
        //         if(feature.geometry.type==='Point'){
        //           drawPoint(color,alpha)(feature.geometry.coordinates)
                  
        //         }
        //       })
              
        //     }
        //     firstDraw = false
        //     renderer.render(container)
        //   }, pixiContainer, {
        //     destroyInteractionManager:true
        //   })
        // })()
        // pixiLayer.addTo(this.mymap)

        
        
      })

    })

    

    

    
    
    
  }
  ngOnDestroy(){
    this.theSubscription.unsubscribe()
  }

  showMarkers() {
    // this.markers.testFunction()
    
  //     const n: number = this.markers.markers.length;
  //     let i: number;
  //     let m: L.circleMarker;

  //     let x: number;
  //     let y: number;
  //     this.lyrGrp = L.featureGroup()
  //   for (i = 0; i < n; ++i) {

  //     x = this.markers.markers[i].lat;
  //     y = this.markers.markers[i].long;
      
  //     m = L.circleMarker([x,y],{
  //       radius:15,
  //       fillColor:"magenta",
  //       color:"yellow",
  //       weight:2,
  //       opacity:1,
  //       fillOpacity:.8
  //     }).addTo(this.lyrGrp) 
  //   }
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
