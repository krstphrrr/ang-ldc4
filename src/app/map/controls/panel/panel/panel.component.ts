import { Component, OnInit, Output, EventEmitter, Input, Renderer2, AfterViewChecked, AfterViewInit } from '@angular/core';
import * as L from 'leaflet'
import { Router } from '@angular/router';
import { Plot } from '../../../models/plot.model'
import { MarkerService } from '../../../marker.service'
import { CustomControlService } from '../../custom-control.service'


@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit, AfterViewChecked, AfterViewInit{
  public someString: string;
  pulledPlot: Plot[]=[]
  changeText:boolean;
  public drawnItems;

  @Output() filter:EventEmitter<any> = new EventEmitter()


  @Output() addMark: EventEmitter<string> = new EventEmitter<string>()
  @Output() pullDB: EventEmitter<string> = new EventEmitter<string>()
  // public public:boolean=true;
  @Input() childMessage:boolean
  @Input() childMap

  constructor(
    private router:Router,
    private markService: MarkerService,
    private ren: Renderer2,
    private cust: CustomControlService
    ) {
      this.changeText = false
     }

ngOnInit(){
  
}
ngAfterViewChecked(){
  
}
ngAfterViewInit(){
  this.layerControl(this.childMap)
  this.drawingControl(this.childMap)
}

  layerControl(mapObject){
    // mapobject should have a public copy of the L.Map used at the map component..
    let impCont = this.cust.newControl()
    impCont.addTo(mapObject)
    let container = impCont.getContainer()
    // console.log(container, 'from panellll')
    let child_div = document.getElementById('layersDiv')
    function setParent(el, newParent){
      newParent.appendChild(el)
    }
    setParent(container, child_div)
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
    console.log(container)
    let child_div = document.getElementById('drawingDiv')
    function setParent(el, newParent){
      newParent.appendChild(el)
    }
    setParent(container, child_div)
    mapObject.addLayer(drawnItems)
  }

  onLoadLink(){
    //complex calculation
    this.router.navigate(['../'])
 }

  onClick():void{
    console.log('panel points signal')
    if(this.childMessage===true){
      this.addMark.emit()
      this.childMessage=false
    } else {
      this.addMark.emit()
      this.childMessage=true
    }

    
  }

  testFilter(){
    this.filter.emit()
  }

}
