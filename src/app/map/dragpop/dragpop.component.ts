import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs'
import { wmsService } from '../../services/wms.service'
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

interface Overlays{
  name:string;
  open:boolean;
}

@Component({
  selector: 'app-dragpop',
  templateUrl: './dragpop.component.html',
  styleUrls: ['./dragpop.component.css']
})
export class DragpopComponent implements OnInit, AfterViewInit, OnDestroy{
  
  panelOpenState:boolean
  caretIcon:boolean = false
  private choice
  @Input() set message(val){
    // console.log(val)
    if(this.overlayArray.length<1){
      this.overlayArray = this.array2object(val)
    //   this.overlayArray.push({name:val[0], open:false})
    //   this.tempSet.push({name:val[0], open:false})
    // // this.overlayArray.push({name:val, open:false})
    // // this.tempSet.push({name:val, open:false})
    }
  }
  overlayChoice:Subscription
  overlayArray:Overlays[]
  tempSet:Overlays[]
  caretArrowChange(){
    this.caretIcon = !this.caretIcon
  }

  constructor(
    private wms: wmsService
  ) {
    
    this.refresh()
    
    
   }

  ngOnInit(){
    
    
  }

  ngAfterViewInit(){
    
  }

  array2object(array){
    let temparray= []
    for(let item of array){
      let tempobj = {}
      tempobj['name'] = item 
      tempobj['open'] = false
      temparray.push(tempobj)
    }
    // console.log(temparray)
    return temparray
  }
  refresh(){
    this.overlayArray = []
    this.tempSet = []

    this.overlayChoice = this.wms.getOverlaylayer().subscribe(dropdownOption=>{
      // if client sends empty array of options, close popup
      if(dropdownOption.overlay.value.length<1){
        this.wms.sendCloseSignal()
      }
      // else, populate popup with object!
      this.overlayArray = []
      this.tempSet = []
      this.overlayArray = this.array2object(dropdownOption.overlay.value)

    })
  }

  addNewRow(string){

    console.log(this.tempSet, "TEMPSET")
    console.log(this.overlayArray, "OVERLAY")
    // this.tempSet = this.over
    for(let i of string){
    if(this.tempSet.includes({name:i,open:false})){
      console.log("AHIESTA")
    } else{
      this.tempSet.push({name:i,open:false})
    }
    }
    let newSet = Array.from(new Set(this.tempSet.map(s=>s.name)))
      .map(name =>{
        return{
          name:name,
          open: this.tempSet.find(s=>s.name===name).open
        }
      })
      this.overlayArray = newSet
    
    
  }
  removeRow(string){
    // this.clickButton = true;
    // console.log(this.filterArray, string, "before")
    let arrayWithout_item = this.overlayArray.filter(function(obj){
      return obj.name != string;
    })
    let trimTemp = this.tempSet.filter(function(obj){
      return obj.name != string;
    })
    this.overlayArray = arrayWithout_item
    this.tempSet = trimTemp
    // this.resetFilter()
    
  }

  closePopup(){
    //clearing chosen overlays on popup close
    this.tempSet = []
    this.overlayArray = []
    //
    this.wms.sendCloseSignal()
  }

  ngOnDestroy(){
    this.overlayChoice.unsubscribe()
  }
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

}
