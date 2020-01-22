import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet'
// @import "~leaflet/dist/leaflet.css";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: [
    './map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  private mymap;
  public isCollapsed = false;
  public ngbc = 'ngbCollapse'


  constructor() { }

  ngOnInit() {
  }


  ngAfterViewInit():void{
    console.log(JSON.stringify(this.ngbc))
    this.initMap()
  }

  private initMap(): void {
    this.mymap = L.map('map', {
      center: [ 32.344147, -106.758442 ],
      zoom: 10,
      zoomControl:false
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 13,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    })
    tiles.addTo(this.mymap);

    let mainMenu = L.Control.extend({
      options: {
        position: "topleft"
      },

      onAdd: function (map) {
        this._div = L.DomUtil.create('div', 'mainMenu')
        
        if (!L.Browser.touch) {
          L.DomEvent
              .disableClickPropagation(this._div)
              .disableScrollPropagation(this._div);
      } else {
          L.DomEvent.on(this._div, 'click', L.DomEvent.stopPropagation);
      }
      this._div.innerHTML ='<h3>Test panel:</h3>'
      this._div.innerHTML += `
      <div class="form-group">
      <label for="example">test input</label>
      <input type="text" class="form-control" id="example">
      <hr>
      <button 
        class="btn btn-outline-primary"
        type="button" 
        data-toggle="collapse" 
        data-target="#collapseExample" 
        aria-expanded="false" 
        aria-controls="collapseExample"> Filters</button>

        <button 
        class="btn btn-outline-primary"
        type="button" 
        (click)="isCollapsed = !isCollapsed"
        [attr.aria-expanded]="!isCollapsed" 
        aria-controls="collapseExample"> Filters</button>
      
      </form></div>
      <div id="collapseExample" class="collapse">
              <button class="btn" >filter 1</button>

              </div>

      <div id="collapseExample" [nGBCOLLAPSE]="isCollapsed">
      <button class="btn" >filter 1</button>
      </div>`
      return this._div

      }
      // setContent: function(content){
      //   this.getContainer().innerHTML = content
      // }
    
    })
    this.mymap.addControl(new mainMenu())

    

    

    // L.testControl = function(options){
    //   return new L.TestControl(options)
    // }

    // L.testControl({position:'bottomleft'}).addTo(this.mymap)


    
    
    
  }

  

}
