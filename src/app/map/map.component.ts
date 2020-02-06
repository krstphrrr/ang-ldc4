import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import * as L from 'leaflet'
// import { MapIconOptions } from './data/map-icon'
import { MarkerService } from './marker.service'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { reduce } from 'rxjs/operators';
import * as d3 from 'd3'
import { socketDataService } from '../learn/socketTest.service'


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
  public lyr;
  public tmpPoints;
  public theSubscription;
  
  
  


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
      minZoom: 3,
      maxZoom: 19,
      inertiaDeceleration: 1000,
      attributionControl: false,
      worldCopyJump: true,
      // maxBounds: [[115,-240],[-115,240]],
      center: [ 32.344147, -106.758442 ],
      zoom: 15,
      zoomControl:false,
      preferCanvas:true
    });

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
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3']
    });

    this.mymap.on("moveend", (event)=>{
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
        console.log(data)
        let m = {
          radius:5, 
          fillColor:"magenta",
          color:"yellow", 
          weight:2, 
          opacity:1, 
          fillOpacity:.8
        }
        L.geoJSON(data,{
          pointToLayer: (feature,latlng)=>{
            return L.circleMarker(latlng,m)
          }
        }).addTo(this.mymap)
        
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
